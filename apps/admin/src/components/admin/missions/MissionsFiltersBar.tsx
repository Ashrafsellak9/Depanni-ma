"use client";

import { Download, Search } from "lucide-react";

type MissionsFiltersBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  serviceFilter: string;
  onServiceFilterChange: (v: string) => void;
  period: string;
  onPeriodChange: (v: string) => void;
  urgentOnly: boolean;
  onUrgentOnlyChange: (v: boolean) => void;
  resultCount: number;
  onExport: () => void;
};

export function MissionsFiltersBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  serviceFilter,
  onServiceFilterChange,
  period,
  onPeriodChange,
  urgentOnly,
  onUrgentOnlyChange,
  resultCount,
  onExport,
}: MissionsFiltersBarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[240px] flex-1">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher mission, client, artisan..."
          className="w-full rounded-xl border border-[#E5E0D8] bg-white py-2.5 pl-10 pr-4 text-[13px] text-[#0F1E35] outline-none focus:border-[#0F1E35] focus:ring-2 focus:ring-[rgba(15,30,53,0.05)]"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="min-w-[140px] cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 text-[13px] text-[#0F1E35] outline-none"
      >
        <option value="all">Statut — Tous</option>
        <option value="active">En cours</option>
        <option value="pending">En attente</option>
        <option value="done">Terminées</option>
        <option value="cancelled">Annulées</option>
      </select>

      <select
        value={serviceFilter}
        onChange={(e) => onServiceFilterChange(e.target.value)}
        className="min-w-[150px] cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 text-[13px] text-[#0F1E35] outline-none"
      >
        <option value="all">Service — Tous</option>
        <option value="plomberie">🔧 Plomberie</option>
        <option value="electricite">⚡ Électricité</option>
        <option value="serrurerie">🔑 Serrurerie</option>
        <option value="mecanique">🚗 Mécanique</option>
        <option value="peinture">🎨 Peinture</option>
        <option value="menage">🧹 Ménage</option>
        <option value="electromenager">🛠️ Électroménager</option>
      </select>

      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="min-w-[150px] cursor-pointer rounded-xl border border-[#E5E0D8] bg-white px-3 py-2.5 text-[13px] text-[#0F1E35] outline-none"
      >
        <option value="all">Période — Toutes</option>
        <option value="today">Aujourd&apos;hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
      </select>

      <button
        type="button"
        onClick={() => onUrgentOnlyChange(!urgentOnly)}
        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] font-medium transition-all ${
          urgentOnly
            ? "border-[rgba(240,90,26,0.3)] bg-[rgba(240,90,26,0.1)] text-[#F05A1A]"
            : "border-[#E5E0D8] bg-white text-[#6B7280]"
        }`}
      >
        🚨 Urgents seulement
      </button>

      <span className="ml-auto text-[12px] text-[#6B7280]">{resultCount} missions</span>

      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-2 rounded-xl bg-[#0F1E35] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1A2E4A]"
      >
        <Download size={14} />
        Exporter CSV
      </button>
    </div>
  );
}
