"use client";

import { motion } from "framer-motion";

import {
  getConversionRate,
  getFunnelForPeriod,
  type AnalyticsKpiSnapshot,
} from "@/components/admin/analytics/adminAnalyticsMock";

export function AnalyticsFunnel({ kpi }: { kpi: AnalyticsKpiSnapshot }) {
  const funnelData = getFunnelForPeriod(kpi);
  const conversionRate = getConversionRate(kpi);

  return (
    <div className="mb-5 rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">Funnel conversion</h3>

      <div className="space-y-3">
        {funnelData.map((step, i) => (
          <div key={step.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-[#0F1E35]">{step.value}</span>
                <span className="text-[11px] text-[#9CA3AF]">{step.pct}%</span>
                {i > 0 && funnelData[i - 1] && (
                  <span className="text-[10px] text-[#DC2626]">
                    −{funnelData[i - 1]!.value - step.value} perdus
                  </span>
                )}
              </div>
            </div>
            <div className="relative h-8 overflow-hidden rounded-xl bg-[#F4F0E8]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                className="flex h-full items-center rounded-xl px-3"
                style={{ background: step.color }}
              >
                <span className="text-[11px] font-bold text-white">{step.pct}%</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-[rgba(27,138,78,0.15)] bg-[rgba(27,138,78,0.06)] px-4 py-3">
        <span className="text-[12px] text-[#6B7280]">
          Taux de conversion global (demande → mission complétée)
        </span>
        <span className="font-['Syne'] text-[18px] font-bold text-[#1B8A4E]">
          {conversionRate}%
        </span>
      </div>
    </div>
  );
}
