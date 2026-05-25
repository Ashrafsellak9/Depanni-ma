"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { KycQuickPanel } from "@/components/dashboard/KycQuickPanel";
import { MissionsTable } from "@/components/dashboard/MissionsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TopArtisansTable } from "@/components/dashboard/TopArtisansTable";
import { ActivityHeatmap } from "@/components/maps/ActivityHeatmap";
import { useAdminOverview } from "@/hooks/useAdminOverview";

export default function OverviewPage() {
  const { data, isLoading, refetch, isFetching } = useAdminOverview();

  if (isLoading || !data) {
    return <div className="py-20 text-center text-slate-500">Chargement du tableau de bord…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vue d&apos;ensemble</h2>
          <p className="text-sm text-slate-500">KPIs temps réel — El Jadida</p>
        </div>
        {isFetching && (
          <span className="text-xs text-emerald-600">Mise à jour…</span>
        )}
      </div>

      <KpiCards kpis={data.kpis} live />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenueChart} />
        </div>
        <ActivityFeed items={data.activityFeed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MissionsTable title="Missions en cours" missions={data.inProgressMissions} />
        <MissionsTable title="Missions récentes" missions={data.recentMissions.slice(0, 8)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Heatmap activité — El Jadida</CardTitle>
            </CardHeader>
            <CardContent className="h-80 p-2">
              <ActivityHeatmap points={data.heatmapPoints} />
            </CardContent>
          </Card>
        </div>
        <KycQuickPanel items={data.kycPending} onUpdated={() => void refetch()} />
      </div>

      <TopArtisansTable artisans={data.topArtisans} />
    </div>
  );
}
