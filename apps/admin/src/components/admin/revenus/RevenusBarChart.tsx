"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { WeekRow } from "@/components/admin/revenus/adminRevenusMock";

type RevenusBarChartProps = {
  weeks: WeekRow[];
};

export function RevenusBarChart({ weeks }: RevenusBarChartProps) {
  if (weeks.length === 0) {
    return (
      <div className="mb-5 flex h-[220px] items-center justify-center rounded-2xl border border-[#E5E0D8] bg-white">
        <p className="text-[13px] text-[#6B7280]">
          Sélectionnez 7j ou 30j pour voir le détail journalier / hebdomadaire
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-[#E5E0D8] bg-white p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[#0F1E35]">
            Évolution GMV & Revenus
          </h3>
          <p className="mt-0.5 text-[11px] text-[#6B7280]">
            Barres claires = GMV · Barres foncées = Revenus DEPANNI
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded border border-[#F05A1A] bg-[rgba(240,90,26,0.25)]" />
            <span className="text-[#6B7280]">GMV</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-[#F05A1A]" />
            <span className="text-[#6B7280]">Revenus DEPANNI</span>
          </div>
        </div>
      </div>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={weeks}
            barSize={20}
            barGap={4}
            margin={{ top: 4, right: 0, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v: number, name: string) => [
                `${v.toLocaleString("fr-FR")} MAD`,
                name === "gmv" ? "GMV" : "Revenu DEPANNI",
              ]}
              cursor={{ fill: "rgba(15,30,53,0.03)" }}
            />
            <Bar
              dataKey="gmv"
              fill="rgba(240,90,26,0.2)"
              stroke="#F05A1A"
              strokeWidth={1}
              radius={[4, 4, 0, 0]}
            />
            <Bar dataKey="revenue" fill="#F05A1A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
