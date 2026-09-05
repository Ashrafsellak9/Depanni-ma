"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";

import { AppHomeScreen } from "@/components/landing/ui/AppHomeScreen";
import { PhoneFrame } from "@/components/landing/ui/PhoneFrame";
import { cn } from "@/lib/utils";

export function PhoneMockup() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[220px] overflow-visible px-2 py-8 sm:max-w-[240px] md:max-w-[250px] lg:max-w-[260px]">
      <div
        className="pointer-events-none absolute -right-16 top-1/2 -z-10 size-[420px] -translate-y-1/2 bg-rust/15 blur-3xl md:-right-10"
        aria-hidden
      />

      <div
        className="relative w-full min-w-0 lg:rotate-[-3deg]"
        style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.12))" }}
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={reduced ? { duration: 0 } : { delay: 0.6, duration: 0.5 }}
          className={cn(
            "absolute -right-2 -top-3 z-20 w-[180px] rounded-2xl bg-white p-3 shadow-xl sm:-right-4 md:-right-8 md:w-[200px]",
            !reduced && "animate-float [animation-delay:2s]",
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-avatar-2">
              <span className="font-display text-sm font-semibold text-ink">K</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-medium uppercase tracking-widest text-success">
                  En route
                </span>
              </div>
              <div className="text-sm font-medium leading-snug text-ink">
                Khalid a accepté votre demande
              </div>
              <div className="mt-1 font-mono text-xs text-ink/50">Il y a 12 secondes</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? { duration: 0 } : { delay: 1, duration: 0.5 }}
          className={cn(
            "absolute -bottom-6 left-0 z-10 max-w-[180px] rounded-2xl bg-white p-3 shadow-card sm:-left-6 md:max-w-[200px]",
            !reduced && "animate-float",
          )}
        >
          <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-ink/65">
            Note globale
          </div>
          <div className="mb-1 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="size-4 fill-rust text-rust" aria-hidden />
            ))}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-semibold tabular-nums text-ink">4,9</span>
            <span className="text-sm text-ink/60">/ 5</span>
            <span className="ml-auto text-sm text-ink/60">847 avis</span>
          </div>
        </motion.div>

        <PhoneFrame>
          <AppHomeScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
