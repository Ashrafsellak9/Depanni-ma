import type { WalletTxType } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ConflictError, NotFoundError } from "../../utils/errors.js";

export class WalletService {
  async getOrCreateWallet(artisanId: string, currency = "MAD") {
    return prisma.wallet.upsert({
      where: { artisanId },
      create: { artisanId, currency },
      update: {},
    });
  }

  async getBalance(artisanId: string) {
    const wallet = await this.getOrCreateWallet(artisanId);
    return {
      balance: wallet.balance,
      currency: wallet.currency,
      walletId: wallet.id,
      artisanId,
    };
  }

  async credit(
    artisanId: string,
    amount: number,
    type: WalletTxType,
    opts?: { reference?: string; description?: string },
  ) {
    if (amount <= 0) throw new ConflictError("Montant crédit invalide");

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: { artisanId },
        create: { artisanId, balance: amount },
        update: { balance: { increment: amount } },
      });

      const balanceBefore = wallet.balance - amount;
      await tx.walletTransaction.create({
        data: {
          artisanId,
          type,
          amount,
          balanceBefore,
          balanceAfter: wallet.balance,
          reference: opts?.reference,
          description: opts?.description,
        },
      });

      return wallet;
    });
  }

  async debit(
    artisanId: string,
    amount: number,
    type: WalletTxType,
    opts?: { reference?: string; description?: string },
  ) {
    if (amount <= 0) throw new ConflictError("Montant débit invalide");

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { artisanId } });
      if (!wallet || wallet.balance < amount) {
        throw new ConflictError("Solde wallet insuffisant");
      }

      const balanceBefore = wallet.balance;
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: amount } },
      });

      await tx.walletTransaction.create({
        data: {
          artisanId,
          type,
          amount: -amount,
          balanceBefore,
          balanceAfter: updated.balance,
          reference: opts?.reference,
          description: opts?.description,
        },
      });

      return updated;
    });
  }

  async listTransactions(artisanId: string, page = 1, limit = 30) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where: { artisanId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.walletTransaction.count({ where: { artisanId } }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async requireArtisanWallet(artisanId: string) {
    const wallet = await prisma.wallet.findUnique({ where: { artisanId } });
    if (!wallet) throw new NotFoundError("Wallet");
    return wallet;
  }
}

export const walletService = new WalletService();
