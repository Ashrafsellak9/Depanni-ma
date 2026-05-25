"use client";

import { ActivityHeatmap } from "@/components/maps/ActivityHeatmap";
import { useAdminOverview } from "@/hooks/useAdminOverview";

export default function AdminMapPage() {
  const { data, isLoading } = useAdminOverview();

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
        <div className="flex items-center justify-between border-b border-dep-border px-5 py-4">
          <h2 className="text-sm font-semibold text-navy">Carte en direct — El Jadida</h2>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-green">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative h-2 w-2 rounded-full bg-green" />
            </span>
            Live
          </span>
        </div>
        <div className="h-[calc(100vh-14rem)] min-h-[420px] p-3">
          {isLoading || !data ? (
            <p className="p-8 text-sm text-dep-gray">Chargement de la carte…</p>
          ) : (
            <ActivityHeatmap points={data.heatmapPoints} />
          )}
        </div>
      </div>
    </div>
  );
}
