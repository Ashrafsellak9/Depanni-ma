"use client";

import { motion } from "framer-motion";
import { CheckCircle, Download } from "lucide-react";
import toast from "react-hot-toast";

import {
  BANK_OPTIONS,
  STATUS_TABS,
  countByStatus,
  type Virement,
  type VirementFilterId,
} from "@/components/admin/virements/adminVirementsMock";

type VirementsFiltersBarProps = {
  virements: Virement[];
  filtered: Virement[];
  filter: VirementFilterId;
  overdueOnly: boolean;
  bank: string;
  selectedIds: string[];
  onFilterChange: (id: VirementFilterId) => void;
  onOverdueToggle: () => void;
  onBankChange: (bank: string) => void;
  onToggleSelectAll: () => void;
  onBulkProcess: () => void;
};

export function VirementsFiltersBar({
  virements,
  filtered,
  filter,
  overdueOnly,
  bank,
  selectedIds,
  onFilterChange,
  onOverdueToggle,
  onBankChange,
  onToggleSelectAll,
  onBulkProcess,
}: VirementsFiltersBarProps) {
  const pendingInFiltered = filtered.filter((v) => v.status === "pending");
  const allPendingSelected =
    pendingInFiltered.length > 0 && selectedIds.length === pendingInFiltered.length;

  const tabCounts: Record<VirementFilterId, number> = {
    all: virements.length,
    pending: countByStatus(virements, "pending"),
    processing: countByStatus(virements, "processing"),
    failed: countByStatus(virements, "failed"),
    done: countByStatus(virements, "done"),
  };

  const bulkTotal = selectedIds.reduce(
    (s, id) => s + (virements.find((v) => v.id === id)?.amount ?? 0),
    0,
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-xl border border-[#E5E0D8] bg-white p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all ${
              filter === tab.id
                ? "bg-[#0F1E35] text-white"
                : "text-[#6B7280] hover:text-[#0F1E35]"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === tab.id
                  ? "bg-[rgba(255,255,255,0.2)]"
                  : tab.id === "failed"
                    ? "bg-[rgba(220,38,38,0.1)] text-[#DC2626]"
                    : "bg-[#F4F0E8]"
              }`}
            >
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOverdueToggle}
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition-all ${
          overdueOnly
            ? "border-[rgba(220,38,38,0.25)] bg-[rgba(220,38,38,0.08)] text-[#DC2626]"
            : "border-[#E5E0D8] bg-white text-[#6B7280]"
        }`}
      >
        🔴 En retard (+24h) {overdueOnly ? "✓" : ""}
      </button>

      <select
        value={bank}
        onChange={(e) => onBankChange(e.target.value)}
        className="cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-[12px] text-[#0F1E35] outline-none"
      >
        {BANK_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <label className="ml-auto flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={allPendingSelected}
          onChange={onToggleSelectAll}
          className="h-4 w-4 accent-[#F05A1A]"
        />
        <span className="text-[12px] text-[#6B7280]">
          Tout sélectionner ({pendingInFiltered.length})
        </span>
      </label>

      {selectedIds.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onBulkProcess}
          className="flex items-center gap-2 rounded-xl bg-[#1B8A4E] px-4 py-2 text-[12px] font-bold text-white"
        >
          <CheckCircle size={13} />
          Traiter {selectedIds.length} virement{selectedIds.length > 1 ? "s" : ""} ·{" "}
          {bulkTotal.toLocaleString("fr-FR")} MAD
        </motion.button>
      )}

      <button
        type="button"
        onClick={() => toast.success("Export CSV en cours de préparation…")}
        className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-[12px] text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
      >
        <Download size={13} />
        Export CSV
      </button>
    </div>
  );
}
