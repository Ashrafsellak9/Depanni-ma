"use client";

import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Camera,
  Clock,
  CreditCard,
  Download,
  Eye,
  MapPin,
  MessageSquare,
  Phone,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

import {
  REJECT_REASONS,
  type KycDossier,
} from "@/components/admin/kyc/adminKycMock";

const REVIEW_DOCS = [
  { key: "cin_front" as const, label: "CIN Recto", required: true, icon: CreditCard },
  { key: "cin_back" as const, label: "CIN Verso", required: true, icon: CreditCard },
  { key: "photo" as const, label: "Photo de profil", required: true, icon: Camera },
  { key: "diploma" as const, label: "Attestation / Diplôme", required: false, icon: Award },
];

type KycReviewPanelProps = {
  dossier: KycDossier;
  notes: string;
  onNotesChange: (v: string) => void;
  showRejectReason: boolean;
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
  onClose: () => void;
  onApprove: (id: string) => void;
  onRejectStart: () => void;
  onRejectCancel: () => void;
  onRejectConfirm: (id: string) => void;
  onRequestInfo: (id: string) => void;
};

export function KycReviewPanel({
  dossier,
  notes,
  onNotesChange,
  showRejectReason,
  rejectReason,
  onRejectReasonChange,
  onClose,
  onApprove,
  onRejectStart,
  onRejectCancel,
  onRejectConfirm,
  onRequestInfo,
}: KycReviewPanelProps) {
  const uploadedCount = Object.values(dossier.documents).filter(
    (d) => d.status === "uploaded",
  ).length;

  return (
    <div className="sticky top-[80px] overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white">
      <div className="flex items-start justify-between bg-[#0F1E35] px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-[16px] font-bold text-white"
            style={{ background: dossier.color }}
          >
            {dossier.initials}
          </div>
          <div>
            <div className="mb-0.5 font-['Syne'] text-[17px] font-bold text-white">
              {dossier.name}
            </div>
            <div className="text-[11px] text-[rgba(255,255,255,0.5)]">
              {dossier.specEmoji} {dossier.spec} · {dossier.city}
            </div>
            <div className="mt-0.5 text-[11px] text-[rgba(255,255,255,0.4)]">
              Soumis : {dossier.submittedAt} · {dossier.id}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
              dossier.waitingHours >= 48
                ? "bg-[rgba(220,38,38,0.2)] text-[#FF6B6B]"
                : "bg-[rgba(240,90,26,0.2)] text-[#FF7A3D]"
            }`}
          >
            ⏱ En attente {dossier.waitingHours}h
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.1)] text-white"
            aria-label="Fermer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
        <div className="mb-5 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Informations artisan
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Phone, label: "Téléphone", value: dossier.phone },
              { icon: MapPin, label: "Ville", value: dossier.city },
              {
                icon: Wrench,
                label: "Spécialité",
                value: `${dossier.specEmoji} ${dossier.spec}`,
              },
              { icon: Clock, label: "Soumis", value: dossier.submittedAt },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex items-center gap-2">
                  <Icon size={12} className="flex-shrink-0 text-[#6B7280]" />
                  <div>
                    <div className="text-[9px] text-[#9CA3AF]">{row.label}</div>
                    <div className="text-[11px] font-medium text-[#0F1E35]">{row.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Documents soumis ({uploadedCount}/4)
          </div>
          <div className="space-y-3">
            {REVIEW_DOCS.map((doc) => {
              const d = dossier.documents[doc.key];
              const DocIcon = doc.icon;
              return (
                <div
                  key={doc.key}
                  className={`flex items-center gap-3 rounded-xl border p-4 ${
                    d.status === "uploaded"
                      ? "border-[rgba(27,138,78,0.2)] bg-[rgba(27,138,78,0.03)]"
                      : "border-[rgba(107,114,128,0.2)] bg-[rgba(107,114,128,0.03)]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                      d.status === "uploaded"
                        ? "bg-[rgba(27,138,78,0.1)]"
                        : "bg-[rgba(107,114,128,0.08)]"
                    }`}
                  >
                    <DocIcon
                      size={16}
                      className={d.status === "uploaded" ? "text-[#1B8A4E]" : "text-[#9CA3AF]"}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[#0F1E35]">{doc.label}</span>
                      {doc.required && (
                        <span className="rounded border border-[#E5E0D8] px-1.5 py-0.5 text-[9px] text-[#9CA3AF]">
                          Obligatoire
                        </span>
                      )}
                    </div>
                    {d.status === "uploaded" ? (
                      <div className="mt-0.5 text-[11px] text-[#1B8A4E]">✓ {d.name}</div>
                    ) : (
                      <div className="mt-0.5 text-[11px] italic text-[#9CA3AF]">Non soumis</div>
                    )}
                  </div>
                  {d.status === "uploaded" && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
                      >
                        <Eye size={10} />
                        Voir
                      </button>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-[10px] font-medium text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
                      >
                        <Download size={10} />
                        DL
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            Notes internes
          </div>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Ajouter une note interne sur ce dossier..."
            className="h-20 w-full resize-none rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-3 font-['DM_Sans'] text-[12px] outline-none transition-all focus:border-[#0F1E35] focus:bg-white"
          />
        </div>

        {showRejectReason && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-5 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.04)] p-4"
          >
            <div className="mb-3 text-[11px] font-semibold text-[#DC2626]">
              Motif du refus (sera envoyé à l&apos;artisan par SMS)
            </div>
            <div className="mb-3 space-y-2">
              {REJECT_REASONS.map((reason) => (
                <label key={reason} className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => onRejectReasonChange(e.target.value)}
                    className="accent-[#DC2626]"
                  />
                  <span className="text-[12px] text-[#0F1E35]">{reason}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Précisions supplémentaires (optionnel)..."
              className="h-16 w-full resize-none rounded-xl border border-[rgba(220,38,38,0.2)] bg-white p-3 font-['DM_Sans'] text-[12px] outline-none transition-all focus:border-[#DC2626]"
            />
          </motion.div>
        )}

        <div className="space-y-3 border-t border-[#E5E0D8] pt-5">
          <button
            type="button"
            onClick={() => onApprove(dossier.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B8A4E] py-4 text-[14px] font-bold text-white transition-colors hover:bg-[#166534]"
          >
            <BadgeCheck size={18} />
            Valider le KYC — Activer l&apos;artisan
          </button>

          {!showRejectReason ? (
            <button
              type="button"
              onClick={onRejectStart}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(220,38,38,0.2)] bg-[rgba(220,38,38,0.07)] py-4 text-[14px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
            >
              <XCircle size={18} />
              Refuser le dossier
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onRejectCancel}
                className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-medium text-[#6B7280]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => onRejectConfirm(dossier.id)}
                disabled={!rejectReason}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#DC2626] py-3 text-[13px] font-bold text-white disabled:opacity-40"
              >
                <X size={14} />
                Confirmer refus
              </button>
            </div>
          )}

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
          >
            <Phone size={14} />
            Appeler l&apos;artisan
          </button>

          <button
            type="button"
            onClick={() => onRequestInfo(dossier.id)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
          >
            <MessageSquare size={14} />
            Demander documents manquants
          </button>
        </div>
      </div>
    </div>
  );
}
