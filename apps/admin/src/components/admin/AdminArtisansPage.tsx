"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { ArtisanDetailPanel } from "@/components/admin/artisans/ArtisanDetailPanel";
import { ArtisansDataTable } from "@/components/admin/artisans/ArtisansDataTable";
import { ArtisansFiltersBar } from "@/components/admin/artisans/ArtisansFiltersBar";
import {
  ARTISAN_KPIS,
  MOCK_ARTISANS,
  filterArtisans,
  type AdminArtisan,
  type ArtisanStatusFilter,
} from "@/components/admin/artisans/adminArtisansMock";

function updateArtisan(
  artisans: AdminArtisan[],
  id: string,
  patch: Partial<AdminArtisan>,
): AdminArtisan[] {
  return artisans.map((a) => (a.id === id ? { ...a, ...patch } : a));
}

export function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<AdminArtisan[]>(MOCK_ARTISANS);
  const [selected, setSelected] = useState<AdminArtisan | null>(null);
  const [statusFilter, setStatusFilter] = useState<ArtisanStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [newCommission, setNewCommission] = useState("");

  const filtered = useMemo(
    () => filterArtisans(artisans, { statusFilter, search, specialty }),
    [artisans, statusFilter, search, specialty],
  );

  const syncSelected = (id: string, patch: Partial<AdminArtisan>) => {
    setArtisans((prev) => updateArtisan(prev, id, patch));
    setSelected((prev) => (prev?.id === id ? { ...prev, ...patch } : prev));
  };

  const handleSelect = (artisan: AdminArtisan) => {
    setSelected(artisan);
    setNewCommission("");
  };

  const handleApprove = (id: string) => {
    syncSelected(id, {
      status: "active",
      verified: true,
      commission: "15%",
      plan: "Standard",
    });
    toast.success("KYC validé — artisan activé");
  };

  const handleReject = (id: string) => {
    setArtisans((prev) => prev.filter((a) => a.id !== id));
    setSelected(null);
    toast.success("KYC refusé");
  };

  const handleSuspend = (id: string) => {
    syncSelected(id, { status: "suspended" });
    setSelected(null);
    toast.success("Compte suspendu");
  };

  const handleReactivate = (id: string) => {
    syncSelected(id, { status: "active" });
    toast.success("Compte réactivé");
  };

  const handleCommissionChange = (id: string, commission: string) => {
    const plan =
      commission === "7%" ? "Pro" : commission === "10%" ? "Premium" : "Standard";
    syncSelected(id, { commission, plan });
    setNewCommission("");
    toast.success(`Commission mise à jour : ${commission}`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ARTISAN_KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <ArtisansFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        search={search}
        onSearchChange={setSearch}
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        resultCount={filtered.length}
      />

      <ArtisansDataTable
        rows={filtered}
        onSelect={handleSelect}
        onApprove={handleApprove}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
      />

      <ArtisanDetailPanel
        artisan={selected}
        newCommission={newCommission}
        onNewCommissionChange={setNewCommission}
        onClose={() => setSelected(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        onCommissionChange={handleCommissionChange}
      />
    </motion.div>
  );
}
