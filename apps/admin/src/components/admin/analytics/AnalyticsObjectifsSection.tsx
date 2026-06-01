"use client";

import { motion } from "framer-motion";

import {
  getObjectifsForPeriod,
  type AnalyticsKpiSnapshot,
} from "@/components/admin/analytics/adminAnalyticsMock";

function pctColor(pct: number, exceeded?: boolean): string {
  if (exceeded) return "text-[#1B8A4E]";
  if (pct >= 80) return "text-[#1B8A4E]";
  if (pct >= 50) return "text-[#F05A1A]";
  return "text-[#DC2626]";
}

function pctBadge(pct: number, exceeded?: boolean): string {
  if (exceeded) return "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]";
  if (pct >= 80) return "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]";
  if (pct >= 50) return "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]";
  return "bg-[rgba(220,38,38,0.1)] text-[#DC2626]";
}

function barColor(pct: number, exceeded?: boolean): string {
  if (exceeded) return "#1B8A4E";
  if (pct >= 80) return "#1B8A4E";
  if (pct >= 50) return "#F05A1A";
  return "#DC2626";
}

export function AnalyticsObjectifsSection({ kpi }: { kpi: AnalyticsKpiSnapshot }) {
  const objectifs = getObjectifsForPeriod(kpi);

  return (
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">KPIs vs objectifs</h3>
      <div>
        {objectifs.map((obj) => (
          <div key={obj.label} className="mb-4 last:mb-0">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#0F1E35]">{obj.label}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-semibold ${pctColor(obj.pct, obj.exceeded)}`}>
                  {obj.current.toLocaleString("fr-FR")}
                  {obj.unit}
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  / {obj.target.toLocaleString("fr-FR")}
                  {obj.unit}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${pctBadge(obj.pct, obj.exceeded)}`}
                >
                  {obj.exceeded ? "✓ Dépassé" : `${obj.pct}%`}
                </span>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E5E0D8]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(obj.pct, 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: barColor(obj.pct, obj.exceeded) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
