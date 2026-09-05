"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, MessageCircle, Phone, Star } from "lucide-react";

import { AppStoreBadge, GooglePlayBadge } from "@/components/ui/store-badges";
import { viewportOnce } from "@/components/landing/motion";
import { StarRow } from "@/components/landing/ui/StarRow";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { PhoneScreen, PhoneStatusBar } from "@/components/ui/phone-screen";

function MiniTrackingMap() {
  return (
    <svg viewBox="0 0 280 140" className="h-[140px] w-full" aria-hidden>
      <rect width="280" height="140" fill="#EBE3D5" />
      <path d="M0 86h280" stroke="#DDD3C1" strokeWidth="10" />
      <path d="M0 48h280" stroke="#DDD3C1" strokeWidth="5" />
      <path d="M88 0v140" stroke="#DDD3C1" strokeWidth="7" />
      <path d="M186 0v140" stroke="#DDD3C1" strokeWidth="4" />
      <path
        d="M44 108 C 92 108, 118 42, 168 44 S 228 96, 236 96"
        fill="none"
        stroke="#D9451F"
        strokeWidth="2.2"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <circle cx="44" cy="108" r="7" fill="#0B1B2B" />
      <circle cx="44" cy="108" r="3" fill="#F5EFE6" />
      <circle cx="236" cy="96" r="8" fill="#D9451F" />
      <circle cx="236" cy="96" r="3.2" fill="#F5EFE6" />
    </svg>
  );
}

function AppTrackingScreen() {
  return (
    <div className="flex h-full flex-col bg-paper px-3.5 pb-4 pt-11">
      <PhoneStatusBar />
      <div className="mt-2.5 flex items-center gap-1.5">
        <ChevronLeft className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.5} aria-hidden />
        <span className="font-sans text-[13px] font-medium text-ink">Mission #4728</span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl">
        <MiniTrackingMap />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-rust" />
          <span className="relative inline-flex size-2 rounded-full bg-rust" />
        </span>
        <span className="font-sans text-[12px] font-medium text-ink">Khalid arrive</span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-avatar-3 font-display text-[12px] font-semibold text-ink">
          K
        </span>
        <div className="min-w-0">
          <p className="font-display text-[15px] font-semibold leading-tight text-ink">Khalid A.</p>
          <p className="flex items-center gap-1 font-sans text-[10px] text-ink/60">
            Plombier · 4,9
            <Star className="size-2.5 fill-rust text-rust" aria-hidden />
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(11,27,43,0.06)]">
        <p className="text-[10px] uppercase tracking-widest text-ink/50">Temps d&apos;arrivée</p>
        <p className="mt-1 font-mono text-[28px] font-medium leading-none tracking-tight text-ink">6 min</p>
        <p className="mt-1.5 font-sans text-[11px] text-ink/60">À 500 m de chez vous</p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full w-[70%] rounded-full bg-rust" />
      </div>

      <div className="mt-3 flex gap-2">
        <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-white py-2 font-sans text-[11px] font-medium text-ink">
          <Phone className="size-3.5 text-rust" strokeWidth={1.5} aria-hidden />
          Appeler
        </span>
        <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-white py-2 font-sans text-[11px] font-medium text-ink">
          <MessageCircle className="size-3.5 text-rust" strokeWidth={1.5} aria-hidden />
          Chat
        </span>
      </div>
    </div>
  );
}

function IosArrivalBanner({ reduced }: { reduced: boolean | null }) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: "-100%" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduced ? { duration: 0 } : { delay: 1.5, duration: 0.45, ease: "easeOut" }}
      className="absolute left-3 right-3 top-3 z-10 flex items-start gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ink">
        <span className="font-display text-xs font-bold text-white">D</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold text-ink">DEPANNI</span>
          <span className="text-[10px] text-ink/50">Maintenant</span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-ink">Khalid est arrivé en bas de chez vous</p>
      </div>
    </motion.div>
  );
}

export function AppDownloadBanner() {
  const reduced = useReducedMotion();

  return (
    <section id="produit-mobile" className="grain-ink overflow-hidden bg-ink py-20 md:py-28">
      <div className="landing-container relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55 }}
          className="flex justify-center lg:col-span-5"
        >
          <div className="relative w-[min(100%,400px)] rotate-[-4deg]">
            <PhoneScreen className="w-full sm:w-full">
              <AppTrackingScreen />
            </PhoneScreen>
            <IosArrivalBanner reduced={reduced} />
          </div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-rust">Le produit mobile</p>
          <DisplayTitle as="h2" size="display-2" className="mt-4 text-white">
            Votre artisan au bout du <Accent>doigt</Accent>.
          </DisplayTitle>
          <p className="mt-5 max-w-[52ch] text-lg text-white/70">
            Suivez vos demandes en temps réel, chattez avec l&apos;artisan, payez en sécurité, notez
            après intervention.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AppStoreBadge variant="dark" />
            <GooglePlayBadge variant="dark" />
          </div>
          {/* TODO: Remplacer 4,7/5 et 8 500+ par les vrais chiffres stores avant production. */}
          <p className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <StarRow starClassName="size-3" label="Note 4,7 sur 5" />
            <span className="font-mono tabular-nums">4,7/5</span>
            <span>sur les stores · 8 500+ téléchargements</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
