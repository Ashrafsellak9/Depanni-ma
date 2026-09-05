"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";

import {
  formatLoginStats,
  getFallbackLoginStats,
  type LoginStatItem,
} from "@/lib/loginStats";
import { fetchLoginStats } from "@/services/adminApi";

const fadeLeft = (delay: number) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay, duration: 0.5, ease: "easeOut" as const },
});

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "" : "relative z-10"}`}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange">
        <Wrench className="h-5 w-5 text-white" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-[10px] bg-black/25" aria-hidden />
      </div>
      <div>
        <span
          className={`font-syne font-extrabold tracking-tight text-white ${
            compact ? "text-lg" : "text-xl"
          }`}
        >
          DEPANNI<span className="text-orange">.ma</span>
        </span>
        <div className="font-dm text-[10px] uppercase tracking-[0.15em] text-white/50">
          Admin Dashboard
        </div>
      </div>
    </div>
  );
}

export function AdminLoginBranding() {
  const [stats, setStats] = useState<LoginStatItem[]>(() => getFallbackLoginStats());

  useEffect(() => {
    let cancelled = false;

    void fetchLoginStats()
      .then((data) => {
        if (!cancelled) setStats(formatLoginStats(data));
      })
      .catch(() => {
        if (!cancelled) setStats(getFallbackLoginStats());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="border-b border-white/10 bg-navy px-4 py-4 lg:hidden">
        <BrandMark compact />
      </div>

      <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-orange/[0.07]" />
        <div className="pointer-events-none absolute right-[-60px] top-[30%] h-[200px] w-[200px] rounded-full border border-orange/10" />

        <motion.div {...fadeLeft(0)}>
          <BrandMark />
        </motion.div>

        <motion.div {...fadeLeft(0.15)} className="relative z-10">
          <h1 className="mb-4 font-syne text-[42px] font-extrabold leading-[1.05] tracking-tight2 text-white">
            Gérez votre
            <br />
            plateforme
            <br />
            <span className="text-orange">en temps réel</span>
          </h1>
          <p className="max-w-[320px] font-dm text-[15px] font-light leading-relaxed text-white/70">
            Tableau de bord centralisé pour piloter les missions, artisans, paiements et la
            satisfaction client sur DEPANNI.ma.
          </p>
        </motion.div>

        <motion.div {...fadeLeft(0.3)} className="relative z-10 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="font-syne text-xl font-bold text-white">{stat.value}</div>
              <div className="mt-1 text-[11px] text-white/55">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
