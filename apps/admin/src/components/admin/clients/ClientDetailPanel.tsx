"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Ban,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  X,
} from "lucide-react";

import type { AdminClient } from "@/components/admin/clients/adminClientsMock";
import { RECENT_MISSIONS } from "@/components/admin/clients/adminClientsMock";
import { ClientStatusPill } from "@/components/admin/clients/ClientStatusPill";

type ClientDetailPanelProps = {
  client: AdminClient | null;
  onClose: () => void;
  onBlock: (id: string) => void;
  onUnblock: (id: string) => void;
};

export function ClientDetailPanel({
  client,
  onClose,
  onBlock,
  onUnblock,
}: ClientDetailPanelProps) {
  return (
    <AnimatePresence>
      {client && (
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
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-[440px] overflow-y-auto bg-white shadow-2xl"
          >
            <div className="bg-[#0F1E35] px-6 py-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-[20px] font-bold text-white"
                    style={{ background: client.color }}
                  >
                    {client.initials}
                  </div>
                  <div>
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-['Syne'] text-[17px] font-bold text-white">
                        {client.name}
                      </span>
                      {client.verified && <BadgeCheck size={14} className="text-[#4ADE80]" />}
                    </div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.5)]">
                      {client.city} · Inscrit le {client.joinDate}
                    </div>
                    <div className="mt-1.5">
                      <ClientStatusPill status={client.status} />
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
                  { label: "Missions", value: String(client.missions) },
                  {
                    label: "Total dépensé",
                    value:
                      client.totalSpent > 0
                        ? `${client.totalSpent.toLocaleString("fr-FR")} MAD`
                        : "—",
                  },
                  {
                    label: "Note donnée",
                    value: client.rating != null ? `${client.rating}★` : "—",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl bg-[rgba(255,255,255,0.06)] p-3 text-center"
                  >
                    <div className="font-['Syne'] text-[15px] font-bold text-white">{s.value}</div>
                    <div className="mt-0.5 text-[9px] text-[rgba(255,255,255,0.4)]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Coordonnées
                </div>
                <div className="space-y-2.5">
                  {[
                    { icon: Mail, label: "Email", value: client.email },
                    { icon: Phone, label: "Téléphone", value: client.phone },
                    { icon: MapPin, label: "Ville", value: client.city },
                    { icon: Calendar, label: "Inscription", value: client.joinDate },
                    { icon: Clock, label: "Dernière mission", value: client.lastMission },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 border-b border-[rgba(229,224,216,0.4)] py-1.5 last:border-0"
                      >
                        <Icon size={12} className="flex-shrink-0 text-[#6B7280]" />
                        <span className="w-24 flex-shrink-0 text-[11px] text-[#6B7280]">
                          {row.label}
                        </span>
                        <span className="truncate text-[12px] font-medium text-[#0F1E35]">
                          {row.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Missions récentes
                  </div>
                  <button type="button" className="text-[11px] text-[#F05A1A]">
                    Voir tout →
                  </button>
                </div>
                {client.missions > 0 ? (
                  <div className="space-y-2">
                    {RECENT_MISSIONS.slice(0, Math.min(client.missions, 2)).map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 border-b border-[rgba(229,224,216,0.4)] py-2 last:border-0"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D8] bg-white text-[14px]">
                          {m.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-medium text-[#0F1E35]">{m.service}</div>
                          <div className="text-[10px] text-[#6B7280]">
                            {m.artisan} · {m.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[12px] font-bold text-[#0F1E35]">{m.price} MAD</div>
                          <div className="text-[10px] text-[#F05A1A]">{"★".repeat(m.rating)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-[12px] italic text-[#9CA3AF]">
                    Aucune mission pour l&apos;instant
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Vérification
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Email vérifié", done: client.verified },
                    { label: "Téléphone vérifié (OTP)", done: true },
                    { label: "Profil complété", done: client.missions > 0 },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-[rgba(229,224,216,0.4)] py-1.5 last:border-0"
                    >
                      <span className="text-[12px] text-[#0F1E35]">{item.label}</span>
                      {item.done ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#1B8A4E]">
                          <CheckCircle size={11} />
                          Oui
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF]">Non</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Actions admin
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <MessageSquare size={14} />
                    Envoyer un message
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] py-3 text-[13px] font-semibold text-[#0F1E35] transition-colors hover:bg-[#F0EBE1]"
                  >
                    <ClipboardList size={14} />
                    Voir toutes les missions
                  </button>
                  {client.status !== "blocked" ? (
                    <button
                      type="button"
                      onClick={() => onBlock(client.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(220,38,38,0.15)] bg-[rgba(220,38,38,0.06)] py-3 text-[13px] font-semibold text-[#DC2626] transition-colors hover:bg-[rgba(220,38,38,0.1)]"
                    >
                      <Ban size={14} />
                      Bloquer ce client
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUnblock(client.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(27,138,78,0.15)] bg-[rgba(27,138,78,0.08)] py-3 text-[13px] font-semibold text-[#1B8A4E]"
                    >
                      <CheckCircle size={14} />
                      Débloquer
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
