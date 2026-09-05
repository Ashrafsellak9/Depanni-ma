"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { DisputeResolutionPanel } from "@/components/admin/litiges/DisputeResolutionPanel";
import { LitigesAlertBanner } from "@/components/admin/litiges/LitigesAlertBanner";
import { LitigesDataTable } from "@/components/admin/litiges/LitigesDataTable";
import { LitigesFiltersBar } from "@/components/admin/litiges/LitigesFiltersBar";
import {
  filterLitiges,
  getHighAmountCount,
  getUrgentOverdueCount,
  type AdminLitige,
  type LitigeStatusFilter,
} from "@/components/admin/litiges/adminLitigesMock";
import { mapApiDisputeToUi } from "@/lib/adminUiMappers";
import { fetchDisputes, resolveDispute, sendArtisanMessage } from "@/services/adminApi";

export function AdminLitigesPage() {
  const [litiges, setLitiges] = useState<AdminLitige[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<LitigeStatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [selected, setSelected] = useState<AdminLitige | null>(null);
  const [note, setNote] = useState("");
  const [refundPct, setRefundPct] = useState(100);

  const load = useCallback(async () => {
    try {
      const rows = await fetchDisputes();
      setLitiges(rows.map(mapApiDisputeToUi));
      setError("");
    } catch {
      setError("Impossible de charger les litiges.");
      setLitiges([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterLitiges(litiges, { statusFilter: filter, priorityFilter, reasonFilter }),
    [litiges, filter, priorityFilter, reasonFilter],
  );

  const overdueCount = useMemo(() => getUrgentOverdueCount(litiges), [litiges]);
  const highAmountCount = useMemo(() => getHighAmountCount(litiges), [litiges]);
  const openCount = litiges.filter((l) => l.status !== "resolved").length;
  const mediationCount = litiges.filter((l) => l.status === "mediation").length;
  const resolvedCount = litiges.filter((l) => l.status === "resolved").length;
  const contested = litiges
    .filter((l) => l.status !== "resolved")
    .reduce((s, l) => s + l.amount, 0);

  const handleSelect = (litige: AdminLitige) => {
    setSelected(litige);
    setRefundPct(100);
    setNote("");
  };

  const handleRefund = async (id: string) => {
    const litige = litiges.find((l) => l.id === id);
    if (!litige) return;
    const amount = Math.round((litige.amount * refundPct) / 100);
    try {
      await resolveDispute(id, {
        resolution: refundPct >= 100 ? "REFUND_CLIENT" : "SPLIT",
        clientAmount: amount,
        artisanAmount: litige.amount - amount,
        note: note || `Remboursement ${refundPct}%`,
      });
      toast.success(`Remboursement de ${amount} MAD confirmé`);
      await load();
    } catch {
      toast.error("Échec de la résolution");
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      await resolveDispute(id, {
        resolution: "RELEASE_ARTISAN",
        note: note || "Clos sans remboursement",
      });
      toast.success("Litige clos sans remboursement");
      await load();
    } catch {
      toast.error("Échec de la clôture");
    }
  };

  const handleSuspend = async (name: string) => {
    const artisanId = selected?.artisan.name;
    if (selected) {
      try {
        await sendArtisanMessage(
          selected.artisan.name,
          `Avertissement suite au litige ${selected.id}`,
        );
      } catch {
        /* message optionnel */
      }
    }
    toast.success(`Artisan ${name} averti`);
    void artisanId;
  };

  const handlePriorityClick = () => {
    setFilter("open");
    setPriorityFilter("urgent");
    const urgent = litiges.find((l) => l.priority === "urgent" && l.status !== "resolved");
    if (urgent) handleSelect(urgent);
  };

  const litigeKpis = [
    {
      label: "Litiges ouverts",
      value: openCount,
      suffix: "",
      change: "À traiter",
      trend: "up" as const,
      icon: "AlertTriangle",
      iconBg: "red" as const,
    },
    {
      label: "En médiation",
      value: mediationCount,
      suffix: "",
      change: "Sous 72h",
      trend: "up" as const,
      icon: "MessageSquare",
      iconBg: "orange" as const,
    },
    {
      label: "Résolus",
      value: resolvedCount,
      suffix: "",
      change: "Historique chargé",
      trend: "up" as const,
      icon: "CheckCircle",
      iconBg: "green" as const,
    },
    {
      label: "Montant contesté",
      value: contested,
      suffix: " MAD",
      change: "À arbitrer",
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
      <LitigesAlertBanner
        overdueCount={overdueCount}
        highAmountCount={highAmountCount}
        onPriorityClick={handlePriorityClick}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {litigeKpis.map((kpi) => (
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
