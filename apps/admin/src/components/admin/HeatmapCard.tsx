"use client";

import { motion } from "framer-motion";

export function HeatmapCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white"
    >
      <div className="flex items-center justify-between border-b border-dep-border px-5 py-4">
        <h2 className="text-sm font-semibold text-navy">Heatmap activité — El Jadida</h2>
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-green">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-green" />
          </span>
          Live
        </span>
      </div>

      <div className="p-4">
        <div
          className="relative h-[180px] overflow-hidden rounded-xl"
          style={{
            background: "linear-gradient(145deg, #d4e8d4 0%, #c0d9c0 45%, #b0ccb0 100%)",
          }}
        >
          <div className="absolute left-[15%] top-[20%] h-24 w-24 rounded-full bg-orange/35 blur-md" />
          <div className="absolute right-[20%] top-[35%] h-20 w-20 rounded-full bg-orange/30 blur-md" />
          <div className="absolute bottom-[25%] left-[40%] h-16 w-16 rounded-full bg-orange/25 blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-navy backdrop-blur-sm">
              Carte temps réel — El Jadida
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-dep-gray">
          <span>🟠 Zone forte demande</span>
          <span>🟢 Artisan disponible</span>
          <span>🔵 Mission en cours</span>
          <span>⚫ Zone non couverte</span>
        </div>
      </div>
    </motion.div>
  );
}
