"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export function RevenusSubscriptionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-5 rounded-2xl border border-dep-border bg-white p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10">
            <Crown size={18} className="text-orange" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-navy">Abonnement Premium</div>
            <div className="text-[12px] text-dep-gray">Commission réduite 10% · 150 MAD/mois</div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1 rounded-full bg-orange/10 px-3 py-1.5 text-[11px] font-semibold text-orange">
            Actif jusqu&apos;au 01 Juin
          </div>
          <button type="button" className="text-[11px] text-dep-gray underline hover:text-navy">
            Gérer l&apos;abonnement →
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-green/10 bg-green/[0.05] p-3">
        <span className="text-[12px] text-green">
          💰 Économie réalisée ce mois vs commission standard (15%)
        </span>
        <span className="font-syne text-[16px] font-bold text-green">+188 MAD</span>
      </div>
    </motion.div>
  );
}
