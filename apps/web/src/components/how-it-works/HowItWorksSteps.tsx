"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

import { StepVisual } from "@/components/how-it-works/StepVisual";
import type { HowItWorksStep } from "@/components/how-it-works/howItWorksData";
import { AUTH_ROUTES } from "@/lib/auth";
import { cn } from "@/lib/utils";

const PROCESS_BREAKDOWN = [
  { label: "Créer la demande", time: "< 2 min" },
  { label: "Recevoir les offres", time: "< 8 min" },
  { label: "Suivre l'artisan en route", time: "Variable" },
  { label: "Valider et payer", time: "< 1 min" },
] as const;

function StepBlock({ step, index }: { step: HowItWorksStep; index: number }) {
  const reduceMotion = useReducedMotion();
  const BadgeIcon = step.badgeIcon;
  const isReversed = index % 2 === 1;

  const motionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.3, ease: "easeOut" as const },
      };

  return (
    <motion.article
      {...motionProps}
      className="relative grid grid-cols-1 items-center gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24"
    >
      <div className="absolute left-1/2 top-8 hidden -translate-x-1/2 md:block">
        <div className="relative size-3">
          {!reduceMotion ? (
            <div className="absolute inset-0 rounded-full bg-rust/20 animate-ping-slow" />
          ) : null}
          <div className="relative size-3 rounded-full border-4 border-paper bg-rust" />
        </div>
      </div>

      <div className={cn("flex flex-col justify-center", isReversed ? "md:order-2" : "md:order-1")}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full bg-rust px-3 py-1 font-mono text-sm text-white">
            {step.num}
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-3 py-1 text-xs text-ink/70">
            <BadgeIcon className="size-3.5" strokeWidth={1.75} aria-hidden />
            {step.badge}
          </div>
        </div>

        <h3 className="mb-4 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
          {step.title}
        </h3>

        <p className="mb-6 max-w-[52ch] text-base leading-relaxed text-ink/70">{step.desc}</p>

        <ul className="space-y-3">
          {step.details.map((detail) => (
            <li key={detail} className="flex items-start gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-rust" strokeWidth={2.5} aria-hidden />
              <span className="text-sm text-ink/80">{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          "flex items-center justify-center",
          isReversed ? "md:order-1" : "md:order-2",
        )}
      >
        <StepVisual stepId={step.visual} alt={step.visualAlt} stepNum={step.num} />
      </div>
    </motion.article>
  );
}

function ProcessTimeBanner() {
  return (
    <div className="mx-auto mb-24 mt-16 max-w-3xl">
      <div className="grain-ink relative overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-10">
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="text-center md:text-left">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">
              Temps total moyen
            </div>
            <div className="font-mono text-6xl leading-none tracking-[-0.03em] md:text-7xl">
              <span className="text-rust">≈</span> 15<span className="text-rust"> min</span>
            </div>
            <div className="mt-2 text-sm text-white/60">De la demande au paiement</div>
          </div>

          <div className="space-y-3 md:border-l md:border-white/10 md:pl-8">
            {PROCESS_BREAKDOWN.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between border-b border-white/10 pb-2 text-sm last:border-0 last:pb-0"
              >
                <span className="text-white/70">{row.label}</span>
                <span className="font-mono text-white">{row.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSteps({
  steps,
  audience,
}: {
  steps: HowItWorksStep[];
  audience: "client" | "artisan";
}) {
  return (
    <div className="relative bg-paper px-6 pb-4">
      <div className="relative mx-auto max-w-5xl">
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 top-8 hidden w-px -translate-x-1/2 bg-gradient-to-b from-line via-line/50 to-line md:block"
          aria-hidden
        />

        {steps.map((step, i) => (
          <StepBlock key={`${audience}-${step.num}`} step={step} index={i} />
        ))}
      </div>

      <ProcessTimeBanner />

      {audience === "artisan" && (
        <div className="mx-auto max-w-5xl pb-12 text-center">
          <Link
            href={AUTH_ROUTES.artisanRegister}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-orange px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:brightness-[0.92] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Devenir artisan →
          </Link>
        </div>
      )}
    </div>
  );
}
