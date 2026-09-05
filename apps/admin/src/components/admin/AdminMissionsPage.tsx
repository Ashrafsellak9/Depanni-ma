"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { MissionDetailPanel } from "@/components/admin/missions/MissionDetailPanel";
import { MissionsDataTable } from "@/components/admin/missions/MissionsDataTable";
import { MissionsFiltersBar } from "@/components/admin/missions/MissionsFiltersBar";
import {
  filterAndSortMissions,
  type AdminMissionRow,
  type MissionSortKey,
} from "@/components/admin/missions/adminMissionsMock";
import { mapApiMissionToUi } from "@/lib/adminUiMappers";
import { fetchMissions, fetchOverview } from "@/services/adminApi";

const PAGE_SIZE = 10;

export function AdminMissionsPage() {
  const [missions, setMissions] = useState<AdminMissionRow[]>([]);
  const [kpis, setKpis] = useState({ today: 0, active: 0, pending: 0, gmv: 0 });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [period, setPeriod] = useState("all");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [sortKey, setSortKey] = useState<MissionSortKey>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedMission, setSelectedMission] = useState<AdminMissionRow | null>(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      const [list, overview] = await Promise.all([
        fetchMissions({ limit: 100 }),
        fetchOverview().catch(() => null),
      ]);
      setMissions(list.items.map(mapApiMissionToUi));
      if (overview) {
        setKpis({
          today: overview.kpis.missionsToday,
          active: overview.kpis.missionsInProgress,
          pending: overview.inProgressMissions.filter((m) =>
            ["PENDING", "OFFERED", "WAITING"].includes(m.status),
          ).length,
          gmv: overview.kpis.gmvToday,
        });
      }
      setError("");
    } catch {
      setError("Impossible de charger les missions.");
      setMissions([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () =>
      filterAndSortMissions(missions, {
        search,
        statusFilter,
        serviceFilter,
        period,
        urgentOnly,
        sortKey,
        sortDir,
      }),
    [missions, search, statusFilter, serviceFilter, period, urgentOnly, sortKey, sortDir],
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

  const missionKpis = [
    {
      label: "Total aujourd'hui",
      value: kpis.today,
      suffix: "",
      change: "Temps réel",
      trend: "up" as const,
      icon: "ClipboardList",
      iconBg: "orange" as const,
    },
    {
      label: "En cours",
      value: kpis.active,
      suffix: "",
      change: "Temps réel",
      trend: "up" as const,
      icon: "Zap",
      iconBg: "green" as const,
    },
    {
      label: "En attente",
      value: kpis.pending,
      suffix: "",
      change: "Sans artisan",
      trend: "up" as const,
      icon: "Clock",
      iconBg: "orange" as const,
    },
    {
      label: "GMV du jour",
      value: kpis.gmv,
      suffix: " MAD",
      change: "Aujourd'hui",
      trend: "up" as const,
      icon: "Banknote",
      iconBg: "navy" as const,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {error && (
        <p className="rounded-xl border border-dep-red/20 bg-dep-red/[0.06] px-4 py-2 text-sm text-dep-red">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {missionKpis.map((kpi) => (
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
