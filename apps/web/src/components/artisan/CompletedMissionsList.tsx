"use client";

import { Download } from "lucide-react";

import type { CompletedMission } from "@/components/artisan/artisanMissionsMock";

interface CompletedMissionsListProps {
  missions: CompletedMission[];
}

export function CompletedMissionsList({ missions }: CompletedMissionsListProps) {
  const totalBrut = missions.reduce((s, m) => s + m.price, 0);
  const avgRating =
    missions.length > 0
      ? (missions.reduce((s, m) => s + m.rating, 0) / missions.length).toFixed(1)
      : "—";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 grid-cols-3 gap-3 sm:max-w-md">
          <div className="rounded-xl border border-dep-border bg-white p-3 text-center">
            <div className="font-display text-[20px] font-bold text-navy">{missions.length}</div>
            <div className="text-[11px] text-dep-gray">Ce mois</div>
          </div>
          <div className="rounded-xl border border-dep-border bg-white p-3 text-center">
            <div className="font-display text-[20px] font-bold text-green">
              {totalBrut.toLocaleString("fr-FR")}
            </div>
            <div className="text-[11px] text-dep-gray">MAD brut</div>
          </div>
          <div className="rounded-xl border border-dep-border bg-white p-3 text-center">
            <div className="font-display text-[20px] font-bold text-navy">{avgRating}★</div>
            <div className="text-[11px] text-dep-gray">Note moy.</div>
          </div>
        </div>
        <div className="flex gap-2">
          <select className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm text-navy">
            <option>Ce mois</option>
            <option>Cette semaine</option>
            <option>3 derniers mois</option>
          </select>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-dep-border bg-white px-4 text-sm font-medium text-navy hover:bg-cream"
          >
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {missions.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 rounded-xl border border-dep-border bg-white p-4 transition-colors hover:bg-cream"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dep-border bg-cream text-[18px]">
              {m.service.split(" ")[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-navy">
                {m.service.slice(m.service.indexOf(" ") + 1)}
              </div>
              <div className="text-[11px] text-dep-gray">
                {m.client} · {m.date}
              </div>
            </div>
            <div className="shrink-0 text-center">
              <div className="text-[13px] font-bold text-navy">{m.price} MAD</div>
              <div className="text-[10px] text-green">net {m.net}</div>
            </div>
            <div className="shrink-0 text-[12px] text-orange">
              {"★".repeat(m.rating)}
              {"☆".repeat(5 - m.rating)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
