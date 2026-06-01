"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  CATEGORY_DATA,
  CATEGORY_GMV_TOTAL,
  PIE_COLORS,
} from "@/components/admin/revenus/adminRevenusMock";

export function RevenusCategorySection() {
  return (
    <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="col-span-1 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white lg:col-span-2">
        <div className="border-b border-[#E5E0D8] px-5 py-4">
          <h3 className="text-[14px] font-semibold text-[#0F1E35]">
            Détail par catégorie de service
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                {["Catégorie", "GMV", "Revenu", "Missions", "Ticket moy.", "Croissance"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {CATEGORY_DATA.map((cat) => (
                <tr
                  key={cat.name}
                  className="border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      <span className="text-[16px]">{cat.emoji}</span>
                      <span className="font-medium text-[#0F1E35]">{cat.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0F1E35]">
                    {(cat.gmv / 1000).toFixed(0)}K MAD
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#1B8A4E]">
                    +{(cat.revenue / 1000).toFixed(1)}K MAD
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{cat.missions}</td>
                  <td className="px-4 py-3 text-[#6B7280]">
                    {cat.avgTicket.toLocaleString("fr-FR")} MAD
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[12px] font-semibold ${
                        cat.growth > 0 ? "text-[#1B8A4E]" : "text-[#DC2626]"
                      }`}
                    >
                      {cat.growth > 0 ? "↑" : "↓"} {Math.abs(cat.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5">
        <h3 className="mb-1 text-[14px] font-semibold text-[#0F1E35]">Répartition GMV</h3>
        <p className="mb-4 text-[11px] text-[#6B7280]">Par service</p>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CATEGORY_DATA.map((c) => ({ name: c.name, value: c.gmv }))}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                dataKey="value"
                strokeWidth={0}
              >
                {CATEGORY_DATA.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [`${(v / 1000).toFixed(0)}K MAD`]}
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
        <div className="space-y-1.5">
          {CATEGORY_DATA.slice(0, 4).map((cat, i) => (
            <div key={cat.name} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: PIE_COLORS[i] }}
                />
                <span className="text-[#6B7280]">{cat.name}</span>
              </div>
              <span className="font-semibold text-[#0F1E35]">
                {Math.round((cat.gmv / CATEGORY_GMV_TOTAL) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
