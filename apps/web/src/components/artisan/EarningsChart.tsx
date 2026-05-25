"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DATA = [
  { day: "Lun", value: 255, missions: 1 },
  { day: "Mar", value: 425, missions: 2 },
  { day: "Mer", value: 0, missions: 0 },
  { day: "Jeu", value: 680, missions: 3 },
  { day: "Ven", value: 320, missions: 1 },
  { day: "Sam", value: 850, missions: 4 },
  { day: "Dim", value: 670, missions: 3 },
];

export function EarningsChart() {
  const [period, setPeriod] = useState("7j");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full rounded-2xl border border-dep-border bg-white p-5"
    >
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-navy">Revenus — 7 derniers jours</h3>
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

      <div className="mb-4">
        <span className="font-syne text-[32px] font-extrabold tracking-tight text-navy">
          {(3200).toLocaleString("fr-FR")}
        </span>
        <span className="ml-1 text-[14px] text-dep-gray">MAD</span>
        <span className="ml-3 text-[12px] font-medium text-green">↑ +15% vs sem. dernière</span>
      </div>

      <div className="w-full" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} barSize={24} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E0D8",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v.toLocaleString("fr-FR")} MAD`, "Revenus"]}
              cursor={{ fill: "rgba(15,30,53,0.04)" }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {DATA.map((entry, i) => (
                <Cell key={entry.day} fill={i === 5 ? "#0F1E35" : "#F05A1A"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-[12px] text-dep-gray">
        Net après commission (15%) : {(2720).toLocaleString("fr-FR")} MAD
      </p>
    </motion.div>
  );
}
