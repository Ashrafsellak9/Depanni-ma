"use client";

import { Plus, Search } from "lucide-react";

import {
  SPECIALTY_OPTIONS,
  STATUS_TABS,
  type ArtisanStatusFilter,
} from "@/components/admin/artisans/adminArtisansMock";

type ArtisansFiltersBarProps = {
  statusFilter: ArtisanStatusFilter;
  onStatusFilterChange: (id: ArtisanStatusFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
  specialty: string;
  onSpecialtyChange: (v: string) => void;
  resultCount: number;
};

export function ArtisansFiltersBar({
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  specialty,
  onSpecialtyChange,
  resultCount,
}: ArtisansFiltersBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onStatusFilterChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition-all ${
              statusFilter === tab.id
                ? "border-[#0F1E35] bg-[#0F1E35] text-white"
                : "border-[#E5E0D8] bg-white text-[#6B7280] hover:border-[#0F1E35]"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                statusFilter === tab.id ? "bg-[rgba(255,255,255,0.2)]" : "bg-[#F4F0E8]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher artisan..."
            className="w-full rounded-xl border border-[#E5E0D8] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#0F1E35] outline-none focus:border-[#0F1E35] focus:ring-2 focus:ring-[rgba(15,30,53,0.05)]"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 text-[13px] text-[#0F1E35] outline-none"
        >
          <option value="">Spécialité — Toutes</option>
          {SPECIALTY_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[#6B7280]">{resultCount} artisans</span>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#F05A1A] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF7A3D]"
        >
          <Plus size={14} />
          Ajouter artisan
        </button>
      </div>
    </div>
  );
}
