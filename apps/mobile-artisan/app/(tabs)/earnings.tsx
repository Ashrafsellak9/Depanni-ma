import { useState, type ReactElement } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";

import { getApiErrorMessage } from "@/src/lib/api";
import { useArtisanEarnings } from "@/src/hooks/useArtisanEarnings";
import { requestPayout } from "@/src/services/artisan";

export default function EarningsScreen(): ReactElement {
  const { data, refetch, isRefetching, isLoading } = useArtisanEarnings();
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [error, setError] = useState<string | null>(null);

  const payoutMut = useMutation({
    mutationFn: () =>
      requestPayout({
        amount: Number(amount),
        bankName: bankName.trim(),
        iban: iban.trim(),
      }),
    onSuccess: () => {
      setAmount("");
      setError(null);
      void refetch();
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const wallet = data?.wallet;

  return (
    <View style={styles.flex}>
      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>Solde wallet</Text>
        <Text style={styles.walletValue}>
          {isLoading ? "…" : `${(wallet?.balance ?? 0).toFixed(2)} ${wallet?.currency ?? "MAD"}`}
        </Text>
        <Text style={styles.walletSub}>
          Aujourd&apos;hui : {data?.summary.revenueToday?.toFixed(0) ?? 0} MAD ·{" "}
          {data?.summary.missionsToday ?? 0} mission(s)
        </Text>
      </View>

      <View style={styles.payoutBox}>
        <Text style={styles.sectionTitle}>Demande de virement</Text>
        <TextInput label="Montant (MAD)" value={amount} onChangeText={setAmount} mode="outlined" keyboardType="decimal-pad" style={styles.input} />
        <TextInput label="Banque" value={bankName} onChangeText={setBankName} mode="outlined" style={styles.input} />
        <TextInput label="IBAN" value={iban} onChangeText={setIban} mode="outlined" style={styles.input} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button mode="contained" onPress={() => payoutMut.mutate()} loading={payoutMut.isPending}>
          Demander un virement
        </Button>
      </View>

      <Text style={styles.sectionTitle}>Historique</Text>
      <FlatList
        data={data?.transactions ?? []}
        keyExtractor={(t) => t.id}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <View>
              <Text style={styles.txDesc}>{item.description ?? item.type}</Text>
              <Text style={styles.txDate}>{new Date(item.createdAt).toLocaleDateString("fr-FR")}</Text>
            </View>
            <Text style={[styles.txAmount, item.amount >= 0 ? styles.credit : styles.debit]}>
              {item.amount >= 0 ? "+" : ""}
              {item.amount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aucune transaction</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  walletCard: { margin: 16, padding: 20, backgroundColor: "#14532d", borderRadius: 16 },
  walletLabel: { color: "#86efac", fontSize: 14 },
  walletValue: { color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 4 },
  walletSub: { color: "#bbf7d0", marginTop: 8, fontSize: 13 },
  payoutBox: { marginHorizontal: 16, padding: 16, backgroundColor: "#fff", borderRadius: 12, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#14532d", marginHorizontal: 16, marginBottom: 8 },
  input: { marginBottom: 10, backgroundColor: "#fff" },
  error: { color: "#dc2626", marginBottom: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  txDesc: { fontWeight: "600", color: "#0f172a" },
  txDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
  txAmount: { fontWeight: "700", fontSize: 15 },
  credit: { color: "#15803d" },
  debit: { color: "#dc2626" },
  empty: { textAlign: "center", color: "#64748b", marginTop: 24 },
});
