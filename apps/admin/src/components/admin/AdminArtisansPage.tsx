"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { ArtisanDetailPanel } from "@/components/admin/artisans/ArtisanDetailPanel";
import { ArtisansDataTable } from "@/components/admin/artisans/ArtisansDataTable";
import { ArtisansFiltersBar } from "@/components/admin/artisans/ArtisansFiltersBar";
import {
  filterArtisans,
  type AdminArtisan,
  type ArtisanStatusFilter,
} from "@/components/admin/artisans/adminArtisansMock";
import { mapApiArtisanToUi } from "@/lib/adminUiMappers";
import {
  approveKyc,
  fetchArtisans,
  fetchOverview,
  reactivateArtisan,
  rejectKyc,
  suspendArtisan,
  upgradeArtisanSubscription,
} from "@/services/adminApi";

function updateArtisan(
  artisans: AdminArtisan[],
  id: string,
  patch: Partial<AdminArtisan>,
): AdminArtisan[] {
  return artisans.map((a) => (a.id === id ? { ...a, ...patch } : a));
}

export function AdminArtisansPage() {
  const [artisans, setArtisans] = useState<AdminArtisan[]>([]);
  const [kpis, setKpis] = useState({ total: 0, active: 0, kyc: 0, rating: 0 });
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AdminArtisan | null>(null);
  const [statusFilter, setStatusFilter] = useState<ArtisanStatusFilter>("all");
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [newCommission, setNewCommission] = useState("");

  const load = useCallback(async () => {
    try {
      const [list, overview] = await Promise.all([
        fetchArtisans({ limit: 100 }),
        fetchOverview().catch(() => null),
      ]);
      const mapped = list.items.map(mapApiArtisanToUi);
      setArtisans(mapped);
      setKpis({
        total: list.total ?? mapped.length,
        active: overview?.kpis.activeArtisans ?? mapped.filter((a) => a.status === "active").length,
        kyc: overview?.kpis.kycPending ?? mapped.filter((a) => a.status === "pending").length,
        rating: overview?.kpis.satisfaction ?? 0,
      });
      setError("");
    } catch {
      setError("Impossible de charger les artisans.");
      setArtisans([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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

  const handleApprove = async (id: string) => {
    try {
      await approveKyc(id);
      syncSelected(id, { status: "active", verified: true, commission: "15%", plan: "Standard" });
      toast.success("KYC validé — artisan activé");
    } catch {
      toast.error("Échec de l'approbation KYC");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectKyc(id, { reason: "Dossier incomplet", sendEmail: true });
      setArtisans((prev) => prev.filter((a) => a.id !== id));
      setSelected(null);
      toast.success("KYC refusé");
    } catch {
      toast.error("Échec du refus");
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendArtisan(id);
      syncSelected(id, { status: "suspended" });
      setSelected(null);
      toast.success("Compte suspendu");
    } catch {
      toast.error("Échec de la suspension");
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await reactivateArtisan(id);
      syncSelected(id, { status: "active" });
      toast.success("Compte réactivé");
    } catch {
      toast.error("Échec de la réactivation");
    }
  };

  const handleCommissionChange = async (id: string, commission: string) => {
    const tier = commission === "7%" ? "PRO" : commission === "10%" ? "PREMIUM" : "STANDARD";
    const plan = commission === "7%" ? "Pro" : commission === "10%" ? "Premium" : "Standard";
    try {
      await upgradeArtisanSubscription(id, tier);
      syncSelected(id, { commission, plan });
      setNewCommission("");
      toast.success(`Commission mise à jour : ${commission}`);
    } catch {
      toast.error("Échec de la mise à jour");
    }
  };

  const artisanKpis = [
    {
      label: "Total inscrits",
      value: kpis.total,
      suffix: "",
      change: "Base artisans",
      trend: "up" as const,
      icon: "HardHat",
      iconBg: "navy" as const,
    },
    {
      label: "Actifs aujourd'hui",
      value: kpis.active,
      suffix: "",
      change: "En ligne maintenant",
      trend: "up" as const,
      icon: "Zap",
      iconBg: "green" as const,
    },
    {
      label: "En attente KYC",
      value: kpis.kyc,
      suffix: "",
      change: "À valider",
      trend: "up" as const,
      icon: "ClipboardList",
      iconBg: "orange" as const,
    },
    {
      label: "Note moyenne",
      value: kpis.rating,
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
        {artisanKpis.map((kpi) => (
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
