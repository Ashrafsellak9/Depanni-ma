"use client";

import { motion } from "framer-motion";

import { GEO_DISTRIBUTION } from "@/components/admin/analytics/adminAnalyticsMock";

export function AnalyticsGeoSection() {
  return (
    <div className="mt-5 rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-semibold text-[#0F1E35]">
        Répartition géographique des demandes
      </h3>
      <div className="space-y-3">
        {GEO_DISTRIBUTION.map((zone) => (
          <div key={zone.zone}>
            <div className="mb-1 flex justify-between">
              <span className="text-[12px] text-[#6B7280]">{zone.zone}</span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#0F1E35]">
                  {zone.count} demandes
                </span>
                <span className="text-[11px] text-[#9CA3AF]">{zone.pct}%</span>
              </div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${zone.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-[#F05A1A]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
