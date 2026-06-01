"use client";

import { COMMISSION_TIERS } from "@/components/admin/revenus/adminRevenusMock";

export function RevenusCommissionTiers() {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      {COMMISSION_TIERS.map((tier) => (
        <div
          key={tier.label}
          className="rounded-2xl border border-[#E5E0D8] bg-white p-5"
        >
          <div className="mb-3 text-[13px] font-semibold text-[#0F1E35]">{tier.label}</div>
          <div className="mb-1 font-['Syne'] text-[24px] font-bold text-[#0F1E35]">
            +{(tier.revenue / 1000).toFixed(1)}K MAD
          </div>
          <div className="mb-3 text-[11px] text-[#6B7280]">
            {tier.artisans} artisans · {tier.pct}% du revenu total
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
            <div
              className="h-full rounded-full bg-[#F05A1A]"
              style={{ width: `${tier.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
