"use client";

import { Download, Search } from "lucide-react";

import {
  CITY_OPTIONS,
  STATUS_TABS,
  type ClientStatusFilter,
} from "@/components/admin/clients/adminClientsMock";

type ClientsFiltersBarProps = {
  filter: ClientStatusFilter;
  onFilterChange: (id: ClientStatusFilter) => void;
  search: string;
  onSearchChange: (v: string) => void;
  city: string;
  onCityChange: (v: string) => void;
  resultCount: number;
  onExport: () => void;
};

export function ClientsFiltersBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  city,
  onCityChange,
  resultCount,
  onExport,
}: ClientsFiltersBarProps) {
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

      <div className="relative min-w-[220px] flex-1">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nom, email, téléphone..."
          className="w-full rounded-xl border border-[#E5E0D8] bg-white py-2.5 pl-10 pr-4 text-[13px] outline-none focus:border-[#0F1E35] focus:ring-2 focus:ring-[rgba(15,30,53,0.05)]"
        />
      </div>

      <select
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        className="cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 text-[13px] text-[#0F1E35] outline-none"
      >
        <option value="">Ville — Toutes</option>
        {CITY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <div className="ml-auto text-[12px] text-[#6B7280]">{resultCount} clients</div>

      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-2 rounded-xl bg-[#0F1E35] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1A2E4A]"
      >
        <Download size={14} />
        Exporter
      </button>
    </div>
  );
}
