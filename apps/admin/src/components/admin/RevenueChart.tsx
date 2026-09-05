"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const DATA = [
  { day: "Lun", value: 3200 },
  { day: "Mar", value: 4100 },
  { day: "Mer", value: 3800 },
  { day: "Jeu", value: 5200 },
  { day: "Ven", value: 4800 },
  { day: "Sam", value: 6400 },
  { day: "Dim", value: 7340 },
];

export type RevenueChartData = {
  total: string;
  trend: string;
  trendUp: boolean;
  data: { day: string; amount: number; today?: boolean }[];
};

export function RevenueChart({ chart }: { chart?: RevenueChartData }) {
  const data = chart?.data.map((d) => ({ day: d.day, value: d.amount, today: d.today })) ?? DATA;
  const totalLabel = chart?.total ?? "24 840 MAD";
  const trend = chart?.trend ?? "+18% vs semaine dernière";
  const trendUp = chart?.trendUp ?? true;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-[#E5E0D8] bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy">Revenus — 7 derniers jours</h2>
        <Link href="/admin/finances" className="text-xs font-medium text-[#F05A1A] hover:underline">
          Ce mois →
        </Link>
      </div>

      <div className="mb-1 font-syne text-[28px] font-extrabold tracking-tight text-[#0F1E35]">
        {totalLabel.replace(" MAD", "")}{" "}
        <span className="font-dm text-base font-normal text-[#6B7280]">MAD</span>
      </div>
      <div className={`mb-3 text-[12px] font-medium ${trendUp ? "text-[#1B8A4E]" : "text-[#DC2626]"}`}>
        {trendUp ? "↑ " : "↓ "}
        {trend}
      </div>

      <div className="w-full" style={{ height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value: number) => [
                `${value.toLocaleString("fr-FR")} MAD`,
                "Revenus",
              ]}
              cursor={{ fill: "rgba(15,30,53,0.04)" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.today || index === data.length - 1 ? "#0F1E35" : "#F05A1A"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
