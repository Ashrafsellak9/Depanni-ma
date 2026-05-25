"use client";

import { motion } from "framer-motion";
import { Building2, BarChart2 } from "lucide-react";

const TRANSACTIONS = [
  {
    type: "in" as const,
    icon: "💰",
    title: "Mission — Fuite eau",
    sub: "Khalid M. · Net après commission",
    date: "Aujourd'hui 16:30",
    amount: 255,
  },
  {
    type: "in" as const,
    icon: "💰",
    title: "Mission — Tableau électrique",
    sub: "Hassan A. · Net après commission",
    date: "Hier 11h15",
    amount: 340,
  },
  {
    type: "out" as const,
    icon: "📊",
    title: "Abonnement Premium",
    sub: "Commission réduite 10%",
    date: "01 Mai 2026",
    amount: -150,
  },
  {
    type: "in" as const,
    icon: "🏦",
    title: "Virement CIH Bank ****4521",
    sub: "Délai 24h ouvrées",
    date: "28 Avr 2026",
    amount: 2100,
  },
  {
    type: "in" as const,
    icon: "💰",
    title: "Mission — Chauffe-eau",
    sub: "Youssef B. · Net après commission",
    date: "27 Avr 2026",
    amount: 425,
  },
];

const STATS = [
  { label: "Brut ce mois", value: "3 765 MAD" },
  { label: "Net ce mois", value: "3 200 MAD" },
  { label: "Commissions", value: "565 MAD" },
  { label: "Missions", value: "12" },
];

export default function ArtisanRevenusPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl bg-navy p-6"
      >
        <div className="mb-1 text-[12px] uppercase tracking-wider text-white/50">
          Solde disponible
        </div>
        <div className="mb-1 font-syne text-[44px] font-extrabold tracking-[-2px] text-white">
          {(2840).toLocaleString("fr-FR")}{" "}
          <span className="text-[20px] text-white/50">MAD</span>
        </div>
        <div className="text-[12px] text-white/40">Prochain virement : demain 09h00</div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] py-3 text-[13px] font-semibold text-white"
          >
            <Building2 size={15} />
            Virer vers banque
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] py-3 text-[13px] font-semibold text-white"
          >
            <BarChart2 size={15} />
            Relevé détaillé
          </button>
        </div>
      </motion.div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-dep-border bg-white p-4"
          >
            <div className="text-[11px] text-dep-gray">{s.label}</div>
            <div className="mt-1 font-syne text-lg font-bold text-navy">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-5">
        <h3 className="mb-4 text-[14px] font-semibold text-navy">Historique des transactions</h3>
        {TRANSACTIONS.length === 0 ? (
          <p className="py-8 text-center text-sm text-dep-gray">Aucune donnée</p>
        ) : (
          <ul className="divide-y divide-dep-border/50">
            {TRANSACTIONS.map((tx) => (
              <li key={tx.title + tx.date} className="flex items-center gap-3 py-4 first:pt-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-lg">
                  {tx.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-navy">{tx.title}</div>
                  <div className="text-[11px] text-dep-gray">{tx.sub}</div>
                  <div className="text-[10px] text-dep-gray">{tx.date}</div>
                </div>
                <div
                  className={`shrink-0 font-syne text-[15px] font-bold ${
                    tx.amount >= 0 ? "text-green" : "text-[#DC2626]"
                  }`}
                >
                  {tx.amount >= 0 ? "+" : ""}
                  {tx.amount.toLocaleString("fr-FR")} MAD
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
