"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Ban,
  MessageSquare,
  RefreshCw,
  Wrench,
  X,
} from "lucide-react";

import type { AdminMissionRow } from "@/components/admin/missions/adminMissionsMock";
import { StatusPill } from "@/components/admin/StatusPill";

const TIMELINE = [
  { time: "13h15", event: "Demande créée par le client", color: "#6B7280" },
  { time: "13h22", event: "Khalid A. a proposé 180 MAD", color: "#F05A1A" },
  { time: "13h24", event: "Client a accepté l'offre", color: "#0F1E35" },
  { time: "13h39", event: "Artisan arrivé sur place", color: "#1B8A4E" },
  { time: "14h30", event: "Mission validée · Paiement libéré", color: "#1B8A4E" },
];

type MissionDetailPanelProps = {
  mission: AdminMissionRow | null;
  onClose: () => void;
};

export function MissionDetailPanel({ mission, onClose }: MissionDetailPanelProps) {
  return (
    <AnimatePresence>
      {mission && (
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
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-[440px] overflow-y-auto bg-white shadow-2xl"
          >
            <div className="sticky top-0 flex items-center justify-between bg-[#0F1E35] px-6 py-5">
              <div>
                <div className="font-['Syne'] text-[16px] font-bold text-white">
                  Mission {mission.id}
                </div>
                <div className="mt-0.5 text-[11px] text-[rgba(255,255,255,0.5)]">{mission.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={mission.status} />
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.2)]"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(240,90,26,0.1)] text-[24px]">
                  {mission.emoji}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#0F1E35]">{mission.service}</div>
                  {mission.urgency && (
                    <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-[#F05A1A]">
                      🚨 Mission urgente
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Client
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-bold text-white"
                    style={{ background: mission.client.color }}
                  >
                    {mission.client.avatar}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0F1E35]">{mission.client.name}</div>
                    <div className="text-[12px] text-[#6B7280]">📍 {mission.client.location}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="rounded-lg border border-[#E5E0D8] bg-white p-2.5">
                    <div className="mb-0.5 text-[10px] text-[#6B7280]">Téléphone</div>
                    <div className="font-medium text-[#0F1E35]">06XX XX XX XX</div>
                  </div>
                  <div className="rounded-lg border border-[#E5E0D8] bg-white p-2.5">
                    <div className="mb-0.5 text-[10px] text-[#6B7280]">Missions totales</div>
                    <div className="font-medium text-[#0F1E35]">3 missions</div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Artisan
                </div>
                {mission.artisan === "—" ? (
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <AlertCircle size={14} />
                    <span className="text-[13px]">Aucun artisan assigné — demande en attente</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F05A1A] to-[#FF7A3D] text-[12px] font-bold text-white">
                        {mission.artisan
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#0F1E35]">{mission.artisan}</div>
                        <div className="text-[11px] text-[#F05A1A]">★★★★★ 4.9</div>
                      </div>
                    </div>
                    <button type="button" className="text-[12px] font-semibold text-[#F05A1A] hover:text-[#FF7A3D]">
                      Voir profil →
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Finances
                </div>
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Montant mission",
                      value: mission.amount > 0 ? `${mission.amount} MAD` : "—",
                      bold: true,
                    },
                    {
                      label: "Commission DEPANNI (15%)",
                      value: mission.commission > 0 ? `+${mission.commission} MAD` : "—",
                      green: true,
                    },
                    {
                      label: "Net artisan",
                      value:
                        mission.amount > 0
                          ? `${mission.amount - mission.commission} MAD`
                          : "—",
                    },
                    { label: "Mode paiement", value: "Carte bancaire" },
                    {
                      label: "Statut paiement",
                      value: mission.status === "done" ? "✓ Libéré" : "⏳ En attente",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between border-b border-[rgba(229,224,216,0.5)] py-1.5 last:border-0"
                    >
                      <span className="text-[12px] text-[#6B7280]">{row.label}</span>
                      <span
                        className={`text-[12px] ${
                          row.bold
                            ? "font-bold text-[#0F1E35]"
                            : row.green
                              ? "font-semibold text-[#1B8A4E]"
                              : "text-[#0F1E35]"
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Timeline
                </div>
                <div className="space-y-3">
                  {TIMELINE.map((event, i) => (
                    <div key={event.time} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ background: event.color }}
                        />
                        {i < TIMELINE.length - 1 && (
                          <div className="mt-1 min-h-[20px] w-px flex-1 bg-[#E5E0D8]" />
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 pb-2">
                        <span className="flex-shrink-0 font-mono text-[10px] text-[#9CA3AF]">
                          {event.time}
                        </span>
                        <span className="text-[12px] text-[#0F1E35]">{event.event}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-[#E5E0D8] pt-4">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Actions admin
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-2.5 text-[12px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <MessageSquare size={13} />
                    Contacter client
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-2.5 text-[12px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <Wrench size={13} />
                    Contacter artisan
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.07)] py-2.5 text-[12px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
                  >
                    <RefreshCw size={13} />
                    Rembourser client
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.07)] py-2.5 text-[12px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
                  >
                    <Ban size={13} />
                    Annuler la mission
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
