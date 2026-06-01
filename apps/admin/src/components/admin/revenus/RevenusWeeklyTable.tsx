"use client";

import { Download, FileText } from "lucide-react";
import toast from "react-hot-toast";

import type { PeriodSnapshot } from "@/components/admin/revenus/adminRevenusMock";

type RevenusWeeklyTableProps = {
  current: PeriodSnapshot;
};

export function RevenusWeeklyTable({ current }: RevenusWeeklyTableProps) {
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] px-5 py-4">
        <h3 className="text-[14px] font-semibold text-[#0F1E35]">Détail par semaine</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toast.success("Export Excel en cours de préparation…")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-1.5 text-[12px] text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
          >
            <Download size={12} />
            Export Excel
          </button>
          <button
            type="button"
            onClick={() => toast.success("Rapport PDF en cours de génération…")}
            className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-1.5 text-[12px] text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
          >
            <FileText size={12} />
            Rapport PDF
          </button>
        </div>
      </div>

      {current.weeks.length === 0 ? (
        <div className="px-5 py-10 text-center text-[13px] text-[#6B7280]">
          Pas de découpage hebdomadaire pour cette période — consultez le résumé ci-dessus.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                {["Période", "Missions", "GMV", "Revenu DEPANNI", "Commission moy.", "Croissance"].map(
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
              {current.weeks.map((week, i) => (
                <tr
                  key={week.label}
                  className="border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3 font-medium text-[#0F1E35]">{week.label}</td>
                  <td className="px-4 py-3 text-[#6B7280]">{week.missions}</td>
                  <td className="px-4 py-3">
                    <span className="font-['Syne'] text-[13px] font-bold text-[#0F1E35]">
                      {week.gmv.toLocaleString("fr-FR")} MAD
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#1B8A4E]">
                      +{week.revenue.toLocaleString("fr-FR")} MAD
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B7280]">{current.commissionRate}%</td>
                  <td className="px-4 py-3">
                    {i > 0 ? (() => {
                      const prev = current.weeks[i - 1];
                      if (!prev) return <span className="text-[#9CA3AF]">—</span>;
                      const pct = Math.abs(
                        Math.round(((week.gmv - prev.gmv) / prev.gmv) * 100),
                      );
                      return (
                        <span
                          className={`text-[12px] font-semibold ${
                            week.gmv > prev.gmv ? "text-[#1B8A4E]" : "text-[#DC2626]"
                          }`}
                        >
                          {week.gmv > prev.gmv ? "↑" : "↓"} {pct}%
                        </span>
                      );
                    })() : (
                      <span className="text-[#9CA3AF]">—</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#E5E0D8] bg-[rgba(15,30,53,0.03)]">
                <td className="px-4 py-3 text-[12px] font-bold text-[#0F1E35]">TOTAL</td>
                <td className="px-4 py-3 font-bold text-[#0F1E35]">{current.missions}</td>
                <td className="px-4 py-3">
                  <span className="font-['Syne'] text-[14px] font-black text-[#0F1E35]">
                    {current.gmv.toLocaleString("fr-FR")} MAD
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-['Syne'] text-[14px] font-black text-[#F05A1A]">
                    +{current.revenue.toLocaleString("fr-FR")} MAD
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-[#0F1E35]">
                  {current.commissionRate}%
                </td>
                <td className="px-4 py-3">
                  {current.growth != null ? (
                    <span className="text-[12px] font-bold text-[#1B8A4E]">
                      ↑ +{current.growth}%
                    </span>
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
