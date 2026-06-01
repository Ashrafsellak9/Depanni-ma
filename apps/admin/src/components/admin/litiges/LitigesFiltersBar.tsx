"use client";

import {
  STATUS_TABS,
  type LitigeStatusFilter,
} from "@/components/admin/litiges/adminLitigesMock";

type LitigesFiltersBarProps = {
  filter: LitigeStatusFilter;
  onFilterChange: (id: LitigeStatusFilter) => void;
  priorityFilter: string;
  onPriorityFilterChange: (v: string) => void;
  reasonFilter: string;
  onReasonFilterChange: (v: string) => void;
  resultCount: number;
};

export function LitigesFiltersBar({
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  reasonFilter,
  onReasonFilterChange,
  resultCount,
}: LitigesFiltersBarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex gap-1 rounded-xl border border-[#E5E0D8] bg-white p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
              filter === tab.id
                ? "bg-[#0F1E35] text-white"
                : "text-[#6B7280] hover:text-[#0F1E35]"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === tab.id ? "bg-[rgba(255,255,255,0.2)]" : "bg-[#F4F0E8]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityFilterChange(e.target.value)}
        className="cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-[12px] text-[#0F1E35] outline-none"
      >
        <option value="all">Priorité — Toutes</option>
        <option value="urgent">Urgent</option>
        <option value="high">Élevée</option>
        <option value="medium">Moyenne</option>
        <option value="low">Faible</option>
      </select>

      <select
        value={reasonFilter}
        onChange={(e) => onReasonFilterChange(e.target.value)}
        className="cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-[12px] text-[#0F1E35] outline-none"
      >
        <option value="all">Motif — Tous</option>
        <option value="client_not_satisfied">Client insatisfait</option>
        <option value="price_dispute">Désaccord prix</option>
        <option value="no_show">Artisan absent</option>
        <option value="damage">Dommages</option>
        <option value="quality">Qualité insuffisante</option>
      </select>

      <div className="ml-auto text-[12px] text-[#6B7280]">{resultCount} litiges</div>
    </div>
  );
}
