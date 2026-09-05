"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { AvatarCell } from "@/components/admin/AvatarCell";
import { StatusPill, type AdminStatus } from "@/components/admin/StatusPill";

export interface OverviewMission {
  id: string;
  client: string;
  location: string;
  avatar: string;
  avatarColor: string;
  service: string;
  serviceEmoji: string;
  artisan: string;
  amount: string;
  status: AdminStatus;
  date?: string;
}

const MISSIONS: OverviewMission[] = [
  {
    id: "M-1089",
    client: "Fatima Zahra",
    location: "Hay Hassani",
    avatar: "FZ",
    avatarColor: "#1E3A5F",
    service: "Plomberie",
    serviceEmoji: "🔧",
    artisan: "Khalid A.",
    amount: "255 MAD",
    status: "done",
    date: "Aujourd'hui 14h30",
  },
  {
    id: "M-1088",
    client: "Mohammed Ouali",
    location: "Centre-ville",
    avatar: "MO",
    avatarColor: "#7C3AED",
    service: "Électricité",
    serviceEmoji: "⚡",
    artisan: "Omar B.",
    amount: "180 MAD",
    status: "active",
    date: "Aujourd'hui 13h15",
  },
  {
    id: "M-1087",
    client: "Youssef Belhaj",
    location: "Bd Hassan II",
    avatar: "YB",
    avatarColor: "#059669",
    service: "Serrurerie",
    serviceEmoji: "🔑",
    artisan: "—",
    amount: "— MAD",
    status: "pending",
    date: "Aujourd'hui 12h50",
  },
  {
    id: "M-1086",
    client: "Hassan Alami",
    location: "Hay Mohammadi",
    avatar: "HA",
    avatarColor: "#DC2626",
    service: "Mécanique",
    serviceEmoji: "🚗",
    artisan: "Saad K.",
    amount: "320 MAD",
    status: "active",
    date: "Aujourd'hui 11h00",
  },
  {
    id: "M-1085",
    client: "Nadia Azzouzi",
    location: "Cité Essalam",
    avatar: "NA",
    avatarColor: "#B45309",
    service: "Peinture",
    serviceEmoji: "🎨",
    artisan: "Amine T.",
    amount: "800 MAD",
    status: "done",
    date: "Aujourd'hui 09h30",
  },
];

export function MissionsTable({
  compact = true,
  missions,
}: {
  compact?: boolean;
  missions?: OverviewMission[];
}) {
  const source = missions ?? MISSIONS;
  const rows = source.slice(0, compact ? 5 : source.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] px-5 py-4">
        <h2 className="text-sm font-semibold text-navy">Missions en cours & récentes</h2>
        <div className="flex items-center gap-3">
          <select className="rounded-lg border border-[#E5E0D8] bg-[#FAF7F2] px-2 py-1 text-xs text-navy outline-none">
            <option>Aujourd&apos;hui</option>
            <option>Cette semaine</option>
          </select>
          <Link href="/admin/missions" className="text-xs font-medium text-[#F05A1A] hover:underline">
            Voir tout →
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["Client", "Service", "Artisan", "Montant", "Statut", "Actions"].map((h) => (
                <th
                  key={h}
                  className="border-b border-[#E5E0D8] px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm text-[#6B7280]">
                  Aucune donnée
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={m.id} className="hover:bg-[#FAF7F2]">
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <AvatarCell initials={m.avatar} color={m.avatarColor} size="md" />
                      <div>
                        <p className="font-medium text-[#0F1E35]">{m.client}</p>
                        <p className="text-[11px] text-[#6B7280]">{m.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5">
                    {m.serviceEmoji} {m.service}
                  </td>
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5">{m.artisan}</td>
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5 font-semibold text-[#0F1E35]">
                    {m.amount}
                  </td>
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5">
                    <StatusPill status={m.status} />
                  </td>
                  <td className="border-b border-[rgba(229,224,216,0.5)] px-3 py-2.5">
                    <Link
                      href={`/admin/missions/${m.id}`}
                      className="inline-block rounded-md border border-[#E5E0D8] bg-[#F4F0E8] px-2 py-1 text-[11px] font-medium text-[#0F1E35] hover:bg-[#F0EBE1]"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
