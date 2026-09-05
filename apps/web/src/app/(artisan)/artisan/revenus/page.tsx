"use client";

import { EarningsBalanceCard } from "@/components/artisan/EarningsBalanceCard";
import { EarningsKpiStrip } from "@/components/artisan/EarningsKpiStrip";
import { RevenusChartsSection } from "@/components/artisan/RevenusChartsSection";
import { RevenusSubscriptionCard } from "@/components/artisan/RevenusSubscriptionCard";
import { RevenusTransactions } from "@/components/artisan/RevenusTransactions";
import type { RevenusTransaction } from "@/components/artisan/artisanRevenusMock";
import { useArtisanEarnings } from "@/hooks/artisan/useArtisanEarnings";

export default function ArtisanRevenusPage() {
  const { data } = useArtisanEarnings();
  const summary = data?.summary;
  const kpis = summary
    ? [
        {
          label: "Brut ce mois",
          value: Math.round(summary.totalCredited).toLocaleString("fr-FR"),
          suffix: " MAD",
          icon: "TrendingUp" as const,
          iconBg: "rgba(27,138,78,0.1)",
          iconColor: "#1B8A4E",
          change: `${summary.missionsToday} mission(s) aujourd'hui`,
          changeUp: true as const,
        },
        {
          label: "Net disponible",
          value: Math.round(summary.balance).toLocaleString("fr-FR"),
          suffix: " MAD",
          icon: "Wallet" as const,
          iconBg: "rgba(15,30,53,0.07)",
          iconColor: "#0F1E35",
          change: "Solde wallet",
          changeUp: null,
        },
        {
          label: "Commissions",
          value: Math.round(summary.totalCommissions).toLocaleString("fr-FR"),
          suffix: " MAD",
          icon: "Percent" as const,
          iconBg: "rgba(240,90,26,0.1)",
          iconColor: "#F05A1A",
          change: "Prélevées",
          changeUp: null,
        },
        {
          label: "Missions",
          value: String(summary.totalMissions),
          suffix: "",
          icon: "ClipboardCheck" as const,
          iconBg: "rgba(124,58,237,0.1)",
          iconColor: "#7C3AED",
          change: `Note ${summary.rating.toFixed(1)}/5`,
          changeUp: true as const,
        },
      ]
    : undefined;

  const transactions: RevenusTransaction[] | undefined = data
    ? [
        ...data.transactions.map((tx) => ({
          id: tx.id,
          type: (tx.type.toLowerCase().includes("payout") ? "virement" : "mission") as RevenusTransaction["type"],
          title: tx.description ?? tx.type,
          subtitle: tx.reference ?? "Wallet",
          date: new Date(tx.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount: tx.amount,
          status: "completed" as const,
        })),
        ...data.payouts.map((p) => ({
          id: p.id,
          type: "virement" as const,
          title: "Virement",
          subtitle: p.reference ?? p.status,
          date: new Date(p.createdAt).toLocaleString("fr-FR", {
            day: "numeric",
            month: "short",
          }),
          amount: p.amount,
          status: p.status === "COMPLETED" || p.status === "PAID" ? ("completed" as const) : ("pending" as const),
        })),
      ]
    : undefined;

  return (
    <div>
      <EarningsBalanceCard
        available={summary?.balance}
        nextTransfer={data?.payouts[0] ? "demande en cours" : "sur demande"}
      />
      <EarningsKpiStrip items={kpis} />
      <RevenusChartsSection />
      <RevenusTransactions transactions={transactions} />
      <RevenusSubscriptionCard />
    </div>
  );
}
