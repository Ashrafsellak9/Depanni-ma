"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { ClientDetailPanel } from "@/components/admin/clients/ClientDetailPanel";
import { ClientsDataTable } from "@/components/admin/clients/ClientsDataTable";
import { ClientsFiltersBar } from "@/components/admin/clients/ClientsFiltersBar";
import {
  filterClients,
  type AdminClient,
  type ClientStatusFilter,
} from "@/components/admin/clients/adminClientsMock";
import { mapApiCitizenToUi } from "@/lib/adminUiMappers";
import { fetchClients, fetchOverview } from "@/services/adminApi";

function updateClient(
  clients: AdminClient[],
  id: string,
  patch: Partial<AdminClient>,
): AdminClient[] {
  return clients.map((c) => (c.id === id ? { ...c, ...patch } : c));
}

export function AdminClientsPage() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [satisfaction, setSatisfaction] = useState(0);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminClient | null>(null);
  const [filter, setFilter] = useState<ClientStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const load = useCallback(async () => {
    try {
      const [list, overview] = await Promise.all([
        fetchClients(undefined, 100),
        fetchOverview().catch(() => null),
      ]);
      setClients(list.items.map(mapApiCitizenToUi));
      setSatisfaction(overview?.kpis.satisfaction ?? 0);
      setError("");
    } catch {
      setError("Impossible de charger les clients.");
      setClients([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterClients(clients, { statusFilter: filter, search, city }),
    [clients, filter, search, city],
  );

  const newCount = clients.filter((c) => c.status === "new").length;
  const activeCount = clients.filter((c) => c.status === "active").length;

  const handleBlock = (id: string) => {
    setClients((prev) => updateClient(prev, id, { status: "blocked" }));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: "blocked" } : prev));
    toast.success("Client bloqué localement — action API à brancher");
  };

  const handleUnblock = (id: string) => {
    setClients((prev) => updateClient(prev, id, { status: "active" }));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: "active" } : prev));
    toast.success("Client débloqué");
  };

  const clientKpis = [
    {
      label: "Total clients",
      value: clients.length,
      suffix: "",
      change: "Base citoyens",
      trend: "up" as const,
      icon: "Users",
      iconBg: "navy" as const,
    },
    {
      label: "Actifs",
      value: activeCount,
      suffix: "",
      change: "Au moins une demande",
      trend: "up" as const,
      icon: "TrendingUp",
      iconBg: "green" as const,
    },
    {
      label: "Nouveaux",
      value: newCount,
      suffix: "",
      change: "Non vérifiés récents",
      trend: "up" as const,
      icon: "UserPlus",
      iconBg: "orange" as const,
    },
    {
      label: "Satisfaction moy.",
      value: satisfaction,
      suffix: "/5",
      change: "Moyenne plateforme",
      trend: "up" as const,
      icon: "Star",
      iconBg: "purple" as const,
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
        {clientKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <ClientsFiltersBar
        filter={filter}
        onFilterChange={setFilter}
        search={search}
        onSearchChange={setSearch}
        city={city}
        onCityChange={setCity}
        resultCount={filtered.length}
        onExport={() => toast.success("Export CSV en cours de préparation…")}
      />

      <ClientsDataTable rows={filtered} onSelect={setSelected} />

      <ClientDetailPanel
        client={selected}
        onClose={() => setSelected(null)}
        onBlock={handleBlock}
        onUnblock={handleUnblock}
      />
    </motion.div>
  );
}
