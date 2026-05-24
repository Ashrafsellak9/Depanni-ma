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
        escrowAt: new Date(),
      },
    });

    await logPaymentAudit(paymentId, "ESCROW_LOCKED", actorId, { artisanId });
    return updated;
  }

  async releaseToArtisan(paymentId: string, citizenId: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        job: true,
        artisan: { include: { user: true } },
      },
    });
    if (!payment) throw new NotFoundError("Paiement");
    if (payment.citizenId !== citizenId) throw new ForbiddenError();
    if (payment.job.status !== "COMPLETED") {
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

      await tx.artisan.update({
        where: { id: payment.artisanId! },
        data: { totalEarnings: { increment: artisanNet } },
      });

      await tx.artisanEarning.create({
        data: {
          artisanId: payment.artisanId!,
          jobId: payment.jobId,
          grossAmount: payment.amount,
          commission: depanniRevenue,
          netAmount: artisanNet,
          status: "PAID",
          paidAt: new Date(),
        },
      });

      return p;
    });

    await walletService.credit(
      payment.artisan.userId,
      artisanNet,
      "ESCROW_RELEASE",
      { paymentId, metadata: { jobId: payment.jobId, commission: depanniRevenue } },
    );

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

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount: payment.amount,
        status: "EXECUTED",
        reason,
        initiatedBy: actorId,
        executedAt: new Date(),
      },
    });

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "REFUNDED", refundedAt: new Date() },
    });

    if (payment.method === "WALLET") {
      await walletService.credit(payment.citizenId, payment.amount, "REFUND", {
        paymentId,
        reference: refund.id,
      });
    }

    await logPaymentAudit(paymentId, "REFUND_EXECUTED", actorId, {
      amount: payment.amount,
      refundId: refund.id,
    });

    return updated;
  }

  async openDispute(paymentId: string, adminId: string, reason?: string): Promise<Payment> {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundError("Paiement");

    const resolveBy = new Date();
    resolveBy.setHours(resolveBy.getHours() + env.DISPUTE_FREEZE_HOURS);

    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "FROZEN",
        disputeOpenedAt: new Date(),
        disputeResolveBy: resolveBy,
      },
    });

    await logPaymentAudit(paymentId, "DISPUTE_OPENED", adminId, { reason, resolveBy });
    return updated;
  }

  /** Remboursement admin — étape 1 : initiation */
  async initiateRefund(paymentId: string, adminId: string, reason?: string) {
    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) throw new NotFoundError("Paiement");

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount: payment.amount,
        status: "INITIATED",
        reason,
        initiatedBy: adminId,
      },
    });

    await logPaymentAudit(paymentId, "REFUND_INITIATED", adminId, { refundId: refund.id });
    return refund;
  }

  /** Remboursement admin — étape 2 : exécution batch */
  async executeRefund(refundId: string, adminId: string) {
    const refund = await prisma.refund.findUnique({
      where: { id: refundId },
      include: { payment: true },
    });
    if (!refund) throw new NotFoundError("Remboursement");
    if (refund.status !== "INITIATED") {
      throw new ConflictError("Remboursement déjà traité");
    }

    await this.refundFull(refund.paymentId, adminId, refund.reason ?? undefined);

    return prisma.refund.update({
      where: { id: refundId },
      data: { status: "EXECUTED", executedAt: new Date() },
    });
  }
}

export const escrowService = new EscrowService();
