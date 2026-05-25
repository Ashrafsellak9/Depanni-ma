"use client";

import { useAdminOverview } from "@/hooks/useAdminOverview";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopArtisansTable } from "@/components/dashboard/TopArtisansTable";
import { KpiCards } from "@/components/dashboard/KpiCards";

export default function AnalyticsPage() {
  const { data, isLoading } = useAdminOverview();

  if (isLoading || !data) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Analytics</h2>
      <KpiCards kpis={data.kpis} />
      <RevenueChart data={data.revenueChart} />
      <TopArtisansTable artisans={data.topArtisans} />
    </div>
  );
}
