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
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const wallet = await walletService.getOrCreateWallet(artisan.id);
    const amount = data.amount ?? wallet.balance;

    if (amount <= 0) {
      throw new ConflictError("Montant de virement invalide");
    }
    if (wallet.balance < amount) {
      throw new ConflictError("Solde wallet artisan insuffisant");
    }

    const batchId = randomUUID();

    const payout = await prisma.$transaction(async (tx) => {
      const balanceBefore = wallet.balance;
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.walletTransaction.create({
        data: {
          artisanId: artisan.id,
          type: "PAYOUT",
          amount: -amount,
          balanceBefore,
          balanceAfter: updatedWallet.balance,
          reference: data.reference ?? batchId,
          description: "Virement admin",
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

  async listPayouts(query: { page?: number; limit?: number; status?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where = query.status ? { status: query.status as never } : {};

    const [items, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          artisan: {
            select: { id: true, firstName: true, lastName: true, userId: true },
          },
        },
      }),
      prisma.payout.count({ where }),
    ]);

    const mapped = items.map((p) => {
      const bank = p.bankDetails as { iban?: string; bankName?: string } | null;
      return {
        ...p,
        iban: bank?.iban ?? p.reference ?? null,
        bankName: bank?.bankName ?? null,
      };
    });

    return { items: mapped, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  /** Traite tous les virements en statut PENDING (débit wallet + file payout). */
  async processPendingPayoutsBatch(adminId: string) {
    const pending = await prisma.payout.findMany({
      where: { status: "PENDING" },
      include: { artisan: true },
    });

    const results: Array<{ payoutId: string; success: boolean; error?: string }> = [];

    for (const payout of pending) {
      try {
        const wallet = await walletService.getOrCreateWallet(payout.artisanId);
        if (wallet.balance < payout.amount) {
          throw new ConflictError("Solde insuffisant");
        }

        await prisma.$transaction(async (tx) => {
          const balanceBefore = wallet.balance;
          const updatedWallet = await tx.wallet.update({
            where: { id: wallet.id },
            data: { balance: { decrement: payout.amount } },
          });

          await tx.walletTransaction.create({
            data: {
              artisanId: payout.artisanId,
              type: "PAYOUT",
              amount: -payout.amount,
              balanceBefore,
              balanceAfter: updatedWallet.balance,
              reference: payout.id,
              description: "Virement batch admin",
            },
          });

          await tx.payout.update({
            where: { id: payout.id },
            data: { status: "PROCESSING", initiatedBy: adminId },
          });
        });

        await enqueuePayout({
          artisanId: payout.artisanId,
          amount: payout.amount,
          currency: "MAD",
          payoutId: payout.id,
        });

        results.push({ payoutId: payout.id, success: true });
      } catch (err) {
        results.push({ payoutId: payout.id, success: false, error: String(err) });
      }
    }

    return { processed: results.filter((r) => r.success).length, total: pending.length, results };
  }

  async initiateRefund(paymentId: string, adminId: string, body: unknown) {
    const reason =
      typeof body === "object" && body !== null && "reason" in body
        ? String((body as { reason?: string }).reason ?? "")
        : undefined;
    return escrowService.initiateRefund(paymentId, adminId, reason);
  }

  async executeRefund(paymentId: string, adminId: string, body: unknown) {
    const reason =
      typeof body === "object" && body !== null && "reason" in body
        ? String((body as { reason?: string }).reason ?? "")
        : undefined;
    return escrowService.executeRefund(paymentId, adminId, reason);
  }
}

export const paymentsAdminService = new PaymentsAdminService();
