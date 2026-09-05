"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { KpiCard } from "@/components/admin/KpiCard";
import { KycDossierList } from "@/components/admin/kyc/KycDossierList";
import { KycRecentlyProcessed } from "@/components/admin/kyc/KycRecentlyProcessed";
import { KycReviewPanel } from "@/components/admin/kyc/KycReviewPanel";
import { KYC_KPIS, filterKycDossiers, type KycDossier, type KycFilterId } from "@/components/admin/kyc/adminKycMock";
import { mapApiKycToUi, mapKycStatsToKpis } from "@/lib/adminUiMappers";
import { approveKyc, fetchKycPending, rejectKyc, sendArtisanMessage } from "@/services/adminApi";
import type { KycStats } from "@/types/moderation";

export function AdminKycPage() {
  const [dossiers, setDossiers] = useState<KycDossier[]>([]);
  const [stats, setStats] = useState<KycStats | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<KycDossier | null>(null);
  const [filter, setFilter] = useState<KycFilterId>("all");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fetchKycPending(1);
      setDossiers(data.items.map(mapApiKycToUi));
      setStats(data.stats);
      setError("");
    } catch {
      setError("Impossible de charger la file KYC.");
      setDossiers([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => filterKycDossiers(dossiers, filter), [dossiers, filter]);

  const handleSelect = (d: KycDossier) => {
    setSelected(d);
    setShowRejectReason(false);
    setRejectReason("");
  };

  const handleApprove = async (id: string) => {
    try {
      await approveKyc(id);
      setDossiers((prev) => prev.filter((d) => d.id !== id));
      if (selected?.id === id) setSelected(null);
      setShowRejectReason(false);
      setRejectReason("");
      toast.success("KYC approuvé — artisan activé");
    } catch {
      toast.error("Échec de l'approbation");
    }
  };

  const handleRejectStart = (d: KycDossier) => {
    setSelected(d);
    setShowRejectReason(true);
    setRejectReason("");
  };

  const handleRejectConfirm = async (id: string) => {
    try {
      await rejectKyc(id, {
        reason: rejectReason || "Dossier incomplet",
        sendEmail: true,
      });
      setDossiers((prev) => prev.filter((d) => d.id !== id));
      setSelected(null);
      setShowRejectReason(false);
      setRejectReason("");
      toast.success(`Dossier refusé — ${rejectReason || "motif enregistré"}`);
    } catch {
      toast.error("Échec du refus");
    }
  };

  const handleRequestInfo = async (id: string) => {
    const d = dossiers.find((x) => x.id === id) ?? selected;
    try {
      await sendArtisanMessage(id, "Documents manquants — merci de compléter votre dossier KYC.");
      toast.success(`Message envoyé à ${d?.name ?? "l'artisan"}`);
    } catch {
      toast.error("Impossible d'envoyer le message");
    }
  };

  const selectedNotes = selected ? (notes[selected.id] ?? selected.notes) : "";
  const kpis = stats ? mapKycStatsToKpis(stats) : KYC_KPIS;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {error && (
        <p className="rounded-xl border border-dep-red/20 bg-dep-red/[0.06] px-4 py-2 text-sm text-dep-red">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
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

      <KycRecentlyProcessed hidden />
    </motion.div>
  );
}
