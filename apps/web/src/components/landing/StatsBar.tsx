"use client";

import { BadgeCheck, Headphones, RefreshCw, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AnimatedStat } from "@/components/landing/ui/AnimatedStat";
import { cn } from "@/lib/utils";

const STATS = [
  {
    render: () => (
      <>
        <span className="text-rust">+</span>
        <AnimatedStat value={1200} />
      </>
    ),
    label: "clients satisfaits",
  },
  {
    render: () => (
      <>
        <AnimatedStat value={280} />
        <span className="text-rust">+</span>
      </>
    ),
    label: "artisans vérifiés",
  },
  {
    render: () => (
      <>
        <AnimatedStat value={4.8} decimals={1} />
        <span className="text-rust">/5</span>
      </>
    ),
    label: "note moyenne",
  },
  {
    render: () => (
      <>
        <span className="text-rust">&lt;</span> <AnimatedStat value={8} />
        {" min"}
      </>
    ),
    label: "première offre",
  },
];

const GUARANTEES: { icon: LucideIcon; title: string; subtitle: string }[] = [
  {
    icon: Shield,
    title: "Paiement sécurisé",
    subtitle: "CMI · Visa · Mastercard",
  },
  {
    icon: BadgeCheck,
    title: "Artisans vérifiés",
    subtitle: "Identité et compétences contrôlées",
  },
  {
    icon: RefreshCw,
    title: "Satisfait, sinon on revient",
    subtitle: "Nouvelle intervention gratuite si besoin",
  },
  {
    icon: Headphones,
    title: "Support 7 j/7",
    subtitle: "Une équipe à votre écoute",
  },
];

export function StatsBar() {
  return (
    <section className="grain-ink overflow-hidden bg-ink py-20 md:py-24">
      <div className="landing-container relative z-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className={cn(
                  "text-center md:text-left",
                  "md:border-l md:border-white/10 md:pl-6 md:first:border-0 md:first:pl-0",
                )}
              >
                <div className="font-mono text-4xl tracking-[-0.03em] text-white lg:text-5xl">
                  {stat.render()}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* TODO: brancher sur la vraie date de dernière mise à jour depuis la DB */}
          <p className="mt-4 text-center font-mono text-xs uppercase tracking-widest text-white/40">
            Données actualisées mensuellement · Septembre 2026
          </p>

          <div className="my-12 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
              Nos engagements
            </span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {GUARANTEES.map((g) => (
              <div
                key={g.title}
                className="flex items-start gap-4 rounded-2xl bg-white/[0.03] p-5 transition-colors duration-300 hover:bg-white/[0.05]"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rust/10">
                  <g.icon className="size-5 text-rust" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-snug text-white">{g.title}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/50">{g.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
