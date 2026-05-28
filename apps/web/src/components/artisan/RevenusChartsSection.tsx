"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BAR_CHART_DATA, SERVICE_BREAKDOWN } from "@/components/artisan/artisanRevenusMock";

const WEEK_NET = BAR_CHART_DATA.reduce((s, d) => s + d.net, 0);
const WEEK_COMMISSION = BAR_CHART_DATA.reduce((s, d) => s + (d.brut - d.net), 0);

export function RevenusChartsSection() {
  const [period, setPeriod] = useState("7j");

  return (
    <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-dep-border bg-white p-5 lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-navy">Évolution des revenus</h3>
          <div className="flex gap-1.5">
            {(["7j", "30j", "3m"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  period === p
                    ? "bg-navy text-white"
                    : "bg-[#F4F0E8] text-dep-gray hover:bg-[#E8E3DB]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={BAR_CHART_DATA}
              barSize={16}
              barGap={4}
              margin={{ top: 4, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#6B7280" }} />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E5E0D8",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) => [
                  `${v.toLocaleString("fr-FR")} MAD`,
                  name === "brut" ? "Brut" : "Net",
                ]}
                cursor={{ fill: "rgba(15,30,53,0.03)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(v) => (v === "brut" ? "Brut" : "Net après commission")}
              />
              <Bar dataKey="brut" fill="#F05A1A" radius={[4, 4, 0, 0]} opacity={0.4} />
              <Bar dataKey="net" fill="#F05A1A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-2 text-center text-[11px] text-dep-gray">
          Total semaine :
          <strong className="ml-1 text-navy">{WEEK_NET.toLocaleString("fr-FR")} MAD net</strong>
          · Commission déduite :
          <strong className="ml-1 text-orange">{WEEK_COMMISSION.toLocaleString("fr-FR")} MAD</strong>
        </p>
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-5">
        <h3 className="text-[14px] font-semibold text-navy">Par service</h3>
        <p className="mb-4 text-[11px] text-dep-gray">Répartition des revenus</p>

        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={SERVICE_BREAKDOWN}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                strokeWidth={0}
              >
                {SERVICE_BREAKDOWN.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [`${v.toLocaleString("fr-FR")} MAD`]}
                contentStyle={{
                  background: "white",
                  border: "1px solid #E5E0D8",
                  borderRadius: 8,
                  fontSize: 11,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 space-y-2">
          {SERVICE_BREAKDOWN.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="text-[12px] text-dep-gray">{s.name}</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-semibold text-navy">
                  {s.value.toLocaleString("fr-FR")} MAD
                </span>
                <span className="ml-1.5 text-[10px] text-dep-gray">{s.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
