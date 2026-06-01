import type { AnalyticsKpiSnapshot } from "@/components/admin/analytics/adminAnalyticsMock";

export function AnalyticsKpiStrip({ kpi }: { kpi: AnalyticsKpiSnapshot }) {
  const cards = [
    {
      label: "GMV total",
      value: `${(kpi.gmv / 1000).toFixed(0)}K MAD`,
      sub: kpi.gmvGrowth != null ? `+${kpi.gmvGrowth}% vs période précédente` : undefined,
      subColor: "text-[#1B8A4E]",
    },
    {
      label: "Revenus DEPANNI",
      value: `${(kpi.revenue / 1000).toFixed(1)}K MAD`,
    },
    {
      label: "Missions créées",
      value: String(kpi.missions),
    },
    {
      label: "Complétées / Annulées",
      value: `${kpi.completed} / ${kpi.cancelled}`,
    },
    {
      label: "Taux complétion",
      value: `${kpi.completionRate}%`,
    },
    {
      label: "Demandes (jobs)",
      value: String(kpi.demandes),
    },
    {
      label: "Inscriptions",
      value: `${kpi.inscriptions.citoyens} citoyens + ${kpi.inscriptions.artisans} artisans`,
    },
  ];

  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#E5E0D8] bg-white p-4"
        >
          <p className="text-[11px] text-[#6B7280]">{card.label}</p>
          <p className="mt-1 font-['Syne'] text-[18px] font-bold text-[#0F1E35]">
            {card.value}
          </p>
          {card.sub && (
            <p className={`mt-0.5 text-[11px] font-medium ${card.subColor}`}>{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}
