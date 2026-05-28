"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import type { AdminMissionRow, MissionSortKey } from "@/components/admin/missions/adminMissionsMock";
import { StatusPill } from "@/components/admin/StatusPill";

const COLUMNS: { key: MissionSortKey | "actions"; label: string; w: string; sortable: boolean }[] = [
  { key: "id", label: "Mission ID", w: "w-[100px]", sortable: true },
  { key: "client", label: "Client", w: "w-[180px]", sortable: true },
  { key: "service", label: "Service", w: "w-[130px]", sortable: true },
  { key: "artisan", label: "Artisan", w: "w-[130px]", sortable: true },
  { key: "amount", label: "Montant", w: "w-[100px]", sortable: true },
  { key: "commission", label: "Commission", w: "w-[110px]", sortable: true },
  { key: "status", label: "Statut", w: "w-[120px]", sortable: true },
  { key: "date", label: "Date", w: "w-[140px]", sortable: true },
  { key: "actions", label: "Actions", w: "w-[100px]", sortable: false },
];

type MissionsDataTableProps = {
  rows: AdminMissionRow[];
  totalCount: number;
  sortKey: MissionSortKey;
  sortDir: "asc" | "desc";
  onSort: (key: MissionSortKey) => void;
  onSelect: (mission: AdminMissionRow) => void;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export function MissionsDataTable({
  rows,
  totalCount,
  sortKey,
  sortDir,
  onSort,
  onSelect,
  page,
  pageSize,
  onPageChange,
}: MissionsDataTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[#E5E0D8]">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && onSort(col.key as MissionSortKey)}
                    className={`${col.w} px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] ${
                      col.sortable ? "cursor-pointer hover:text-[#0F1E35]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        <span className="text-[#F05A1A]">{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => onSelect(m)}
                  className="cursor-pointer border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[12px] font-semibold text-[#0F1E35]">
                        {m.id}
                      </span>
                      {m.urgency && (
                        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#F05A1A] text-[8px] font-black text-white">
                          !
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                        style={{ background: m.client.color }}
                      >
                        {m.client.avatar}
                      </div>
                      <div>
                        <div className="text-[12px] font-medium text-[#0F1E35]">{m.client.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{m.client.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#0F1E35]">
                      <span className="text-[14px]">{m.emoji}</span>
                      {m.service}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {m.artisan === "—" ? (
                      <span className="text-[12px] italic text-[#9CA3AF]">Non assigné</span>
                    ) : (
                      <span className="text-[12px] font-medium text-[#0F1E35]">{m.artisan}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-['Syne'] text-[13px] font-bold text-[#0F1E35]">
                      {m.amount > 0 ? `${m.amount} MAD` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[12px] font-semibold ${
                        m.commission > 0 ? "text-[#1B8A4E]" : "text-[#9CA3AF]"
                      }`}
                    >
                      {m.commission > 0 ? `+${m.commission} MAD` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={m.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] text-[#6B7280]">{m.date}</span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelect(m)}
                        className="rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] px-2.5 py-1.5 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                      >
                        Voir
                      </button>
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] text-[#6B7280] transition-colors hover:bg-[#F0EBE1]"
                        aria-label="Plus d'actions"
                      >
                        <MoreHorizontal size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-3 text-[40px]">📋</div>
            <div className="mb-1 text-[15px] font-semibold text-[#0F1E35]">Aucune mission trouvée</div>
            <div className="text-[13px] text-[#6B7280]">Essayez d&apos;autres filtres</div>
          </div>
        )}
      </div>

      {totalCount > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[12px] text-[#6B7280]">
            Affichage {start}–{end} sur {totalCount} missions
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D8] bg-white text-[#6B7280] transition-colors hover:bg-[#FAF7F2] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`h-8 w-8 rounded-lg text-[13px] font-medium transition-colors ${
                    p === page
                      ? "bg-[#0F1E35] text-white"
                      : "border border-[#E5E0D8] bg-white text-[#6B7280] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {p}
                </button>
              ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D8] bg-white text-[#6B7280] transition-colors hover:bg-[#FAF7F2] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
