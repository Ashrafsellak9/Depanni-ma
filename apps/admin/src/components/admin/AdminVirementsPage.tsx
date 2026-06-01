"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { VirementEditIbanModal } from "@/components/admin/virements/VirementEditIbanModal";
import { VirementsAlertBanner } from "@/components/admin/virements/VirementsAlertBanner";
import { VirementsDataTable } from "@/components/admin/virements/VirementsDataTable";
import { VirementsFiltersBar } from "@/components/admin/virements/VirementsFiltersBar";
import {
  MOCK_VIREMENTS,
  VIREMENT_KPIS,
  failedCount,
  filterVirements,
  overduePendingCount,
  type Virement,
  type VirementFilterId,
} from "@/components/admin/virements/adminVirementsMock";

export function AdminVirementsPage() {
  const [virements, setVirements] = useState<Virement[]>(MOCK_VIREMENTS);
  const [filter, setFilter] = useState<VirementFilterId>("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [bank, setBank] = useState("Banque — Toutes");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editIban, setEditIban] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterVirements(virements, { filter, overdueOnly, bank }),
    [virements, filter, overdueOnly, bank],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pendingIds = filtered.filter((v) => v.status === "pending").map((v) => v.id);
    setSelectedIds((prev) => (prev.length === pendingIds.length ? [] : pendingIds));
  }, [filtered]);

  const handleProcess = useCallback((id: string) => {
    setVirements((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, status: "processing" as const, waitingHours: 0 } : v,
      ),
    );
    setSelectedIds((prev) => prev.filter((i) => i !== id));

    setTimeout(() => {
      setVirements((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, status: "done" as const, processedAt: "À l'instant", waitingHours: 0 }
            : v,
        ),
      );
      toast.success(`Virement ${id} traité avec succès`);
    }, 2000);
  }, []);

  const handleBulkProcess = useCallback(() => {
    selectedIds.forEach((id) => handleProcess(id));
    setSelectedIds([]);
    toast.success(`${selectedIds.length} virement(s) en cours de traitement`);
  }, [selectedIds, handleProcess]);

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
    toast.success("IBAN corrigé — virement remis en attente");
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

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VIREMENT_KPIS.map((kpi, i) => (
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
