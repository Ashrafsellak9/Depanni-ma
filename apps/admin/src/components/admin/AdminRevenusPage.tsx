"use client";

import { useState } from "react";

import { RevenusBarChart } from "@/components/admin/revenus/RevenusBarChart";
import { RevenusCategorySection } from "@/components/admin/revenus/RevenusCategorySection";
import { RevenusCommissionTiers } from "@/components/admin/revenus/RevenusCommissionTiers";
import { RevenusKpiCards } from "@/components/admin/revenus/RevenusKpiCards";
import { RevenusTopArtisansTable } from "@/components/admin/revenus/RevenusTopArtisansTable";
import { RevenusWeeklyTable } from "@/components/admin/revenus/RevenusWeeklyTable";
import {
  PERIOD_DATA,
  PERIOD_TABS,
  type RevenusPeriodKey,
} from "@/components/admin/revenus/adminRevenusMock";

export function AdminRevenusPage() {
  const [activePeriod, setActivePeriod] = useState<RevenusPeriodKey>("30j");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const current = PERIOD_DATA[activePeriod];

  return (
    <div>
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
