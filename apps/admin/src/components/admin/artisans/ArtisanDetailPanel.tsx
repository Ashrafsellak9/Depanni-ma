"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Ban,
  Calendar,
  CheckCircle,
  CreditCard,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  X,
} from "lucide-react";

import type { AdminArtisan } from "@/components/admin/artisans/adminArtisansMock";
import { ArtisanStatusPill } from "@/components/admin/artisans/ArtisanStatusPill";

type ArtisanDetailPanelProps = {
  artisan: AdminArtisan | null;
  newCommission: string;
  onNewCommissionChange: (v: string) => void;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSuspend: (id: string) => void;
  onReactivate: (id: string) => void;
  onCommissionChange: (id: string, commission: string) => void;
};

export function ArtisanDetailPanel({
  artisan,
  newCommission,
  onNewCommissionChange,
  onClose,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
  onCommissionChange,
}: ArtisanDetailPanelProps) {
  return (
    <AnimatePresence>
      {artisan && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.3)]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-[460px] overflow-y-auto bg-white shadow-2xl"
          >
            <div className="bg-[#0F1E35] px-6 py-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-[20px] font-bold text-white"
                    style={{ background: artisan.color }}
                  >
                    {artisan.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Syne'] text-[18px] font-bold text-white">
                        {artisan.name}
                      </span>
                      {artisan.verified && <BadgeCheck size={16} className="text-[#4ADE80]" />}
                    </div>
                    <div className="mt-0.5 text-[12px] text-[rgba(255,255,255,0.5)]">
                      {artisan.specEmoji} {artisan.spec} · {artisan.zone}
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ArtisanStatusPill status={artisan.status} />
                      {artisan.plan !== "—" && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            artisan.plan === "Premium"
                              ? "bg-[rgba(240,90,26,0.3)] text-[#FF7A3D]"
                              : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"
                          }`}
                        >
                          {artisan.plan}
                        </span>
                      )}
                    </div>
                  </div>
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

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Missions", value: String(artisan.missions) },
                  {
                    label: "Note",
                    value: artisan.rating != null ? `${artisan.rating.toFixed(1)}★` : "—",
                  },
                  { label: "Revenus", value: artisan.revenue },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-[rgba(255,255,255,0.06)] p-3 text-center"
                  >
                    <div className="font-['Syne'] text-[16px] font-bold text-white">{s.value}</div>
                    <div className="mt-0.5 text-[10px] text-[rgba(255,255,255,0.4)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Contact
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: Phone, label: "Téléphone", value: artisan.phone },
                    { icon: MapPin, label: "Zone", value: artisan.zone },
                    { icon: Calendar, label: "Inscrit le", value: artisan.joinDate },
                    { icon: CreditCard, label: "Commission", value: artisan.commission },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 border-b border-[rgba(229,224,216,0.4)] py-1.5 last:border-0"
                      >
                        <Icon size={13} className="flex-shrink-0 text-[#6B7280]" />
                        <span className="w-20 flex-shrink-0 text-[11px] text-[#6B7280]">
                          {row.label}
                        </span>
                        <span className="text-[12px] font-medium text-[#0F1E35]">{row.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Documents KYC
                </div>
                <div className="space-y-2">
                  {[
                    { label: "CIN Recto", done: artisan.verified },
                    { label: "CIN Verso", done: artisan.verified },
                    { label: "Photo profil", done: artisan.verified },
                    { label: "Attestation", done: artisan.plan === "Premium" },
                  ].map((doc) => (
                    <div
                      key={doc.label}
                      className="flex items-center justify-between border-b border-[rgba(229,224,216,0.4)] py-1.5 last:border-0"
                    >
                      <span className="text-[12px] text-[#0F1E35]">{doc.label}</span>
                      {doc.done ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1B8A4E]">
                          <CheckCircle size={11} />
                          Vérifié
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF]">Non fourni</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Modifier la commission
                </div>
                <div className="flex gap-2">
                  {["7%", "10%", "15%"].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onNewCommissionChange(c)}
                      className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold transition-all ${
                        newCommission === c ||
                        (newCommission === "" && artisan.commission === c)
                          ? "border-[#0F1E35] bg-[#0F1E35] text-white"
                          : "border-[#E5E0D8] bg-white text-[#0F1E35] hover:border-[#0F1E35]"
                      }`}
                    >
                      {c}
                      <div className="mt-0.5 text-[9px] opacity-60">
                        {c === "7%" ? "Pro" : c === "10%" ? "Premium" : "Standard"}
                      </div>
                    </button>
                  ))}
                </div>
                {newCommission && newCommission !== artisan.commission && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => onCommissionChange(artisan.id, newCommission)}
                    className="mt-3 w-full rounded-xl bg-[#F05A1A] py-2.5 text-[13px] font-semibold text-white"
                  >
                    Appliquer {newCommission}
                  </motion.button>
                )}
              </div>

              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Actions admin
                </div>
                <div className="space-y-2">
                  {artisan.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => onApprove(artisan.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B8A4E] py-3 text-[13px] font-semibold text-white"
                      >
                        <BadgeCheck size={15} />
                        Valider le KYC et activer
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(artisan.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.07)] py-3 text-[13px] font-semibold text-[#DC2626]"
                      >
                        <X size={15} />
                        Refuser le KYC
                      </button>
                    </>
                  )}

                  {artisan.status === "active" && (
                    <>
                      <button
                        type="button"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                      >
                        <MessageSquare size={14} />
                        Envoyer un message
                      </button>
                      <button
                        type="button"
                        onClick={() => onSuspend(artisan.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.06)] py-3 text-[13px] font-semibold text-[#DC2626]"
                      >
                        <Ban size={14} />
                        Suspendre le compte
                      </button>
                    </>
                  )}

                  {artisan.status === "suspended" && (
                    <button
                      type="button"
                      onClick={() => onReactivate(artisan.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B8A4E] py-3 text-[13px] font-semibold text-white"
                    >
                      <CheckCircle size={14} />
                      Réactiver le compte
                    </button>
                  )}

                  {artisan.status === "inactive" && (
                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                    >
                      <Mail size={14} />
                      Relancer par SMS
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
