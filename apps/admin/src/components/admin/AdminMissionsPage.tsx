"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { MissionDetailPanel } from "@/components/admin/missions/MissionDetailPanel";
import { MissionsDataTable } from "@/components/admin/missions/MissionsDataTable";
import { MissionsFiltersBar } from "@/components/admin/missions/MissionsFiltersBar";
import {
  MISSION_KPIS,
  MOCK_MISSIONS,
  filterAndSortMissions,
  type AdminMissionRow,
  type MissionSortKey,
} from "@/components/admin/missions/adminMissionsMock";

const PAGE_SIZE = 10;

export function AdminMissionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [period, setPeriod] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortKey, setSortKey] = useState<MissionSortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedMission, setSelectedMission] = useState<AdminMissionRow | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      filterAndSortMissions(MOCK_MISSIONS, {
        search,
        statusFilter,
        serviceFilter,
        period,
        urgentOnly,
        sortKey,
        sortDir,
      }),
    [search, statusFilter, serviceFilter, period, urgentOnly, sortKey, sortDir],
  );

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleSort = (key: MissionSortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const resetPage = () => setPage(1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MISSION_KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <MissionsFiltersBar
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          resetPage();
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => {
          setStatusFilter(v);
          resetPage();
        }}
        serviceFilter={serviceFilter}
        onServiceFilterChange={(v) => {
          setServiceFilter(v);
          resetPage();
        }}
        period={period}
        onPeriodChange={(v) => {
          setPeriod(v);
          resetPage();
        }}
        urgentOnly={urgentOnly}
        onUrgentOnlyChange={(v) => {
          setUrgentOnly(v);
          resetPage();
        }}
        resultCount={filtered.length}
        onExport={() => toast.success("Export CSV en cours de préparation…")}
      />

      <MissionsDataTable
        rows={paginated}
        totalCount={filtered.length}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        onSelect={setSelectedMission}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <MissionDetailPanel mission={selectedMission} onClose={() => setSelectedMission(null)} />
    </motion.div>
  );
}
