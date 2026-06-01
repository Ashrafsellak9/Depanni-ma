"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { KycDossierList } from "@/components/admin/kyc/KycDossierList";
import { KycRecentlyProcessed } from "@/components/admin/kyc/KycRecentlyProcessed";
import { KycReviewPanel } from "@/components/admin/kyc/KycReviewPanel";
import {
  KYC_KPIS,
  MOCK_KYC_DOSSIERS,
  filterKycDossiers,
  type KycDossier,
  type KycFilterId,
} from "@/components/admin/kyc/adminKycMock";

export function AdminKycPage() {
  const [dossiers, setDossiers] = useState<KycDossier[]>(MOCK_KYC_DOSSIERS);
  const [selected, setSelected] = useState<KycDossier | null>(null);
  const [filter, setFilter] = useState<KycFilterId>("all");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => filterKycDossiers(dossiers, filter), [dossiers, filter]);

  const handleSelect = (d: KycDossier) => {
    setSelected(d);
    setShowRejectReason(false);
    setRejectReason("");
  };

  const handleApprove = (id: string) => {
    setDossiers((prev) => prev.filter((d) => d.id !== id));
    if (selected?.id === id) setSelected(null);
    setShowRejectReason(false);
    setRejectReason("");
    toast.success("KYC approuvé — artisan activé");
  };

  const handleRejectStart = (d: KycDossier) => {
    setSelected(d);
    setShowRejectReason(true);
    setRejectReason("");
  };

  const handleRejectConfirm = (id: string) => {
    setDossiers((prev) => prev.filter((d) => d.id !== id));
    setSelected(null);
    setShowRejectReason(false);
    setRejectReason("");
    toast.success(`Dossier refusé — ${rejectReason}`);
  };

  const handleRequestInfo = (id: string) => {
    const d = dossiers.find((x) => x.id === id) ?? selected;
    toast.success(`SMS envoyé à ${d?.name ?? "l'artisan"} — documents manquants demandés`);
  };

  const selectedNotes = selected ? (notes[selected.id] ?? selected.notes) : "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KYC_KPIS.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div
        className={`grid gap-5 transition-all ${
          selected ? "grid-cols-1 lg:grid-cols-[400px_1fr]" : "grid-cols-1"
        }`}
      >
        <KycDossierList
          dossiers={filtered}
          selectedId={selected?.id ?? null}
          filter={filter}
          onFilterChange={setFilter}
          onSelect={handleSelect}
          onApprove={handleApprove}
          onRejectStart={handleRejectStart}
        />

        {selected && (
          <KycReviewPanel
            dossier={selected}
            notes={selectedNotes}
            onNotesChange={(v) =>
              setNotes((prev) => ({ ...prev, [selected.id]: v }))
            }
            showRejectReason={showRejectReason}
            rejectReason={rejectReason}
            onRejectReasonChange={setRejectReason}
            onClose={() => {
              setSelected(null);
              setShowRejectReason(false);
              setRejectReason("");
            }}
            onApprove={handleApprove}
            onRejectStart={() => setShowRejectReason(true)}
            onRejectCancel={() => {
              setShowRejectReason(false);
              setRejectReason("");
            }}
            onRejectConfirm={handleRejectConfirm}
            onRequestInfo={handleRequestInfo}
          />
        )}
      </div>

      <KycRecentlyProcessed />
    </motion.div>
  );
}
