import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ConflictError, NotFoundError } from "../../utils/errors.js";
import { logPaymentAudit } from "../payments/payments.audit.js";
import { escrowService } from "../payments/payments.escrow.js";
import { walletService } from "../payments/payments.wallet.js";
import { getCommissionRate, splitCommission } from "../payments/payments.commission.js";
import { logAdminAction } from "./admin.audit.js";
import type { ResolveDisputeInput } from "./admin.schemas.js";

export async function listDisputes() {
  const payments = await prisma.payment.findMany({
    where: { status: { in: ["DISPUTED", "FROZEN"] } },
    include: {
      mission: {
        include: {
          job: { select: { id: true, title: true, city: true, photos: true, status: true } },
          citizen: { select: { id: true, firstName: true, lastName: true } },
          artisan: { select: { id: true, firstName: true, lastName: true } },
          messages: { orderBy: { createdAt: "asc" }, take: 50 },
        },
      },
      auditLogs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const now = Date.now();
  return payments
    .map((p) => {
      const openedAt = p.disputeOpenedAt ?? p.updatedAt;
      const ageHours = (now - openedAt.getTime()) / 3_600_000;
      const priorityScore = p.amount * 0.7 + ageHours * 50;
      return {
        id: p.id,
        paymentId: p.id,
        missionId: p.missionId,
        amount: p.amount,
        status: p.status,
        disputeReason: p.disputeReason,
        disputeOpenedAt: openedAt.toISOString(),
        ageHours: Math.round(ageHours),
        priorityScore: Math.round(priorityScore),
        mission: p.mission,
        job: p.mission.job,
        citizen: p.mission.citizen,
        artisan: p.mission.artisan,
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

export async function getDispute(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      mission: {
        include: {
          job: true,
          citizen: { include: { user: { select: { email: true, phone: true } } } },
          artisan: { include: { user: { select: { email: true, phone: true } } } },
          messages: { orderBy: { createdAt: "asc" }, include: { sender: { select: { id: true, role: true } } } },
          payments: true,
        },
      },
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!payment || !["DISPUTED", "FROZEN", "ESCROW", "HELD"].includes(payment.status)) {
    throw new NotFoundError("Litige");
  }

  const adminLogs = await prisma.adminAuditLog.findMany({
    where: { targetType: "PAYMENT", targetId: paymentId },
    orderBy: { createdAt: "desc" },
  });

  return { payment, adminLogs };
}

export async function resolveDispute(
  paymentId: string,
  adminId: string,
  input: ResolveDisputeInput,
) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      mission: { include: { artisan: true, job: true } },
    },
  });
  if (!payment) throw new NotFoundError("Paiement");

  const resolvable: string[] = ["DISPUTED", "FROZEN", "ESCROW", "HELD"];
  if (!resolvable.includes(payment.status)) {
    throw new ConflictError("Ce paiement ne peut plus être résolu");
  }

  let result;
  switch (input.resolution) {
    case "REFUND_CLIENT":
      result = await escrowService.refundFull(paymentId, adminId, input.note);
      break;
    case "RELEASE_ARTISAN": {
      const artisan = payment.mission.artisan;
      if (!payment.artisanId || !artisan) {
        throw new ConflictError("Artisan manquant");
      }
      const tier = artisan.subscriptionTier;
      const rate = getCommissionRate(tier);
      const { artisanNet, depanniRevenue } = splitCommission(payment.amount, rate);
      result = await prisma.$transaction(async (tx) => {
        const p = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "RELEASED",
            commissionRate: rate,
            commissionAmount: depanniRevenue,
            artisanNetAmount: artisanNet,
            releasedAt: new Date(),
          },
        });
        return p;
      });
      await walletService.credit(payment.artisanId, artisanNet, "CREDIT", {
        reference: paymentId,
        description: `Litige résolu — libération fonds`,
      });
      await logPaymentAudit(paymentId, "DISPUTE_RELEASE_ARTISAN", adminId, {
        artisanNet,
        note: input.note,
      });
      break;
    }
    case "SPLIT": {
      const clientAmt = input.clientAmount ?? 0;
      const artisanAmt = input.artisanAmount ?? 0;
      if (Math.abs(clientAmt + artisanAmt - payment.amount) > 0.01) {
        throw new ConflictError("La somme client + artisan doit égaler le montant du litige");
      }
      result = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: clientAmt >= payment.amount ? "REFUNDED" : "RELEASED",
          artisanNetAmount: artisanAmt,
          commissionAmount: payment.amount - clientAmt - artisanAmt,
          releasedAt: new Date(),
          refundedAt: clientAmt > 0 ? new Date() : undefined,
        },
      });
      if (artisanAmt > 0 && payment.artisanId) {
        await walletService.credit(payment.artisanId, artisanAmt, "CREDIT", {
          reference: paymentId,
          description: `Litige résolu — part artisan`,
        });
      }
      await logPaymentAudit(paymentId, "DISPUTE_SPLIT", adminId, {
        clientAmount: clientAmt,
        artisanAmount: artisanAmt,
        note: input.note,
      });
      break;
    }
  }

  await logAdminAction(adminId, "PAYMENT", paymentId, `DISPUTE_${input.resolution}`, {
    note: input.note,
    resolution: input.resolution,
  });

  return result;
}

/** Marque un paiement en litige (admin). */
export async function openDisputeAdmin(
  paymentId: string,
  adminId: string,
  reason?: string,
): Promise<void> {
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "DISPUTED",
      disputeOpenedAt: new Date(),
      disputeReason: reason,
    },
  });
  await logPaymentAudit(paymentId, "DISPUTE_OPENED", adminId, { reason });
  await logAdminAction(adminId, "PAYMENT", paymentId, "DISPUTE_OPENED", { reason });
}
