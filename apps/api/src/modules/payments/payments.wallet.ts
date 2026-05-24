import type { Prisma, WalletTransactionType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ConflictError, NotFoundError } from "../../utils/errors.js";

export class WalletService {
  async getOrCreateWallet(userId: string, currency = "MAD") {
    return prisma.wallet.upsert({
      where: { userId },
      create: { userId, currency },
      update: {},
    });
  }

  async getBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      balance: wallet.balance,
      currency: wallet.currency,
      walletId: wallet.id,
    };
  }

  async credit(
    userId: string,
    amount: number,
    type: WalletTransactionType,
    opts?: { paymentId?: string; reference?: string; metadata?: Prisma.InputJsonValue },
  ) {
    if (amount <= 0) throw new ConflictError("Montant crédit invalide");

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: { userId },
        create: { userId, balance: amount },
        update: { balance: { increment: amount } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount,
          balanceAfter: wallet.balance,
          paymentId: opts?.paymentId,
          reference: opts?.reference,
          metadata: opts?.metadata,
        },
      });

      return wallet;
    });
  }

  async debit(
    userId: string,
    amount: number,
    type: WalletTransactionType,
    opts?: { paymentId?: string; reference?: string; metadata?: Prisma.InputJsonValue },
  ) {
    if (amount <= 0) throw new ConflictError("Montant débit invalide");

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance < amount) {
        throw new ConflictError("Solde wallet insuffisant");
      }

      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount: -amount,
          balanceAfter: updated.balance,
          paymentId: opts?.paymentId,
          reference: opts?.reference,
          metadata: opts?.metadata,
        },
      });

      return updated;
    });
  }

  async listTransactions(userId: string, page = 1, limit = 30) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({ where: { walletId: wallet.id } }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}

export const walletService = new WalletService();
