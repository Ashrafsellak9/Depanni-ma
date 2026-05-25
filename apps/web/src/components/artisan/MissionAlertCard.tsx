"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

export function MissionAlertCard() {
  return (
    <Link href="/artisan/missions">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="group mb-6 flex cursor-pointer items-center gap-4 rounded-2xl bg-navy p-5 transition-colors hover:bg-navy-2"
      >
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-orange opacity-30" />
          <Bell size={20} className="relative text-white" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-orange">
            3
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-0.5 text-[13px] font-semibold text-white">
            🚨 3 nouvelles missions près de vous
          </div>
          <div className="text-[12px] text-white/50">
            Plomberie · 1.2 km · Électricité · 2.1 km · Serrurerie · 3.4 km
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-orange px-4 py-2.5 text-[13px] font-semibold text-white transition-colors group-hover:bg-orange-2">
          Voir les missions
          <ArrowRight size={14} />
        </div>
      </motion.div>
    </Link>
  );
}
