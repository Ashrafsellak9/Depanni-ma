"use client";

import { EarningsBalanceCard } from "@/components/artisan/EarningsBalanceCard";
import { EarningsKpiStrip } from "@/components/artisan/EarningsKpiStrip";
import { RevenusChartsSection } from "@/components/artisan/RevenusChartsSection";
import { RevenusSubscriptionCard } from "@/components/artisan/RevenusSubscriptionCard";
import { RevenusTransactions } from "@/components/artisan/RevenusTransactions";

export default function ArtisanRevenusPage() {
  return (
    <div>
      <EarningsBalanceCard />
      <EarningsKpiStrip />
      <RevenusChartsSection />
      <RevenusTransactions />
      <RevenusSubscriptionCard />
    </div>
  );
}
