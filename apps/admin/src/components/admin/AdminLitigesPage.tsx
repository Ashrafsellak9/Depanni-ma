"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { DisputeResolutionPanel } from "@/components/admin/litiges/DisputeResolutionPanel";
import { LitigesAlertBanner } from "@/components/admin/litiges/LitigesAlertBanner";
import { LitigesDataTable } from "@/components/admin/litiges/LitigesDataTable";
import { LitigesFiltersBar } from "@/components/admin/litiges/LitigesFiltersBar";
import {
  LITIGE_KPIS,
  MOCK_LITIGES,
  filterLitiges,
  getHighAmountCount,
  getUrgentOverdueCount,
  type AdminLitige,
  type LitigeStatusFilter,
} from "@/components/admin/litiges/adminLitigesMock";

function resolveLitige(litiges: AdminLitige[], id: string, description?: string): AdminLitige[] {
  return litiges.map((l) =>
    l.id === id
      ? {
          ...l,
          status: "resolved" as const,
          statusLabel: "Résolu",
          priority: "resolved" as const,
          age: "Résolu",
          ageHours: 0,
          description: description ?? l.description,
        }
      : l,
  );
}

export function AdminLitigesPage() {
  const [litiges, setLitiges] = useState<AdminLitige[]>(MOCK_LITIGES);
  const [filter, setFilter] = useState<LitigeStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selected, setSelected] = useState<AdminLitige | null>(null);
  const [note, setNote] = useState("");
  const [refundPct, setRefundPct] = useState(100);

  const filtered = useMemo(
    () => filterLitiges(litiges, { statusFilter: filter, priorityFilter, reasonFilter }),
    [litiges, filter, priorityFilter, reasonFilter],
  );

  const overdueCount = useMemo(() => getUrgentOverdueCount(litiges), [litiges]);
  const highAmountCount = useMemo(() => getHighAmountCount(litiges), [litiges]);

  const handleSelect = (litige: AdminLitige) => {
    setSelected(litige);
    setRefundPct(100);
    setNote("");
  };

  const handleRefund = (id: string) => {
    const litige = litiges.find((l) => l.id === id);
    if (!litige) return;
    const amount = Math.round((litige.amount * refundPct) / 100);
    const updated = resolveLitige(
      litiges,
      id,
      `Résolu : remboursement de ${amount} MAD (${refundPct}%) accordé au client.`,
    );
    setLitiges(updated);
    setSelected(updated.find((l) => l.id === id) ?? null);
    toast.success(`Remboursement de ${amount} MAD confirmé`);
  };

  const handleDismiss = (id: string) => {
    const updated = resolveLitige(
      litiges,
      id,
      "Résolu : litige clos sans remboursement après analyse.",
    );
    setLitiges(updated);
    setSelected(updated.find((l) => l.id === id) ?? null);
    toast.success("Litige clos sans remboursement");
  };

  const handleSuspend = (name: string) => {
    toast.success(`Artisan ${name} averti — suspension enregistrée`);
  };

  const handlePriorityClick = () => {
    setFilter("open");
    setPriorityFilter("urgent");
    const urgent = litiges.find((l) => l.priority === "urgent" && l.status !== "resolved");
    if (urgent) handleSelect(urgent);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <LitigesAlertBanner
        overdueCount={overdueCount}
        highAmountCount={highAmountCount}
        onPriorityClick={handlePriorityClick}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LITIGE_KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <LitigesFiltersBar
        filter={filter}
        onFilterChange={setFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        reasonFilter={reasonFilter}
        onReasonFilterChange={setReasonFilter}
        resultCount={filtered.length}
      />

      <LitigesDataTable rows={filtered} onSelect={handleSelect} />

      <DisputeResolutionPanel
        litige={selected}
        note={note}
        onNoteChange={setNote}
        refundPct={refundPct}
        onRefundPctChange={setRefundPct}
        onClose={() => setSelected(null)}
        onRefund={handleRefund}
        onDismiss={handleDismiss}
        onSuspend={handleSuspend}
      />
    </motion.div>
  );
}
