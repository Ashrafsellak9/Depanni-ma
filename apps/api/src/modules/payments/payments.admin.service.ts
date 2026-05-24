import { randomUUID } from "node:crypto";

import { prisma } from "../../config/db.js";
import { ConflictError, NotFoundError } from "../../utils/errors.js";
import { enqueuePayout } from "../../jobs/payoutQueue.js";
import { escrowService } from "./payments.escrow.js";
import { adminBatchPayoutSchema, adminPayoutSchema } from "./payments.schemas.js";
import { walletService } from "./payments.wallet.js";

export class PaymentsAdminService {
  async createPayout(adminId: string, input: unknown) {
    const data = adminPayoutSchema.parse(input);

    const artisan = await prisma.artisan.findUnique({
      where: { id: data.artisanId },
      include: { user: true },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const wallet = await walletService.getOrCreateWallet(artisan.userId);
    const amount = data.amount ?? wallet.balance;

    if (amount <= 0) {
      throw new ConflictError("Montant de virement invalide");
    }
    if (wallet.balance < amount) {
      throw new ConflictError("Solde wallet artisan insuffisant");
    }

    const batchId = randomUUID();

    const payout = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "PAYOUT",
          amount: -amount,
          balanceAfter: updatedWallet.balance,
          reference: data.reference ?? batchId,
        },
      });

      return tx.payout.create({
        data: {
          artisanId: artisan.id,
          amount,
          status: "PROCESSING",
          reference: data.reference,
          batchId,
          initiatedBy: adminId,
          metadata: { triggeredAt: new Date().toISOString() },
        },
      });
    });

    await enqueuePayout({
      artisanId: artisan.id,
      amount,
      currency: "MAD",
      payoutId: payout.id,
    });

    return payout;
  }

  async createBatchPayouts(adminId: string, input: unknown) {
    const data = adminBatchPayoutSchema.parse(input);
    const batchId = randomUUID();
    const results = [];

    for (const artisanId of data.artisanIds) {
      try {
        const payout = await this.createPayout(adminId, {
          artisanId,
          reference: data.reference ?? batchId,
        });
        results.push({ artisanId, success: true, payoutId: payout.id });
      } catch (err) {
        results.push({ artisanId, success: false, error: String(err) });
      }
    }

    return { batchId, results };
  }

  async listPayouts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.payout.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          artisan: {
            include: {
              user: { select: { firstName: true, lastName: true, email: true } },
            },
          },
        },
      }),
      prisma.payout.count(),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async initiateRefund(paymentId: string, adminId: string, body: unknown) {
    const reason =
      typeof body === "object" && body !== null && "reason" in body
        ? String((body as { reason?: string }).reason ?? "")
        : undefined;
    return escrowService.initiateRefund(paymentId, adminId, reason);
  }

  async executeRefund(refundId: string, adminId: string) {
    return escrowService.executeRefund(refundId, adminId);
  }
}

export const paymentsAdminService = new PaymentsAdminService();
