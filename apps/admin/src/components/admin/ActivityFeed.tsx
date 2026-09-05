"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ACTIVITIES = [
  {
    color: "#1B8A4E",
    text: ["Khalid Amrani", " a terminé une mission plomberie · 255 MAD"],
    time: "il y a 8 min",
  },
  {
    color: "#F05A1A",
    text: ["Nouvelle demande ", "serrurerie urgente", " — Youssef B."],
    time: "il y a 14 min",
  },
  {
    color: "#7C3AED",
    text: ["Rachid El Filali", " s'est inscrit comme artisan (KYC en attente)"],
    time: "il y a 32 min",
  },
  {
    color: "#DC2626",
    text: ["Litige ouvert — ", "Mission #1247", " · Client insatisfait"],
    time: "il y a 1h",
  },
  {
    color: "#1B8A4E",
    text: ["Virement ", "Khalid Amrani", " — 2 840 MAD → CIH Bank"],
    time: "il y a 2h",
  },
];

export type ActivityFeedItem = { color?: string; text: string | string[]; time: string; dot?: string };

const DOT_TO_COLOR: Record<string, string> = {
  "bg-green": "#1B8A4E",
  "bg-dep-purple": "#7C3AED",
  "bg-dep-red": "#DC2626",
  "bg-orange": "#F05A1A",
};

export function ActivityFeed({ items }: { items?: ActivityFeedItem[] }) {
  const list =
    items?.map((item) => ({
      color: item.color ?? (item.dot ? DOT_TO_COLOR[item.dot] ?? "#F05A1A" : "#F05A1A"),
      text: Array.isArray(item.text) ? item.text : [item.text],
      time: item.time,
    })) ?? ACTIVITIES;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-[#E5E0D8] bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy">Activité récente</h2>
        <Link href="/admin/notifications" className="text-xs text-[#6B7280] hover:text-[#F05A1A]">
          Tout voir
        </Link>
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-[#6B7280]">Aucune donnée</p>
      ) : (
        <ul>
          {list.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 border-b border-[#E5E0D8] py-2.5 last:border-0"
            >
              <span
                className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <p className="flex-1 text-[12px] leading-[1.5] text-[#0F1E35]">
                {item.text.map((part, idx) => (
                  <span key={idx} className={idx % 2 === 0 ? "font-semibold" : undefined}>
                    {part}
                  </span>
                ))}
              </p>
              <span className="shrink-0 whitespace-nowrap text-[10px] text-[#6B7280]">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}
