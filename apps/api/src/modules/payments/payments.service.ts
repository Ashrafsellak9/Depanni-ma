import { randomUUID } from "node:crypto";

import type { Payment, PaymentMethod } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
import { AppError, ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
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

  async resolveJobAmount(jobId: string): Promise<number> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { acceptedOffer: true, offers: { where: { status: "ACCEPTED" }, take: 1 } },
    });
    if (!job) throw new NotFoundError("Mission");

    const offerAmount = job.acceptedOffer?.amount ?? job.offers[0]?.amount;
    if (offerAmount) return offerAmount;
    if (job.budgetMax) return job.budgetMax;
    if (job.budgetMin) return job.budgetMin;
    throw new ConflictError("Montant de mission non défini");
  }

  async initiatePayment(
    citizenId: string,
    input: unknown,
    idempotencyHeader?: string,
  ): Promise<Record<string, unknown>> {
    const data: InitiatePaymentInput = initiatePaymentSchema.parse(input);
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
      const job = await prisma.job.findUnique({ where: { id: data.jobId } });
      if (!job) throw new NotFoundError("Mission");
      if (job.citizenId !== citizenId) throw new ForbiddenError();

      const amount = data.amount ?? (await this.resolveJobAmount(data.jobId));
      const artisan = job.acceptedOfferId
        ? await prisma.offer.findUnique({
            where: { id: job.acceptedOfferId },
            select: { artisanId: true },
          })
        : null;

      const tier = artisan
        ? (
            await prisma.artisan.findUnique({
              where: { id: artisan.artisanId },
              select: { subscriptionTier: true },
            })
          )?.subscriptionTier ?? "STANDARD"
        : "STANDARD";

      const rate = getCommissionRate(tier);
      const { artisanNet, depanniRevenue } = splitCommission(amount, rate);

      const cmiOrderId = data.method === "CARD" ? `depanni-${randomUUID()}` : null;

      let payment = await prisma.payment.create({
        data: {
          idempotencyKey,
          jobId: data.jobId,
          citizenId,
          artisanId: artisan?.artisanId,
          method: data.method as PaymentMethod,
          status: "PENDING",
          amount,
          commissionRate: rate,
          commissionAmount: depanniRevenue,
          artisanNetAmount: artisanNet,
          cmiOrderId,
        },
      });

      await logPaymentAudit(payment.id, "PAYMENT_INITIATED", citizenId, {
        method: data.method,
        amount,
      });

      if (data.method === "WALLET") {
        await walletService.debit(citizenId, amount, "ESCROW_HOLD", { paymentId: payment.id });
        payment = await this.markHeld(payment.id, citizenId, { cmiTransactionId: "WALLET" });
      } else if (data.method === "CASH") {
        payment = await this.markHeld(payment.id, citizenId, { cmiTransactionId: "CASH" });
      } else if (data.method === "CARD") {
        const citizen = await prisma.user.findUnique({
          where: { id: citizenId },
          select: { email: true },
        });
        const cmi = buildCmiPaymentForm({
          orderId: cmiOrderId!,
          amount,
          email: citizen?.email,
          description: `DEPANNI mission ${data.jobId}`,
        });
        return {
          payment: await this.formatPaymentResponse(payment),
          cmi,
        };
      }

      if (payment.status === "HELD" && payment.artisanId && job.acceptedOfferId) {
        payment = await escrowService.moveToEscrow(payment.id, payment.artisanId, citizenId);
      }

      return { payment: await this.formatPaymentResponse(payment) };
    } finally {
      await redis.del(this.idempotencyRedisKey(idempotencyKey));
    }
  }

  async markHeld(
    paymentId: string,
    actorId: string,
    meta?: { cmiTransactionId?: string },
  ): Promise<Payment> {
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "HELD",
        heldAt: new Date(),
        cmiTransactionId: meta?.cmiTransactionId,
      },
    });
    await logPaymentAudit(paymentId, "PAYMENT_HELD", actorId, meta);
    return updated;
  }

  async handleCmiCallback(params: Record<string, string>): Promise<void> {
    if (!verifyCmiCallback(params)) {
      throw new AppError(401, "CMI_INVALID_SIGNATURE", "Signature CMI invalide");
    }

    const orderId = params.oid ?? params.OID;
    const procReturn = params.ProcReturnCode ?? params.procreturncode;
    const transId = params.TransId ?? params.transid;

    if (!orderId) {
      throw new AppError(400, "CMI_INVALID_PAYLOAD", "oid manquant");
    }

    const payment = await prisma.payment.findUnique({ where: { cmiOrderId: orderId } });
    if (!payment) {
      throw new NotFoundError("Paiement");
    }

    if (payment.status !== "PENDING") {
      return;
    }

    if (procReturn === "00" || procReturn === "0") {
      await this.markHeld(payment.id, "CMI_WEBHOOK", { cmiTransactionId: transId });

      const job = await prisma.job.findUnique({
        where: { id: payment.jobId },
        include: { acceptedOffer: true },
      });
      if (job?.acceptedOffer && payment.artisanId) {
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

  async onOfferAccepted(jobId: string, artisanId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { jobId, status: { in: ["HELD", "PENDING"] } },
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

  async onJobCancelled(jobId: string, actorId: string): Promise<void> {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return;

    if (job.status === "IN_PROGRESS" || job.status === "COMPLETED") {
      return;
    }

    const payment = await prisma.payment.findFirst({
      where: {
        jobId,
        status: { in: ["HELD", "ESCROW", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return;

    if (payment.status === "PENDING") {
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      return;
    }

    await escrowService.refundFull(payment.id, actorId, "Annulation avant départ");
  }

  async onMissionCompleted(jobId: string, citizenId: string): Promise<void> {
    const payment = await prisma.payment.findFirst({
      where: { jobId, status: "ESCROW" },
      orderBy: { createdAt: "desc" },
    });
    if (!payment) return;

    await escrowService.releaseToArtisan(payment.id, citizenId);
  }

  async listCitizenPayments(citizenId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where: { citizenId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: { select: { id: true, title: true, status: true } },
        },
      }),
      prisma.payment.count({ where: { citizenId } }),
    ]);

    return {
      items: await Promise.all(items.map((p) => this.formatPaymentResponse(p))),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async topupWallet(citizenId: string, input: unknown, idempotencyHeader?: string) {
    const data = topupWalletSchema.parse(input);
    const key = idempotencyHeader ?? data.idempotencyKey ?? randomUUID();

    const existing = await prisma.walletTransaction.findFirst({
      where: { reference: key, wallet: { userId: citizenId } },
    });
    if (existing) {
      return walletService.getBalance(citizenId);
    }

    await walletService.credit(citizenId, data.amount, "TOPUP", {
      reference: key,
      metadata: { source: "topup" },
    });

    return walletService.getBalance(citizenId);
  }

  private async formatPaymentResponse(payment: Payment) {
    return {
      id: payment.id,
      jobId: payment.jobId,
      method: payment.method,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      commissionRate: payment.commissionRate,
      commissionAmount: payment.commissionAmount,
      artisanNetAmount: payment.artisanNetAmount,
      heldAt: payment.heldAt,
      escrowAt: payment.escrowAt,
      releasedAt: payment.releasedAt,
      refundedAt: payment.refundedAt,
      createdAt: payment.createdAt,
    };
  }
}

export const paymentsService = new PaymentsService();
