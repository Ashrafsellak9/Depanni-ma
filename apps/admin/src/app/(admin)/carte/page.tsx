"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { ActivityHeatmap } from "@/components/maps/ActivityHeatmap";
import { useAdminOverview } from "@/hooks/useAdminOverview";

export default function LiveMapPage() {
  const { data, isLoading } = useAdminOverview();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Carte en direct</h2>
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Heatmap — El Jadida</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100vh-12rem)] min-h-[400px] p-2">
          {isLoading || !data ? (
            <p className="text-slate-500">Chargement…</p>
          ) : (
            <ActivityHeatmap points={data.heatmapPoints} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
