"use client";

import { TOP_ARTISANS } from "@/components/admin/revenus/adminRevenusMock";

export function RevenusTopArtisansTable() {
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="border-b border-[#E5E0D8] px-5 py-4">
        <h3 className="text-[14px] font-semibold text-[#0F1E35]">
          Top artisans — générateurs de revenus
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E0D8]">
              {[
                "#",
                "Artisan",
                "Spécialité",
                "GMV généré",
                "Revenu DEPANNI",
                "Missions",
                "Commission",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_ARTISANS.map((a, i) => (
              <tr
                key={a.name}
                className="border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
              >
                <td className="px-4 py-3">
                  <span
                    className={`font-['Syne'] text-[14px] font-bold ${
                      i === 0 ? "text-[#F05A1A]" : "text-[#9CA3AF]"
                    }`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      style={{ background: a.color }}
                    >
                      {a.initials}
                    </div>
                    <span className="font-medium text-[#0F1E35]">{a.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{a.spec}</td>
                <td className="px-4 py-3 font-semibold text-[#0F1E35]">
                  {a.gmv.toLocaleString("fr-FR")} MAD
                </td>
                <td className="px-4 py-3 font-semibold text-[#1B8A4E]">
                  +{a.revenue.toLocaleString("fr-FR")} MAD
                </td>
                <td className="px-4 py-3 text-[#6B7280]">{a.missions}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      a.commission === "10%"
                        ? "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]"
                        : "bg-[rgba(15,30,53,0.07)] text-[#0F1E35]"
                    }`}
                  >
                    {a.commission}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
