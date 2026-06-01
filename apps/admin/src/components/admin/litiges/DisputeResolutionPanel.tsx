"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Ban, CheckCircle, Phone, RefreshCw, Send, X } from "lucide-react";

import type { AdminLitige } from "@/components/admin/litiges/adminLitigesMock";
import { LitigeStatusPill } from "@/components/admin/litiges/LitigeStatusPill";

type DisputeResolutionPanelProps = {
  litige: AdminLitige | null;
  note: string;
  onNoteChange: (v: string) => void;
  refundPct: number;
  onRefundPctChange: (pct: number) => void;
  onClose: () => void;
  onRefund: (id: string) => void;
  onDismiss: (id: string) => void;
  onSuspend: (name: string) => void;
};

export function DisputeResolutionPanel({
  litige,
  note,
  onNoteChange,
  refundPct,
  onRefundPctChange,
  onClose,
  onRefund,
  onDismiss,
  onSuspend,
}: DisputeResolutionPanelProps) {
  const refundAmount = litige ? Math.round((litige.amount * refundPct) / 100) : 0;

  const headerBg =
    litige?.priority === "urgent"
      ? "bg-[#DC2626]"
      : litige?.status === "resolved"
        ? "bg-[#1B8A4E]"
        : "bg-[#0F1E35]";

  return (
    <AnimatePresence>
      {litige && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.35)]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[500px] flex-col overflow-y-auto bg-white shadow-2xl"
          >
            <div className={`flex items-center justify-between px-6 py-5 ${headerBg}`}>
              <div>
                <div className="mb-0.5 flex items-center gap-2">
                  <span className="font-['Syne'] text-[16px] font-bold text-white">
                    Litige {litige.id}
                  </span>
                  {litige.priority === "urgent" && (
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[#DC2626]">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[rgba(255,255,255,0.6)]">
                  Ouvert le {litige.createdAt}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LitigeStatusPill status={litige.status} label={litige.statusLabel} />
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.15)] text-white"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.04)] p-4">
                <div className="flex items-start gap-3">
                  <span className="text-[24px]">{litige.mission.emoji}</span>
                  <div>
                    <div className="mb-1 text-[14px] font-semibold text-[#0F1E35]">
                      {litige.reasonLabel}
                    </div>
                    <p className="text-[12px] leading-[1.6] text-[#6B7280]">{litige.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-semibold text-[#0F1E35]">
                        Mission {litige.mission.id}
                      </span>
                      <span className="text-[11px] font-bold text-[#DC2626]">
                        {litige.amount} MAD contestés
                      </span>
                      <span
                        className={`text-[11px] font-semibold ${
                          litige.ageHours >= 72 ? "text-[#DC2626]" : "text-[#F05A1A]"
                        }`}
                      >
                        ⏱ {litige.age}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Client
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                      style={{ background: litige.client.color }}
                    >
                      {litige.client.avatar}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#0F1E35]">
                        {litige.client.name}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">3 missions · Bon client</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white py-2 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <Phone size={11} />
                    Appeler
                  </button>
                </div>

                <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                  <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Artisan
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[12px] font-bold text-white"
                      style={{ background: litige.artisan.color }}
                    >
                      {litige.artisan.avatar}
                    </div>
                    <div>
                      <div className="text-[12px] font-semibold text-[#0F1E35]">
                        {litige.artisan.name}
                      </div>
                      <div className="text-[10px] text-[#F05A1A]">★★★★★ 4.9</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5E0D8] bg-white py-2 text-[11px] font-medium text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <Phone size={11} />
                    Appeler
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Notes de médiation
                </div>
                <div className="mb-3 min-h-[120px] space-y-3 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                  {litige.messages > 0 ? (
                    <>
                      <div className="flex gap-2">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0F1E35] text-[8px] font-bold text-white">
                          AD
                        </div>
                        <div className="flex-1 rounded-xl rounded-tl-none border border-[#E5E0D8] bg-white p-3">
                          <div className="mb-1 text-[10px] text-[#6B7280]">Admin · 27 Mai 10h15</div>
                          <p className="text-[12px] text-[#0F1E35]">
                            Litige ouvert. Contact client et artisan effectué. En attente des
                            preuves photos de part et d&apos;autre.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <div className="max-w-[280px] rounded-xl rounded-tr-none bg-[#0F1E35] p-3">
                          <div className="mb-1 text-[10px] text-[rgba(255,255,255,0.5)]">
                            Admin · 27 Mai 14h30
                          </div>
                          <p className="text-[12px] text-white">
                            Photos reçues du client. Analyse en cours. Décision sous 24h.
                          </p>
                        </div>
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0F1E35] text-[8px] font-bold text-white">
                          AD
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-16 items-center justify-center text-[12px] italic text-[#9CA3AF]">
                      Aucune note pour l&apos;instant
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                    placeholder="Ajouter une note interne..."
                    className="h-16 flex-1 resize-none rounded-xl border border-[#E5E0D8] bg-white p-3 font-['DM_Sans'] text-[12px] outline-none transition-all focus:border-[#0F1E35]"
                  />
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-xl bg-[#0F1E35] px-3 text-white transition-colors hover:bg-[#1A2E4A]"
                    aria-label="Envoyer la note"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {litige.status !== "resolved" && (
                <div>
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Résoudre le litige
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-xl border border-[#E5E0D8] p-4">
                      <div className="mb-3">
                        <div className="text-[13px] font-semibold text-[#0F1E35]">
                          Rembourser le client
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#6B7280]">
                          Total mission : {litige.amount} MAD
                        </div>
                      </div>
                      <div className="mb-3 flex gap-2">
                        {[25, 50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => onRefundPctChange(pct)}
                            className={`flex-1 rounded-lg border py-2 text-[12px] font-semibold transition-all ${
                              refundPct === pct
                                ? "border-[#0F1E35] bg-[#0F1E35] text-white"
                                : "border-[#E5E0D8] bg-[#FAF7F2] text-[#0F1E35]"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                      <div className="mb-3 flex items-center justify-between rounded-lg bg-[#FAF7F2] px-3 py-2">
                        <span className="text-[12px] text-[#6B7280]">Montant remboursé</span>
                        <span className="text-[14px] font-bold text-[#1B8A4E]">
                          {refundAmount} MAD
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRefund(litige.id)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1B8A4E] py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#166534]"
                      >
                        <RefreshCw size={14} />
                        Confirmer remboursement ({refundAmount} MAD)
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDismiss(litige.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                    >
                      <CheckCircle size={14} />
                      Clore sans remboursement
                    </button>

                    <button
                      type="button"
                      onClick={() => onSuspend(litige.artisan.name)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.06)] py-3 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
                    >
                      <Ban size={14} />
                      Avertir / Suspendre l&apos;artisan
                    </button>
                  </div>
                </div>
              )}

              {litige.status === "resolved" && (
                <div className="flex items-center gap-3 rounded-xl border border-[rgba(27,138,78,0.15)] bg-[rgba(27,138,78,0.07)] p-4">
                  <CheckCircle size={20} className="flex-shrink-0 text-[#1B8A4E]" />
                  <div>
                    <div className="text-[13px] font-semibold text-[#1B8A4E]">Litige résolu</div>
                    <div className="mt-0.5 text-[12px] text-[#6B7280]">{litige.description}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
