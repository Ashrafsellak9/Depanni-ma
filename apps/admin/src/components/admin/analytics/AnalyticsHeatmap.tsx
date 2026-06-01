"use client";

import {
  HEATMAP_DATA,
  HEATMAP_LEGEND,
  heatmapCellColor,
} from "@/components/admin/analytics/adminAnalyticsMock";

export function AnalyticsHeatmap() {
  return (
    <div className="mb-5 rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="text-[14px] font-semibold text-[#0F1E35]">
        Heatmap horaires — demandes
      </h3>
      <p className="mb-4 mt-0.5 text-[11px] text-[#6B7280]">
        Intensité des créations de jobs (jour × heure)
      </p>

      <div className="overflow-x-auto">
        {Object.entries(HEATMAP_DATA).map(([day, values]) => (
          <div key={day} className="mb-0.5 flex items-center gap-0.5">
            <span className="w-8 flex-shrink-0 text-[10px] text-[#6B7280]">{day}</span>
            {values.map((v, h) => (
              <div
                key={h}
                className="h-[18px] w-[22px] rounded-sm"
                style={{ background: heatmapCellColor(v) }}
                title={`${day} ${h}h : ${v} demandes`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] text-[#6B7280]">Moins</span>
        {HEATMAP_LEGEND.map((c, i) => (
          <div key={i} className="h-4 w-4 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-[#6B7280]">Plus</span>
      </div>
    </div>
  );
}
