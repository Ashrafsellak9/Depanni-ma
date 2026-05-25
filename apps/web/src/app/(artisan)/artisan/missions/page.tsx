"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

import {
  PendingMissionCard,
  type PendingMission,
} from "@/components/artisan/PendingMissionCard";

const PENDING: PendingMission[] = [
  {
    id: "M-1090",
    type: "🔧",
    service: "Plomberie",
    subtype: "Fuite d'eau",
    distance: "1.2 km",
    eta: "8 min",
    budget: "100–200 MAD",
    urgency: "urgent",
    client: { name: "Mohammed O.", rating: "Bon client", missions: 3 },
    description: "Fuite importante sous le lavabo cuisine depuis ce matin.",
    expiresIn: 87,
  },
  {
    id: "M-1089",
    type: "⚡",
    service: "Électricité",
    subtype: "Panne courant",
    distance: "2.1 km",
    eta: "15 min",
    budget: "150–250 MAD",
    urgency: "normal",
    client: { name: "Fatima Z.", rating: "Excellente cliente", missions: 8 },
    description: "Panne totale dans l'appartement depuis hier soir.",
    expiresIn: 234,
  },
];

const COMPLETED = [
  { service: "Fuite robinet", client: "Fatima Z.", date: "27 Avr", brut: 255, net: 216 },
  { service: "Chauffe-eau", client: "Youssef B.", date: "26 Avr", brut: 425, net: 361 },
  { service: "Tableau élec.", client: "Hassan A.", date: "25 Avr", brut: 180, net: 153 },
  { service: "Canalisation", client: "Nadia M.", date: "24 Avr", brut: 320, net: 272 },
];

const TABS = [
  { id: "pending", label: "En attente", count: 2 },
  { id: "active", label: "En cours", count: 1 },
  { id: "done", label: "Terminées", count: null },
  { id: "all", label: "Toutes", count: null },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ArtisanMissionsPage() {
  const [tab, setTab] = useState<TabId>("pending");
  const totalEarned = COMPLETED.reduce((s, m) => s + m.net, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-dep-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              tab === t.id
                ? "border-orange text-orange"
                : "border-transparent text-dep-gray hover:text-navy"
            }`}
          >
            {t.label}
            {t.count != null && (
              <span className="ml-1.5 rounded-full bg-orange/10 px-1.5 text-[11px] text-orange">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "pending" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {PENDING.map((m) => (
            <PendingMissionCard key={m.id} mission={m} />
          ))}
        </motion.div>
      )}

      {tab === "active" && (
        <div className="rounded-2xl border border-dep-border bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-navy">1 mission en cours</p>
          <p className="mt-1 text-[13px] text-dep-gray">
            Fuite eau — Mohammed O. · Demain 17h00
          </p>
        </div>
      )}

      {(tab === "done" || tab === "all") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] text-dep-gray">Total gagné (période)</p>
              <p className="font-syne text-2xl font-bold text-navy">
                {totalEarned.toLocaleString("fr-FR")} MAD
              </p>
            </div>
            <div className="flex gap-2">
              <select className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm">
                <option>Ce mois</option>
                <option>Cette semaine</option>
                <option>3 derniers mois</option>
              </select>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-dep-border bg-white px-4 text-sm font-medium text-navy hover:bg-cream"
              >
                <Download className="h-4 w-4" />
                Exporter
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr>
                  {["Service", "Client", "Date", "Brut", "Net"].map((h) => (
                    <th
                      key={h}
                      className="border-b border-dep-border px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-dep-gray"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPLETED.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-dep-gray">
                      Aucune donnée
                    </td>
                  </tr>
                ) : (
                  COMPLETED.map((m) => (
                    <tr key={m.service + m.date} className="hover:bg-cream">
                      <td className="border-b border-dep-border/50 px-4 py-3 font-medium text-navy">
                        {m.service}
                      </td>
                      <td className="border-b border-dep-border/50 px-4 py-3">{m.client}</td>
                      <td className="border-b border-dep-border/50 px-4 py-3 text-dep-gray">
                        {m.date}
                      </td>
                      <td className="border-b border-dep-border/50 px-4 py-3">
                        {m.brut.toLocaleString("fr-FR")} MAD
                      </td>
                      <td className="border-b border-dep-border/50 px-4 py-3 font-semibold text-green">
                        {m.net.toLocaleString("fr-FR")} MAD
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
