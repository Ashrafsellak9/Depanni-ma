import type { WalletTransaction } from "@/src/types/artisan";

export interface TransactionSection {
  title: string;
  data: WalletTransaction[];
}

export function groupTransactionsByDate(transactions: WalletTransaction[]): TransactionSection[] {
  const map = new Map<string, WalletTransaction[]>();

  for (const tx of transactions) {
    const key = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const list = map.get(key) ?? [];
    list.push(tx);
    map.set(key, list);
  }

  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

export function txIcon(type: string): string {
  switch (type) {
    case "CREDIT":
      return "💰";
    case "COMMISSION":
      return "📉";
    case "PAYOUT":
      return "🏦";
    case "DEBIT":
      return "↗️";
    case "REFUND":
      return "↩️";
    case "TOPUP":
      return "➕";
    default:
      return "•";
  }
}
