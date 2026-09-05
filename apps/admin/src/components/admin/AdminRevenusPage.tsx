"use client";

import { useEffect, useState } from "react";

import { RevenusBarChart } from "@/components/admin/revenus/RevenusBarChart";
import { RevenusCategorySection } from "@/components/admin/revenus/RevenusCategorySection";
import { RevenusCommissionTiers } from "@/components/admin/revenus/RevenusCommissionTiers";
import { RevenusKpiCards } from "@/components/admin/revenus/RevenusKpiCards";
import { RevenusTopArtisansTable } from "@/components/admin/revenus/RevenusTopArtisansTable";
import { RevenusWeeklyTable } from "@/components/admin/revenus/RevenusWeeklyTable";
import {
  PERIOD_DATA,
  PERIOD_TABS,
  type PeriodSnapshot,
  type RevenusPeriodKey,
} from "@/components/admin/revenus/adminRevenusMock";
import { mapRevenueToSnapshot } from "@/lib/adminUiMappers";
import { fetchRevenueReport } from "@/services/adminApi";
import type { AnalyticsPeriod } from "@/types/analytics";

const PERIOD_MAP: Record<RevenusPeriodKey, AnalyticsPeriod> = {
  "7j": "7d",
  "30j": "30d",
  "90j": "90d",
  "12m": "12m",
};

export function AdminRevenusPage() {
  const [activePeriod, setActivePeriod] = useState<RevenusPeriodKey>("30j");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [live, setLive] = useState<PeriodSnapshot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const params = showCustom && customFrom && customTo
      ? { period: "custom" as const, from: customFrom, to: customTo }
      : { period: PERIOD_MAP[activePeriod] };
    fetchRevenueReport(params)
      .then((report) => {
        if (!cancelled) {
          setLive(mapRevenueToSnapshot(report));
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLive(null);
          setError("Rapport revenus indisponible — affichage de repli.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [activePeriod, showCustom, customFrom, customTo]);

  const current = live ?? PERIOD_DATA[activePeriod];

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-orange/20 bg-orange/[0.06] px-4 py-2 text-sm text-navy">
          {error}
        </p>
      )}
      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="flex flex-wrap rounded-xl border border-[#E5E0D8] bg-white p-1">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActivePeriod(tab.id);
                setShowCustom(false);
              }}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                !showCustom && activePeriod === tab.id
                  ? "bg-[#0F1E35] text-white"
                  : "text-[#6B7280] hover:bg-[#FAF7F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
              showCustom
                ? "bg-[#0F1E35] text-white"
                : "text-[#6B7280] hover:bg-[#FAF7F2]"
            }`}
          >
            Personnalisé
          </button>
        </div>

        {showCustom && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="rounded-xl border border-[#E5E0D8] px-3 py-1.5 text-[12px] text-[#0F1E35]"
            />
            <span className="text-[#9CA3AF]">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="rounded-xl border border-[#E5E0D8] px-3 py-1.5 text-[12px] text-[#0F1E35]"
            />
          </div>
        )}
      </div>

      <RevenusKpiCards current={current} />
      <RevenusBarChart weeks={current.weeks} />
      <RevenusWeeklyTable current={current} />
      <RevenusCategorySection />
      <RevenusTopArtisansTable />
      <RevenusCommissionTiers />
    </div>
  );
}
