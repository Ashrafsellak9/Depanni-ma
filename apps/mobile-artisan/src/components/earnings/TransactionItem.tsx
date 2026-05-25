import { StyleSheet, Text, View } from "react-native";

import { txIcon } from "@/src/lib/transactions";
import type { WalletTransaction } from "@/src/types/artisan";

interface TransactionItemProps {
  transaction: WalletTransaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const positive = transaction.amount >= 0;
  const time = new Date(transaction.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{txIcon(transaction.type)}</Text>
      <View style={styles.body}>
        <Text style={styles.desc} numberOfLines={1}>
          {transaction.description ?? transaction.type}
        </Text>
        <Text style={styles.date}>{time}</Text>
      </View>
      <Text style={[styles.amount, positive ? styles.credit : styles.debit]}>
        {positive ? "+" : ""}
        {transaction.amount.toFixed(2)} MAD
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  icon: { fontSize: 22, width: 32, textAlign: "center" },
  body: { flex: 1 },
  desc: { fontWeight: "600", color: "#0f172a", fontSize: 15 },
  date: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  amount: { fontWeight: "800", fontSize: 15 },
  credit: { color: "#15803d" },
  debit: { color: "#dc2626" },
});
