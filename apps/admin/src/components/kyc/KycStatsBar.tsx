import type { KycStats } from "@/types/moderation";

export function KycStatsBar({ stats }: { stats: KycStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {[
        { label: "En attente", value: stats.pending, color: "text-amber-600" },
        { label: "Délai moyen", value: `${stats.avgProcessingHours}h`, color: "text-slate-700" },
        { label: "Taux approbation", value: `${stats.approvalRate}%`, color: "text-emerald-600" },
        { label: "Approuvés / Refusés", value: `${stats.approved} / ${stats.rejected}`, color: "text-slate-600" },
      ].map((s) => (
        <div key={s.label} className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">{s.label}</p>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
