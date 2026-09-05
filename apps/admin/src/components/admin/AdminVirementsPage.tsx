"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { VirementEditIbanModal } from "@/components/admin/virements/VirementEditIbanModal";
import { VirementsAlertBanner } from "@/components/admin/virements/VirementsAlertBanner";
import { VirementsDataTable } from "@/components/admin/virements/VirementsDataTable";
import { VirementsFiltersBar } from "@/components/admin/virements/VirementsFiltersBar";
import {
  failedCount,
  filterVirements,
  overduePendingCount,
  type Virement,
  type VirementFilterId,
} from "@/components/admin/virements/adminVirementsMock";
import { mapApiPayoutToUi } from "@/lib/adminUiMappers";
import { fetchPayouts, processPendingPayoutsBatch } from "@/services/adminApi";
import type { PayoutRow } from "@/types/analytics";

function extractPayouts(raw: unknown): PayoutRow[] {
  if (Array.isArray(raw)) return raw as PayoutRow[];
  if (raw && typeof raw === "object" && "items" in raw) {
    return (raw as { items: PayoutRow[] }).items;
  }
  return [];
}

export function AdminVirementsPage() {
  const [virements, setVirements] = useState<Virement[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<VirementFilterId>("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [bank, setBank] = useState("Banque — Toutes");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editIban, setEditIban] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const raw = await fetchPayouts();
      setVirements(extractPayouts(raw).map(mapApiPayoutToUi));
      setError("");
    } catch {
      setError("Impossible de charger les virements.");
      setVirements([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterVirements(virements, { filter, overdueOnly, bank }),
    [virements, filter, overdueOnly, bank],
  );

  const pending = virements.filter((v) => v.status === "pending");
  const pendingAmount = pending.reduce((s, v) => s + v.amount, 0);
  const done = virements.filter((v) => v.status === "done");
  const doneAmount = done.reduce((s, v) => s + v.amount, 0);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pendingIds = filtered.filter((v) => v.status === "pending").map((v) => v.id);
    setSelectedIds((prev) => (prev.length === pendingIds.length ? [] : pendingIds));
  }, [filtered]);

  const handleProcess = useCallback(async (_id: string) => {
    try {
      const result = await processPendingPayoutsBatch();
      toast.success(`${result.processed} virement(s) traité(s)`);
      await load();
    } catch {
      toast.error("Échec du traitement");
    }
  }, [load]);

  const handleBulkProcess = useCallback(async () => {
    try {
      const result = await processPendingPayoutsBatch();
      setSelectedIds([]);
      toast.success(`${result.processed} virement(s) en cours de traitement`);
      await load();
    } catch {
      toast.error("Échec du traitement groupé");
    }
  }, [load]);

  const handleSaveIban = useCallback((id: string, iban: string, bankName: string) => {
    setVirements((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status: "pending" as const,
              failReason: undefined,
              iban,
              bank: bankName,
              waitingHours: 0,
            }
          : v,
      ),
    );
    setEditIban(null);
    toast.success("IBAN corrigé localement — le prochain lot utilisera les données bancaires à jour");
  }, []);

  const handlePriorityClick = useCallback(() => {
    setOverdueOnly(true);
    setFilter("pending");
  }, []);

  const handleFilterChange = useCallback((id: VirementFilterId) => {
    setFilter(id);
    setSelectedIds([]);
  }, []);

  const handleBankChange = useCallback((value: string) => {
    setBank(value);
    setSelectedIds([]);
  }, []);

  const virementKpis = [
    {
      label: "En attente",
      value: pending.length,
      icon: "Clock",
      iconBg: "orange" as const,
      change: "À traiter aujourd'hui",
      trend: "up" as const,
    },
    {
      label: "Total à virer",
      value: pendingAmount.toLocaleString("fr-FR"),
      suffix: " MAD",
      icon: "Banknote",
      iconBg: "red" as const,
      change: `${pending.length} artisans`,
      trend: "up" as const,
      isString: true,
    },
    {
      label: "Virés",
      value: doneAmount.toLocaleString("fr-FR"),
      suffix: " MAD",
      icon: "CheckCircle",
      iconBg: "green" as const,
      change: `${done.length} virements`,
      trend: "up" as const,
      isString: true,
    },
    {
      label: "Délai moyen",
      value: pending.length
        ? `${Math.round(pending.reduce((s, v) => s + v.waitingHours, 0) / pending.length)}h`
        : "—",
      icon: "Timer",
      iconBg: "navy" as const,
      change: "Objectif < 24h",
      trend: "up" as const,
      isString: true,
    },
  ];

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl border border-dep-red/20 bg-dep-red/[0.06] px-4 py-2 text-sm text-dep-red">
          {error}
        </p>
      )}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {virementKpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <KpiCard {...kpi} />
          </motion.div>
        ))}
      </div>

      <VirementsAlertBanner
        overdueCount={overduePendingCount(virements)}
        failedCount={failedCount(virements)}
        onPriorityClick={handlePriorityClick}
      />

      <VirementsFiltersBar
        virements={virements}
        filtered={filtered}
        filter={filter}
        overdueOnly={overdueOnly}
        bank={bank}
        selectedIds={selectedIds}
        onFilterChange={handleFilterChange}
        onOverdueToggle={() => setOverdueOnly((o) => !o)}
        onBankChange={handleBankChange}
        onToggleSelectAll={toggleSelectAll}
        onBulkProcess={handleBulkProcess}
      />

      <VirementsDataTable
        filtered={filtered}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onProcess={handleProcess}
        onEditIban={setEditIban}
      />

      <VirementEditIbanModal
        virementId={editIban}
        virements={virements}
        onClose={() => setEditIban(null)}
        onSave={handleSaveIban}
      />
    </div>
  );
}
