"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { ClientDetailPanel } from "@/components/admin/clients/ClientDetailPanel";
import { ClientsDataTable } from "@/components/admin/clients/ClientsDataTable";
import { ClientsFiltersBar } from "@/components/admin/clients/ClientsFiltersBar";
import {
  CLIENT_KPIS,
  MOCK_CLIENTS,
  filterClients,
  type AdminClient,
  type ClientStatusFilter,
} from "@/components/admin/clients/adminClientsMock";

function updateClient(
  clients: AdminClient[],
  id: string,
  patch: Partial<AdminClient>,
): AdminClient[] {
  return clients.map((c) => (c.id === id ? { ...c, ...patch } : c));
}

export function AdminClientsPage() {
  const [clients, setClients] = useState<AdminClient[]>(MOCK_CLIENTS);
  const [selected, setSelected] = useState<AdminClient | null>(null);
  const [filter, setFilter] = useState<ClientStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const filtered = useMemo(
    () => filterClients(clients, { statusFilter: filter, search, city }),
    [clients, filter, search, city],
  );

  const handleBlock = (id: string) => {
    setClients((prev) => updateClient(prev, id, { status: "blocked" }));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: "blocked" } : prev));
    toast.success("Client bloqué");
  };

  const handleUnblock = (id: string) => {
    setClients((prev) => updateClient(prev, id, { status: "active" }));
    setSelected((prev) => (prev?.id === id ? { ...prev, status: "active" } : prev));
    toast.success("Client débloqué");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CLIENT_KPIS.map((kpi) => (
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
