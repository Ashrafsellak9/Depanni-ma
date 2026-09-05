"use client";

import { TrendingUp } from "lucide-react";

import type { PeriodSnapshot } from "@/components/admin/revenus/adminRevenusMock";

type RevenusKpiCardsProps = {
  current: PeriodSnapshot;
};

export function RevenusKpiCards({ current }: RevenusKpiCardsProps) {
  const projectionPct = current.projection.revenue
    ? Math.round((current.revenue / current.projection.revenue) * 100)
    : 0;
  const avgTicket = current.missions ? Math.round(current.gmv / current.missions) : 0;
  const avgRevenuePerMission = current.missions
    ? Math.round(current.revenue / current.missions)
    : 0;

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
        <div className="mb-2 text-[12px] text-[#6B7280]">GMV période</div>
        <div className="mb-1 font-['Syne'] text-[36px] font-black leading-none tracking-[-2px] text-[#0F1E35]">
          {(current.gmv / 1000).toFixed(0)}K
          <span className="ml-1 font-['DM_Sans'] text-[16px] font-normal text-[#6B7280]">
            MAD
          </span>
        </div>
        {current.growth != null && (
          <div className="text-[12px] font-medium text-[#1B8A4E]">
            ↑ +{current.growth}% vs période précédente
          </div>
        )}
        <div className="mt-0.5 text-[11px] text-[#6B7280]">
          {current.missions} missions · ticket moy. {avgTicket.toLocaleString("fr-FR")} MAD
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
        <div className="mb-2 text-[12px] text-[#6B7280]">Revenu DEPANNI</div>
        <div className="mb-1 font-['Syne'] text-[36px] font-black leading-none tracking-[-2px] text-[#F05A1A]">
          {(current.revenue / 1000).toFixed(1)}K
          <span className="ml-1 font-['DM_Sans'] text-[16px] font-normal text-[#6B7280]">
            MAD
          </span>
        </div>
        <div className="text-[12px] font-medium text-[#6B7280]">
          Commission moy. {current.commissionRate}%
        </div>
        <div className="mt-0.5 text-[11px] text-[#6B7280]">
          {avgRevenuePerMission.toLocaleString("fr-FR")} MAD / mission en moy.
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D8] bg-[rgba(15,30,53,0.03)] p-5">
        <div className="mb-2 flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <TrendingUp size={12} className="text-[#F05A1A]" />
          Projection fin de mois
        </div>
        <div className="mb-1 font-['Syne'] text-[22px] font-bold leading-none tracking-[-1px] text-[#0F1E35]">
          GMV {(current.projection.gmv / 1000).toFixed(0)}K MAD
        </div>
        <div className="mb-1 text-[13px] font-semibold text-[#F05A1A]">
          Revenus {(current.projection.revenue / 1000).toFixed(0)}K MAD
        </div>
        <div className="text-[10px] text-[#9CA3AF]">
          Extrapolation linéaire basée sur les données actuelles
        </div>
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
            <div
              className="h-full rounded-full bg-[#F05A1A]"
              style={{ width: `${projectionPct}%` }}
            />
          </div>
          <div className="mt-1 text-[10px] text-[#6B7280]">
            {projectionPct}% de l&apos;objectif atteint
          </div>
        </div>
      </div>
    </div>
  );
}
