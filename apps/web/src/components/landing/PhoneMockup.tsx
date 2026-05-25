"use client";

import { motion } from "framer-motion";

const CATEGORIES = [
  { icon: "🔧", label: "Plomberie", active: true },
  { icon: "⚡", label: "Électricité", active: false },
  { icon: "🔑", label: "Serrurerie", active: false },
  { icon: "🚗", label: "Mécanique", active: false },
  { icon: "🪟", label: "Vitrier", active: false },
  { icon: "🎨", label: "Peinture", active: false },
];

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-max max-w-full overflow-visible px-[70px] py-6">
      <div className="relative w-[280px] shrink-0">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 z-20 min-w-[160px] max-w-[180px] rounded-2xl border border-dep-border bg-white px-4 py-3 shadow-xl"
          style={{ right: -60 }}
        >
          <p className="text-xs font-medium text-dep-gray">Artisans disponibles</p>
          <p className="whitespace-nowrap font-syne text-[20px] font-extrabold leading-tight text-navy">
            24 près de vous
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute bottom-[60px] z-20 whitespace-nowrap rounded-2xl border border-dep-border bg-white px-4 py-3 shadow-xl"
          style={{ left: -70 }}
        >
          <p className="flex items-center gap-2 text-sm font-medium text-navy">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
            </span>
            Khalid arrive dans 12 min
          </p>
        </motion.div>

        <div className="w-[280px] rounded-[40px] bg-[#0a0f18] p-3 shadow-[0_40px_100px_rgba(15,30,53,0.2)]">
          <div className="flex aspect-[9/19] flex-col overflow-hidden rounded-[28px] bg-cream">
            <div className="flex shrink-0 items-center justify-between px-4 pb-1.5 pt-2.5 text-[9px] font-medium text-navy/70">
              <span>9:41</span>
              <div className="flex gap-0.5">
                <span className="h-1.5 w-1.5 rounded-sm bg-navy/80" />
                <span className="h-1.5 w-1.5 rounded-sm bg-navy/80" />
                <span className="h-1.5 w-1.5 rounded-sm bg-navy/50" />
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between border-b border-dep-border/60 px-3.5 pb-2.5">
              <span className="font-syne text-[11px] font-extrabold text-navy">
                DEPANNI<span className="text-orange">.ma</span>
              </span>
              <span className="relative text-base leading-none">
                🔔
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange text-[8px] font-bold text-white">
                  2
                </span>
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-3.5 pb-3.5 pt-2.5">
              <p className="text-[10px] text-dep-gray">Bonjour, Mohammed 👋</p>
              <p className="font-syne text-[13px] font-extrabold leading-tight text-navy">
                De quoi avez-vous besoin ?
              </p>

              <div className="rounded-lg border border-dep-border bg-white px-2.5 py-2 text-[10px] text-dep-gray">
                Décrire votre problème...
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat.label}
                    className={`flex h-[72px] w-full flex-col items-center justify-center rounded-xl text-center ${
                      cat.active
                        ? "bg-[#0F1E35] text-white"
                        : "border border-dep-border bg-white text-navy"
                    }`}
                  >
                    <span className="text-xl leading-none">{cat.icon}</span>
                    <span className="mt-1 text-[9px] font-medium leading-tight">{cat.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 rounded-lg bg-orange/10 px-2.5 py-1.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
                </span>
                <p className="text-[9px] leading-snug text-navy">
                  3 plombiers disponibles à moins de 2 km
                </p>
              </div>

              <div className="mt-auto flex items-center gap-2 rounded-lg border border-dep-border bg-white p-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-2 text-[10px] font-bold text-white">
                  KA
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-navy">Khalid Amrani</p>
                  <p className="text-[9px] text-dep-gray">1.2 km · 12 min</p>
                  <p className="text-[9px] text-amber-500">★★★★★</p>
                </div>
                <p className="shrink-0 font-syne text-xs font-extrabold text-orange">150 MAD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
