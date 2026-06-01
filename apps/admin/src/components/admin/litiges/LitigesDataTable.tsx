"use client";

import { MessageSquare } from "lucide-react";

import type { AdminLitige } from "@/components/admin/litiges/adminLitigesMock";
import { LitigeStatusPill } from "@/components/admin/litiges/LitigeStatusPill";
import { PriorityBadge } from "@/components/admin/litiges/PriorityBadge";

type LitigesDataTableProps = {
  rows: AdminLitige[];
  onSelect: (litige: AdminLitige) => void;
};

export function LitigesDataTable({ rows, onSelect }: LitigesDataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E0D8]">
              {[
                { label: "Priorité", w: "w-[80px]" },
                { label: "ID", w: "w-[90px]" },
                { label: "Mission & Motif", w: "" },
                { label: "Parties", w: "" },
                { label: "Montant", w: "w-[100px]", align: "text-right" },
                { label: "Âge", w: "w-[70px]", align: "text-center" },
                { label: "Statut", w: "w-[120px]", align: "text-center" },
                { label: "Actions", w: "w-[90px]", align: "text-center" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`${col.w} px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] ${col.align ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((litige) => (
              <tr
                key={litige.id}
                onClick={() => onSelect(litige)}
                className={`cursor-pointer border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2] ${
                  litige.priority === "urgent" ? "bg-[rgba(220,38,38,0.02)]" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <PriorityBadge priority={litige.priority} />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[11px] font-semibold text-[#0F1E35]">
                    {litige.id}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-[16px]">{litige.mission.emoji}</span>
                    <div>
                      <div className="text-[12px] font-medium text-[#0F1E35]">
                        {litige.mission.service} · {litige.mission.id}
                      </div>
                      <div className="mt-0.5 text-[11px] text-[#6B7280]">{litige.reasonLabel}</div>
                      {litige.messages > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <MessageSquare size={10} className="text-[#9CA3AF]" />
                          <span className="text-[10px] text-[#9CA3AF]">
                            {litige.messages} messages
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-bold text-white"
                        style={{ background: litige.client.color }}
                      >
                        {litige.client.avatar}
                      </div>
                      <span className="text-[11px] text-[#0F1E35]">
                        {litige.client.name.split(" ")[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF]">vs</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-[9px] font-bold text-white"
                        style={{ background: litige.artisan.color }}
                      >
                        {litige.artisan.avatar}
                      </div>
                      <span className="text-[11px] text-[#0F1E35]">
                        {litige.artisan.name.split(" ")[0]}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-['Syne'] text-[13px] font-bold text-[#0F1E35]">
                    {litige.amount} MAD
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-[11px] font-semibold ${
                      litige.ageHours >= 72
                        ? "text-[#DC2626]"
                        : litige.ageHours >= 24
                          ? "text-[#F05A1A]"
                          : litige.status === "resolved"
                            ? "text-[#1B8A4E]"
                            : "text-[#6B7280]"
                    }`}
                  >
                    {litige.age}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <LitigeStatusPill status={litige.status} label={litige.statusLabel} />
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onSelect(litige)}
                    className="rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] px-3 py-1.5 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    Traiter
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-3 text-[40px]">⚖️</div>
          <div className="mb-1 text-[15px] font-semibold text-[#0F1E35]">Aucun litige trouvé</div>
          <div className="text-[13px] text-[#6B7280]">Essayez d&apos;autres filtres</div>
        </div>
      )}
    </div>
  );
}
