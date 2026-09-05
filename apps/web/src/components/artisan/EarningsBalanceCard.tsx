"use client";

import { motion } from "framer-motion";
import { Building2, FileText } from "lucide-react";

import { BALANCE } from "@/components/artisan/artisanRevenusMock";

export function EarningsBalanceCard({
  available,
  nextTransfer,
}: {
  available?: number;
  nextTransfer?: string;
}) {
  const balance = {
    ...BALANCE,
    available: available ?? BALANCE.available,
    goalCurrent: available ?? BALANCE.goalCurrent,
    nextTransfer: nextTransfer ?? BALANCE.nextTransfer,
  };
  const goalPct = Math.round((balance.goalCurrent / balance.goalTarget) * 100);
  const goalRemaining = Math.max(0, balance.goalTarget - balance.goalCurrent);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 overflow-hidden rounded-2xl bg-navy p-6"
    >
      <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-[250px] w-[250px] rounded-full border border-white/[0.04]" />
      <div className="pointer-events-none absolute bottom-[-40px] left-[-40px] h-[180px] w-[180px] rounded-full bg-orange/[0.05]" />

      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-[1.5px] text-white/40">
              Solde disponible
            </div>
            <div className="font-display text-[44px] font-extrabold leading-none tracking-[-3px] text-white md:text-[52px]">
              {balance.available.toLocaleString("fr-FR")}
              <span className="ml-2 font-sans text-[20px] font-light text-white/50 md:text-[22px]">
                MAD
              </span>
            </div>
          </div>
          <select
            className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.08] px-3 py-2 font-sans text-[12px] text-white outline-none"
            defaultValue="mai-2026"
          >
            <option value="mai-2026">Mai 2026</option>
            <option value="avril-2026">Avril 2026</option>
            <option value="mars-2026">Mars 2026</option>
          </select>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
          <span className="text-[12px] text-white/50">
            Prochain virement automatique :
            <strong className="ml-1 text-white">{balance.nextTransfer}</strong>
          </span>
        </div>

        <div className="mb-5 rounded-xl border border-white/[0.08] bg-white/[0.05] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] text-white/60">Objectif mensuel</span>
            <span className="text-[12px] font-semibold text-white">
              {balance.goalCurrent.toLocaleString("fr-FR")} /{" "}
              {balance.goalTarget.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalPct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-orange to-orange-2"
            />
          </div>
          <div className="mt-1.5 flex justify-between">
            <span className="text-[10px] text-white/35">{goalPct}% atteint</span>
            <span className="text-[10px] text-white/35">
              Il reste {goalRemaining.toLocaleString("fr-FR")} MAD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-orange py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-orange-2"
          >
            <Building2 size={15} />
            Virer vers banque
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.12]"
          >
            <FileText size={15} />
            Relevé détaillé
          </button>
        </div>
      </div>
    </motion.div>
  );
}
