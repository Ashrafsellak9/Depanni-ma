"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";

const SPECIALTIES = ["Fuite d'eau", "Chauffe-eau", "Canalisation", "Robinetterie"];

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-2xl border border-dep-border bg-white p-5"
    >
      <div className="mb-4 flex items-center gap-3 border-b border-dep-border pb-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-[20px] font-bold text-white"
          style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
        >
          KA
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-syne text-[17px] font-bold text-navy">Khalid Amrani</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-dep-gray">Plombier</span>
            <span className="rounded-full bg-green/10 px-2 py-0.5 text-[10px] font-semibold text-green">
              ✓ Vérifié
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="font-syne text-[20px] font-bold text-navy">4.9</div>
          <div className="text-[11px] text-orange">★★★★★</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Missions", value: "200+" },
          { label: "Ce mois", value: "12" },
          { label: "Revenus", value: "3.2K" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-cream p-3 text-center">
            <div className="font-syne text-[16px] font-bold text-navy">{s.value}</div>
            <div className="mt-0.5 text-[10px] text-dep-gray">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {SPECIALTIES.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-navy/[0.08] bg-navy/[0.06] px-2.5 py-1 text-[11px] font-medium text-navy"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href="/artisan/profil"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dep-border bg-cream py-2.5 text-[13px] font-semibold text-navy transition-colors hover:bg-cream-2"
      >
        <Edit3 size={14} />
        Modifier mon profil
      </Link>
    </motion.div>
  );
}
