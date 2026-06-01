"use client";

import { BadgeCheck, ChevronRight } from "lucide-react";

import type { AdminClient } from "@/components/admin/clients/adminClientsMock";
import { TOTAL_CLIENTS_DB } from "@/components/admin/clients/adminClientsMock";
import { ClientStatusPill } from "@/components/admin/clients/ClientStatusPill";

const COL_HEADER =
  "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]";

type ClientsDataTableProps = {
  rows: AdminClient[];
  onSelect: (client: AdminClient) => void;
};

export function ClientsDataTable({ rows, onSelect }: ClientsDataTableProps) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                <th className={`${COL_HEADER} w-[220px]`}>Client</th>
                <th className={COL_HEADER}>Contact</th>
                <th className={`${COL_HEADER} w-[120px]`}>Ville</th>
                <th className={`${COL_HEADER} w-[90px] text-center`}>Missions</th>
                <th className={`${COL_HEADER} w-[120px] text-right`}>Total dépensé</th>
                <th className={`${COL_HEADER} w-[130px]`}>Dernière mission</th>
                <th className={`${COL_HEADER} w-[110px] text-center`}>Statut</th>
                <th className={`${COL_HEADER} w-[80px] text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => onSelect(client)}
                  className="cursor-pointer border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                        style={{ background: client.color }}
                      >
                        {client.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="max-w-[150px] truncate text-[12px] font-medium text-[#0F1E35]">
                            {client.name}
                          </span>
                          {client.verified && (
                            <BadgeCheck size={11} className="flex-shrink-0 text-[#1B8A4E]" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#9CA3AF]">{client.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] text-[#0F1E35]">{client.email}</div>
                    <div className="mt-0.5 text-[10px] text-[#6B7280]">{client.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6B7280]">{client.city}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[13px] font-semibold ${
                        client.missions === 0 ? "text-[#9CA3AF]" : "text-[#0F1E35]"
                      }`}
                    >
                      {client.missions}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`font-['Syne'] text-[13px] font-bold ${
                        client.totalSpent > 0 ? "text-[#1B8A4E]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {client.totalSpent > 0
                        ? `${client.totalSpent.toLocaleString("fr-FR")} MAD`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-[#6B7280]">{client.lastMission}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ClientStatusPill status={client.status} />
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelect(client)}
                      className="rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] px-2.5 py-1.5 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-3 text-[40px]">👥</div>
            <div className="mb-1 text-[15px] font-semibold text-[#0F1E35]">Aucun client trouvé</div>
            <div className="text-[13px] text-[#6B7280]">Essayez d&apos;autres filtres</div>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] text-[#6B7280]">
            Affichage 1–{rows.length} sur {TOTAL_CLIENTS_DB.toLocaleString("fr-FR")} clients
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, "...", 104].map((p, i) =>
              typeof p === "number" ? (
                <button
                  key={p}
                  type="button"
                  className={`h-8 w-8 rounded-lg text-[12px] font-medium transition-colors ${
                    p === 1
                      ? "bg-[#0F1E35] text-white"
                      : "border border-[#E5E0D8] bg-white text-[#6B7280] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {p}
                </button>
              ) : (
                <span key={`ellipsis-${i}`} className="px-1 text-[12px] text-[#6B7280]">
                  {p}
                </span>
              ),
            )}
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D8] bg-white text-[#6B7280] hover:bg-[#FAF7F2]"
              aria-label="Page suivante"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
