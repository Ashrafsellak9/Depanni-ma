"use client";

import type { AnalyticsPeriod } from "@/types/analytics";

const PRESETS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
  { value: "12m", label: "12 mois" },
  { value: "custom", label: "Personnalisé" },
];

export function PeriodSelector({
  period,
  from,
  to,
  onChange,
}: {
  period: AnalyticsPeriod;
  from: string;
  to: string;
  onChange: (p: AnalyticsPeriod, from?: string, to?: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex rounded-lg border bg-white p-1">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange(p.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              period === p.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <>
          <input
            type="date"
            value={from}
            onChange={(e) => onChange("custom", e.target.value, to)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <span className="text-slate-400">→</span>
          <input
            type="date"
            value={to}
            onChange={(e) => onChange("custom", from, e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
          />
        </>
      )}
    </div>
  );
}
