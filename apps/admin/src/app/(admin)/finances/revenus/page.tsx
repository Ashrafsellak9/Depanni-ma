"use client";

import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { formatMad } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

export default function RevenusPage() {
  const { data, isLoading } = useAdminOverview();

  if (isLoading || !data) return <p className="text-slate-500">Chargement…</p>;

  const weekTotal = data.revenueChart.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Revenus</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">GMV 7 jours</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{formatMad(weekTotal)}</CardContent>
      </Card>
      <RevenueChart data={data.revenueChart} />
    </div>
  );
}
