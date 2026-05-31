import { useCallback, useState, type ReactElement } from "react";
import { RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import { Button, Chip } from "react-native-paper";
import * as Notifications from "expo-notifications";

import { EarningsChartBar } from "@/src/components/earnings/EarningsChartBar";
import { PayoutModal } from "@/src/components/earnings/PayoutModal";
import { SubscriptionBanner } from "@/src/components/earnings/SubscriptionBanner";
import { SubscriptionCompareModal } from "@/src/components/earnings/SubscriptionCompareModal";
import { TransactionItem } from "@/src/components/earnings/TransactionItem";
import { useArtisanEarnings, type ChartPeriod } from "@/src/hooks/useArtisanEarnings";
import { groupTransactionsByDate } from "@/src/lib/transactions";
import type { SubscriptionTier } from "@/src/types/artisan";

const PERIODS: { key: ChartPeriod; label: string }[] = [
  { key: 7, label: "7j" },
  { key: 30, label: "30j" },
  { key: 90, label: "90j" },
];

export default function EarningsScreen(): ReactElement {
  const [period, setPeriod] = useState<ChartPeriod>(30);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const { data, refetch, isRefetching, isLoading } = useArtisanEarnings(period);

  const balance = data?.wallet.balance ?? 0;
  const tier = (data?.subscriptionTier ?? "STANDARD") as SubscriptionTier;
  const month = data?.monthStats;
  const sections = groupTransactionsByDate(data?.transactions ?? []);

  const onRefresh = useCallback(() => {
    void refetch();
    const pending = data?.payouts?.filter((p) => p.status === "PENDING") ?? [];
    if (pending.length === 0) return;
    void Notifications.scheduleNotificationAsync({
      content: {
        title: "Virement en cours",
        body: `${pending.length} demande(s) en traitement (${data?.payoutDelayHours ?? 72}h)`,
      },
      trigger: null,
    });
  }, [refetch, data?.payouts, data?.payoutDelayHours]);

  return (
    <View style={styles.flex}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceValue}>
          {isLoading ? "…" : `${balance.toFixed(2)} ${data?.wallet.currency ?? "MAD"}`}
        </Text>
        <Button
          mode="contained"
          buttonColor="#fff"
          textColor="#14532d"
          style={styles.payoutBtn}
          onPress={() => setPayoutOpen(true)}
          disabled={balance < 100}
        >
          Virer vers banque
        </Button>
        {balance < 100 && (
          <Text style={styles.minHint}>Minimum 100 MAD pour un virement</Text>
        )}
      </View>

      <SubscriptionBanner
        tier={tier}
        monthlyGross={month?.gross ?? 0}
        onUpgrade={() => setSubOpen(true)}
      />

      {month && (
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{month.gross.toFixed(0)}</Text>
            <Text style={styles.statLbl}>Brut mois</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statVal, styles.red]}>{month.commissions.toFixed(0)}</Text>
            <Text style={styles.statLbl}>Commissions</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{month.net.toFixed(0)}</Text>
            <Text style={styles.statLbl}>Net</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statVal}>{month.missionsCount}</Text>
            <Text style={styles.statLbl}>Missions</Text>
          </View>
        </View>
      )}

      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Revenus</Text>
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <Chip
              key={p.key}
              selected={period === p.key}
              onPress={() => setPeriod(p.key)}
              style={styles.chip}
            >
              {p.label}
            </Chip>
          ))}
        </View>
        <EarningsChartBar data={data?.chart ?? []} period={period} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListHeaderComponent={<Text style={styles.historyTitle}>Historique</Text>}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune transaction pour le moment</Text>
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />

      <PayoutModal
        visible={payoutOpen}
        balance={balance}
        tier={tier}
        onClose={() => setPayoutOpen(false)}
        onSuccess={() => void refetch()}
      />

      <SubscriptionCompareModal
        visible={subOpen}
        balance={balance}
        onClose={() => setSubOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#f8fafc" },
  balanceCard: {
    margin: 16,
    marginBottom: 8,
    padding: 24,
    backgroundColor: "#14532d",
    borderRadius: 18,
    alignItems: "center",
  },
  balanceLabel: { color: "#86efac", fontSize: 14, fontWeight: "600" },
  balanceValue: { color: "#fff", fontSize: 40, fontWeight: "800", marginTop: 8 },
  payoutBtn: { marginTop: 16, width: "100%" },
  minHint: { color: "#bbf7d0", fontSize: 12, marginTop: 8 },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statVal: { fontSize: 16, fontWeight: "800", color: "#14532d" },
  statLbl: { fontSize: 10, color: "#64748b", marginTop: 4, textAlign: "center" },
  red: { color: "#dc2626" },
  chartSection: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#14532d", marginBottom: 8 },
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  chip: { marginBottom: 4 },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#14532d",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  list: { paddingBottom: 32 },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 24, marginBottom: 24 },
});
