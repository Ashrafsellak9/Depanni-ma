import type { Payment, PaymentStatus } from "@prisma/client";

import { env } from "../../config/env.js";
import { prisma } from "../../config/db.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { logPaymentAudit } from "./payments.audit.js";
import { getCommissionRate, splitCommission } from "./payments.commission.js";
import { walletService } from "./payments.wallet.js";

export class EscrowService {
  async moveToEscrow(paymentId: string, artisanId: string, actorId?: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundError("Paiement");
    if (payment.status !== "HELD") {
      throw new ConflictError("Le paiement doit être en HELD pour passer en escrow");
    }

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "ESCROW",
        artisanId,
      },
    });

    await logPaymentAudit(paymentId, "ESCROW_LOCKED", actorId, { artisanId });
    return updated;
  }

  async releaseToArtisan(paymentId: string, citizenId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        mission: { include: { job: true } },
        artisan: true,
      },
    });
    if (!payment) throw new NotFoundError("Paiement");
    if (payment.citizenId !== citizenId) throw new ForbiddenError();
    if (payment.mission.job.status !== "COMPLETED") {
      throw new ConflictError("La mission doit être terminée avant libération des fonds");
    }
    if (payment.status !== "ESCROW") {
      throw new ConflictError("Statut paiement incompatible avec la libération");
    }
    if (!payment.artisanId || !payment.artisan) {
      throw new ConflictError("Artisan non assigné");
    }

    const tier = payment.artisan.subscriptionTier;
    const rate = getCommissionRate(tier);
    const { artisanNet, depanniRevenue } = splitCommission(payment.amount, rate);

    const updated = await prisma.$transaction(async (tx) => {
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
      description: `Mission ${payment.missionId} — net artisan`,
    });

    await logPaymentAudit(paymentId, "ESCROW_RELEASED", citizenId, {
      artisanNet,
      depanniRevenue,
      rate,
    });

    return updated;
  }

  async refundFull(paymentId: string, actorId: string, reason?: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundError("Paiement");

    const refundable: PaymentStatus[] = ["HELD", "ESCROW", "FROZEN", "DISPUTED"];
    if (!refundable.includes(payment.status)) {
      throw new ConflictError("Remboursement impossible pour ce statut");
    }

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    await logPaymentAudit(paymentId, "REFUND_EXECUTED", actorId, {
      amount: payment.amount,
      reason,
    });

    return updated;
  }

  async openDispute(paymentId: string, adminId: string, reason?: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundError("Paiement");

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FROZEN" },
    });

    await logPaymentAudit(paymentId, "DISPUTE_OPENED", adminId, {
      reason,
      freezeHours: env.DISPUTE_FREEZE_HOURS,
    });
    return updated;
  }

  async initiateRefund(paymentId: string, adminId: string, reason?: string) {
    await logPaymentAudit(paymentId, "REFUND_INITIATED", adminId, { reason });
    return { paymentId, status: "INITIATED", reason };
  }

  async executeRefund(paymentId: string, adminId: string, reason?: string) {
    return this.refundFull(paymentId, adminId, reason);
  }
}

export const escrowService = new EscrowService();
