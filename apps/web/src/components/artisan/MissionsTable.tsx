"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { DisplayTitle } from "@/components/ui/display-title";

const MISSIONS = [
  {
    type: "🔧",
    service: "Fuite robinet",
    client: "Fatima Z.",
    price: 255,
    net: 216,
    status: "done" as const,
    time: "14h30",
    rating: 5,
  },
  {
    type: "🔧",
    service: "Chauffe-eau HS",
    client: "Youssef B.",
    price: 425,
    net: 361,
    status: "done" as const,
    time: "11h00",
    rating: 5,
  },
  {
    type: "⚡",
    service: "Tableau élec.",
    client: "Hassan A.",
    price: 180,
    net: 153,
    status: "done" as const,
    time: "Hier",
    rating: 4,
  },
  {
    type: "🔧",
    service: "Canalisation",
    client: "Nadia M.",
    price: 320,
    net: 272,
    status: "done" as const,
    time: "Hier",
    rating: 5,
  },
  {
    type: "🔧",
    service: "Fuite eau",
    client: "Mohammed O.",
    price: 0,
    net: 0,
    status: "pending" as const,
    time: "Demain 17h",
    rating: null,
  },
];

export function MissionsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="h-full rounded-2xl border border-dep-border bg-white p-5"
    >
      <div className="mb-4 flex items-center justify-between">
        <DisplayTitle as="h3" size="sm" className="text-[14px] font-semibold">
          Missions récentes
        </DisplayTitle>
        <Link href="/artisan/missions" className="text-xs font-medium text-orange hover:underline">
          Voir tout →
        </Link>
      </div>

      {MISSIONS.length === 0 ? (
        <p className="py-8 text-center text-sm text-dep-gray">Aucune donnée</p>
      ) : (
        <div>
          {MISSIONS.map((mission) => (
            <div
              key={`${mission.service}-${mission.time}`}
              className="-mx-3 flex items-center gap-3 rounded-lg border-b border-[rgba(229,224,216,0.5)] px-3 py-3 transition-colors last:border-0 hover:bg-cream"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream text-[18px]">
                {mission.type}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-navy">{mission.service}</div>
                <div className="text-[11px] text-dep-gray">
                  {mission.client} · {mission.time}
                </div>
              </div>
              <div className="text-right">
                {mission.status === "done" ? (
                  <>
                    <div className="text-[13px] font-bold text-navy">
                      {mission.price.toLocaleString("fr-FR")} MAD
                    </div>
                    <div className="text-[10px] text-green">
                      net {mission.net.toLocaleString("fr-FR")} MAD
                    </div>
                  </>
                ) : (
                  <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold text-orange">
                    À venir
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
