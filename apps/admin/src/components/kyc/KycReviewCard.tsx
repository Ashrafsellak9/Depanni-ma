"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { approveKyc } from "@/services/adminApi";
import type { KycPendingItem } from "@/types/moderation";
import { RejectKycModal } from "./RejectKycModal";

const DOC_LABELS: Record<string, string> = {
  cin: "CIN",
  diploma: "Diplôme / Certification",
};

export function KycReviewCard({
  artisan,
  onUpdated,
  onReject,
}: {
  artisan: KycPendingItem;
  onUpdated: () => void;
  onReject: (id: string, data: { reason: string; predefinedReason?: string; sendEmail?: boolean }) => Promise<void>;
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onApprove = async () => {
    setLoading(true);
    try {
      await approveKyc(artisan.id);
      toast.success("KYC approuvé — email envoyé");
      onUpdated();
    } catch {
      toast.error("Échec");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (data: { reason: string; predefinedReason: string; sendEmail: boolean }) => {
    setLoading(true);
    try {
      await onReject(artisan.id, data);
      toast.success("KYC refusé");
      setRejectOpen(false);
      onUpdated();
    } catch {
      toast.error("Échec");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {artisan.firstName} {artisan.lastName}
          </h3>
          <p className="text-sm text-slate-500">{artisan.user.email} · {artisan.user.phone}</p>
          <p className="mt-1 text-xs text-slate-400">
            Inscrit le {format(new Date(artisan.createdAt), "PPP", { locale: fr })}
          </p>
          {artisan.specialties?.length > 0 && (
            <p className="mt-2 text-sm">Spécialités : {artisan.specialties.join(", ")}</p>
          )}
          <Link href={`/artisans/${artisan.id}`} className="mt-2 inline-block text-xs text-indigo-600 hover:underline">
            Voir le profil complet →
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={onApprove}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Approuver
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setRejectOpen(true)}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            Refuser
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {Object.entries(artisan.kycDocuments ?? {}).map(([key, url]) => (
          <div key={key} className="rounded-lg border p-3">
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
              {DOC_LABELS[key] ?? key}
            </p>
            {url.match(/\.(pdf)$/i) ? (
              <a href={url} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 underline">
                Ouvrir le PDF
              </a>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt={key} className="max-h-48 w-full rounded object-contain" />
            )}
          </div>
        ))}
        {Object.keys(artisan.kycDocuments ?? {}).length === 0 && (
          <p className="text-sm text-slate-400">Aucun document uploadé</p>
        )}
      </div>

      <RejectKycModal
        open={rejectOpen}
        artisanName={`${artisan.firstName} ${artisan.lastName}`}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={loading}
      />
    </article>
  );
}
