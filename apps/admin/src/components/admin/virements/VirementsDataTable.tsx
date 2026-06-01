"use client";

import { Check, CheckCircle } from "lucide-react";

import { VirementStatusPill } from "@/components/admin/virements/VirementStatusPill";
import type { Virement } from "@/components/admin/virements/adminVirementsMock";

type VirementsDataTableProps = {
  filtered: Virement[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onProcess: (id: string) => void;
  onEditIban: (id: string) => void;
};

const COL_HEADER =
  "py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]";

export function VirementsDataTable({
  filtered,
  selectedIds,
  onToggleSelect,
  onProcess,
  onEditIban,
}: VirementsDataTableProps) {
  const pendingTotal = filtered
    .filter((v) => v.status === "pending")
    .reduce((s, v) => s + v.amount, 0);
  const pendingCount = filtered.filter((v) => v.status === "pending").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-[#E5E0D8]">
              <th className="w-10 py-3 px-4" />
              <th className={COL_HEADER}>Artisan</th>
              <th className={`${COL_HEADER} w-[110px]`}>Montant</th>
              <th className={COL_HEADER}>IBAN / Banque</th>
              <th className={`${COL_HEADER} w-[90px]`}>Missions</th>
              <th className={`${COL_HEADER} w-[80px]`}>Attente</th>
              <th className={`${COL_HEADER} w-[120px]`}>Statut</th>
              <th className={`${COL_HEADER} w-[130px]`}>Date</th>
              <th className={`${COL_HEADER} w-[120px]`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <tr
                key={v.id}
                className={`border-b border-[rgba(229,224,216,0.5)] transition-colors last:border-0 hover:bg-[#FAF7F2] ${
                  v.status === "failed"
                    ? "bg-[rgba(220,38,38,0.02)]"
                    : v.waitingHours >= 24 && v.status === "pending"
                      ? "bg-[rgba(240,90,26,0.01)]"
                      : ""
                }`}
              >
                <td className="px-4 py-3">
                  {v.status === "pending" && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(v.id)}
                      onChange={() => onToggleSelect(v.id)}
                      className="h-4 w-4 cursor-pointer accent-[#F05A1A]"
                    />
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      style={{ background: v.artisan.color }}
                    >
                      {v.artisan.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-medium text-[#0F1E35]">
                          {v.artisan.name}
                        </span>
                        {v.plan === "Premium" && (
                          <span className="rounded-full bg-[rgba(240,90,26,0.1)] px-1.5 py-0.5 text-[9px] font-bold text-[#F05A1A]">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        {v.artisan.spec} · {v.id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="font-['Syne'] text-[14px] font-bold text-[#0F1E35]">
                    {v.amount.toLocaleString("fr-FR")}
                  </span>
                  <span className="ml-1 text-[11px] text-[#6B7280]">MAD</span>
                </td>

                <td className="px-4 py-3">
                  <div
                    className={`font-mono text-[12px] ${
                      v.status === "failed" ? "text-[#DC2626]" : "text-[#0F1E35]"
                    }`}
                  >
                    {v.iban}
                  </div>
                  <div className="text-[10px] text-[#6B7280]">{v.bank}</div>
                  {v.status === "failed" && v.failReason && (
                    <div className="mt-0.5 text-[10px] font-semibold text-[#DC2626]">
                      ⚠ {v.failReason}
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 text-[#6B7280]">{v.missions}</td>

                <td className="px-4 py-3">
                  {v.status !== "done" ? (
                    <span
                      className={`text-[11px] font-semibold ${
                        v.waitingHours >= 24
                          ? "text-[#DC2626]"
                          : v.waitingHours >= 12
                            ? "text-[#F05A1A]"
                            : "text-[#6B7280]"
                      }`}
                    >
                      {v.waitingHours}h
                      {v.waitingHours >= 24 && " ⚠"}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#9CA3AF]">—</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <VirementStatusPill status={v.status} />
                </td>

                <td className="px-4 py-3">
                  <div className="text-[11px] text-[#6B7280]">{v.submittedAt}</div>
                  {v.status === "done" && v.processedAt && (
                    <div className="mt-0.5 text-[10px] text-[#1B8A4E]">✓ {v.processedAt}</div>
                  )}
                </td>

                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {v.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => onProcess(v.id)}
                        className="flex items-center gap-1 rounded-lg border border-[rgba(27,138,78,0.15)] bg-[rgba(27,138,78,0.1)] px-2.5 py-1.5 text-[10px] font-bold text-[#1B8A4E] transition-colors hover:bg-[rgba(27,138,78,0.15)]"
                      >
                        <Check size={10} />
                        Virer
                      </button>
                    )}
                    {v.status === "failed" && (
                      <button
                        type="button"
                        onClick={() => onEditIban(v.id)}
                        className="rounded-lg border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.08)] px-2.5 py-1.5 text-[10px] font-bold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.12)]"
                      >
                        Corriger IBAN
                      </button>
                    )}
                    {v.status === "processing" && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#F05A1A]">
                        <div className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-[#F05A1A] border-t-transparent" />
                        Traitement...
                      </span>
                    )}
                    {v.status === "done" && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1B8A4E]">
                        <CheckCircle size={11} />
                        Traité
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5E0D8] bg-[#FAF7F2] px-5 py-3">
        <span className="text-[12px] text-[#6B7280]">
          {pendingCount} virement(s) en attente
        </span>
        <span className="font-['Syne'] text-[14px] font-bold text-[#0F1E35]">
          Total à virer :{" "}
          <span className="text-[#F05A1A]">{pendingTotal.toLocaleString("fr-FR")} MAD</span>
        </span>
      </div>
    </div>
  );
}
