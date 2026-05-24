import { randomUUID } from "node:crypto";

import type { Payment, PaymentMethod } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
import { AppError, ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { getCitizenIdByUserId } from "../../utils/profile.js";
import { logPaymentAudit } from "./payments.audit.js";
import { getCommissionRate, splitCommission } from "./payments.commission.js";
import { buildCmiPaymentForm, verifyCmiCallback } from "./payments.cmi.js";
import { escrowService } from "./payments.escrow.js";
import {
  initiatePaymentSchema,
  topupWalletSchema,
  type InitiatePaymentInput,
} from "./payments.schemas.js";
import { walletService } from "./payments.wallet.js";

export class PaymentsService {
  private idempotencyRedisKey(key: string): string {
    return `payment:idempotency:${key}`;
  }

  async resolveMissionAmount(missionId: string): Promise<number> {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: { offer: true, job: true },
    });
    if (!mission) throw new NotFoundError("Mission");

    if (mission.totalAmount > 0) return mission.totalAmount;
    if (mission.offer.price > 0) return mission.offer.price;
    if (mission.job.budgetMax) return mission.job.budgetMax;
    if (mission.job.budgetMin) return mission.job.budgetMin;
    throw new ConflictError("Montant de mission non défini");
  }

  async resolveMissionAmountByJobId(jobId: string): Promise<{ missionId: string; amount: number }> {
    const mission = await prisma.mission.findUnique({
      where: { jobId },
      include: { offer: true, job: true },
    });
    if (!mission) throw new NotFoundError("Mission");
    const amount = await this.resolveMissionAmount(mission.id);
    return { missionId: mission.id, amount };
  }

  async initiatePayment(
    citizenUserId: string,
    input: unknown,
    idempotencyHeader?: string,
  ): Promise<Record<string, unknown>> {
    const data: InitiatePaymentInput = initiatePaymentSchema.parse(input);
    const citizenId = await getCitizenIdByUserId(citizenUserId);
    const idempotencyKey = idempotencyHeader ?? data.idempotencyKey ?? randomUUID();

    const existing = await prisma.payment.findUnique({ where: { idempotencyKey } });
    if (existing) {
      return this.formatPaymentResponse(existing);
    }

    const redis = getRedis();
    const locked = await redis.set(this.idempotencyRedisKey(idempotencyKey), "1", "EX", 300, "NX");
    if (!locked) {
      const again = await prisma.payment.findUnique({ where: { idempotencyKey } });
      if (again) return this.formatPaymentResponse(again);
      throw new ConflictError("Paiement en cours de traitement");
    }

    try {
      const job = await prisma.job.findUnique({
        where: { id: data.jobId },
        include: { mission: { include: { offer: true } } },
      });
      if (!job) throw new NotFoundError("Mission");
      if (job.citizenId !== citizenId) throw new ForbiddenError();

      const mission = job.mission;
      if (!mission) {
        throw new ConflictError("Aucune mission active — acceptez une offre d'abord");
      }

      const amount = data.amount ?? mission.totalAmount ?? mission.offer.price;
      const artisanId = mission.artisanId;

      const tier =
        (
          await prisma.artisan.findUnique({
            where: { id: artisanId },
            select: { subscriptionTier: true },
          })
        )?.subscriptionTier ?? "STANDARD";

      const rate = getCommissionRate(tier);
      const { artisanNet, depanniRevenue } = splitCommission(amount, rate);

      const cmiRef = data.method === "CARD" ? `depanni-${randomUUID()}` : null;

      if (data.method === "WALLET") {
        throw new ConflictError(
          "Paiement wallet citoyen non disponible — utilisez CARD ou CASH",
        );
      }

      let payment = await prisma.payment.create({
        data: {
          idempotencyKey,
          missionId: mission.id,
          citizenId,
          artisanId,
          method: data.method as PaymentMethod,
          status: "PENDING",
          amount,
          commissionRate: rate,
          commissionAmount: depanniRevenue,
          artisanNetAmount: artisanNet,
          cmiRef,
        },
      });

      await logPaymentAudit(payment.id, "PAYMENT_INITIATED", citizenUserId, {
        method: data.method,
        amount,
      });

      if (data.method === "CASH") {
        payment = await this.markHeld(payment.id, citizenUserId);
      } else if (data.method === "CARD") {
        const citizen = await prisma.citizen.findUnique({
          where: { id: citizenId },
          include: { user: { select: { email: true } } },
        });
        const cmi = buildCmiPaymentForm({
          orderId: cmiRef!,
          amount,
          email: citizen?.user.email,
          description: `DEPANNI mission ${mission.id}`,
        });
        return {
          payment: await this.formatPaymentResponse(payment),
          cmi,
        };
      }

      if (payment.status === "HELD" && payment.artisanId) {
        payment = await escrowService.moveToEscrow(payment.id, payment.artisanId, citizenUserId);
      }

      return { payment: await this.formatPaymentResponse(payment) };
    } finally {
      await redis.del(this.idempotencyRedisKey(idempotencyKey));
    }
  }

  async markHeld(paymentId: string, actorId: string): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "HELD",
        heldAt: new Date(),
      },
    });
    await logPaymentAudit(paymentId, "PAYMENT_HELD", actorId);
    return updated;
  }

  async handleCmiCallback(params: Record<string, string>): Promise<void> {
    if (!verifyCmiCallback(params)) {
      throw new AppError(401, "CMI_INVALID_SIGNATURE", "Signature CMI invalide");
    }

    const orderId = params.oid ?? params.OID;
    const procReturn = params.ProcReturnCode ?? params.procreturncode;

    if (!orderId) {
      throw new AppError(400, "CMI_INVALID_PAYLOAD", "oid manquant");
    }

    const payment = await prisma.payment.findUnique({ where: { cmiRef: orderId } });
    if (!payment) {
      throw new NotFoundError("Paiement");
    }

    if (payment.status !== "PENDING") {
      return;
    }

    if (procReturn === "00" || procReturn === "0") {
      await this.markHeld(payment.id, "CMI_WEBHOOK");

      if (payment.artisanId) {
        await escrowService.moveToEscrow(payment.id, payment.artisanId, "CMI_WEBHOOK");
      }
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });
      await logPaymentAudit(payment.id, "PAYMENT_FAILED", "CMI_WEBHOOK", { procReturn });
    }
  }

  async onOfferAccepted(missionId: string, artisanId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { missionId, status: { in: ["HELD", "PENDING"] } },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return;

    if (payment.status === "PENDING") return;

    await prisma.payment.update({
      where: { id: payment.id },
      data: { artisanId },
    });

    await escrowService.moveToEscrow(payment.id, artisanId, "SYSTEM");
  }

  async onJobCancelled(jobId: string, citizenId: string): Promise<void> {
    const mission = await prisma.mission.findUnique({ where: { jobId } });
    if (!mission) return;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return;

    if (job.status === "IN_PROGRESS" || job.status === "COMPLETED") {
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: {
        missionId: mission.id,
        status: { in: ["HELD", "ESCROW", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return;

    if (payment.status === "PENDING") {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      return;
    }

    await escrowService.refundFull(payment.id, citizenId, "Annulation avant départ");
  }

  async onMissionCompleted(missionId: string, citizenId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { missionId, status: "ESCROW" },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return;

    await escrowService.releaseToArtisan(payment.id, citizenId);
  }

  async listCitizenPayments(citizenUserId: string, page = 1, limit = 20) {
    const citizenId = await getCitizenIdByUserId(citizenUserId);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where: { citizenId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          mission: {
            include: { job: { select: { id: true, title: true, status: true } } },
          },
        },
      }),
      prisma.payment.count({ where: { citizenId } }),
    ]);

    return {
      items: await Promise.all(items.map((p) => this.formatPaymentResponse(p))),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async topupWallet(_citizenUserId: string, input: unknown, _idempotencyHeader?: string) {
    topupWalletSchema.parse(input);
    throw new ConflictError("Recharge wallet réservée aux artisans");
  }

  private async formatPaymentResponse(payment: Payment) {
    return {
      id: payment.id,
      missionId: payment.missionId,
      method: payment.method,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      commissionRate: payment.commissionRate,
      commissionAmount: payment.commissionAmount,
      artisanNetAmount: payment.artisanNetAmount,
      heldAt: payment.heldAt,
      releasedAt: payment.releasedAt,
      refundedAt: payment.refundedAt,
      createdAt: payment.createdAt,
    };
  }
}

export const paymentsService = new PaymentsService();
