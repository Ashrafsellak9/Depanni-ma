"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  Clock,
  Headphones,
  RefreshCw,
  Shield,
  Star,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AudienceTabs } from "@/components/how-it-works/AudienceTabs";
import { HowItWorksFaq } from "@/components/how-it-works/HowItWorksFaq";
import { HowItWorksSteps } from "@/components/how-it-works/HowItWorksSteps";
import {
  ARTISAN_STEPS,
  CLIENT_STEPS,
  HEADER_STATS,
  type Audience,
} from "@/components/how-it-works/howItWorksData";
import { SectionTag } from "@/components/landing/SectionTag";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";
import { cn } from "@/lib/utils";

const GUARANTEE_ICONS: Record<string, LucideIcon> = {
  Shield,
  BadgeCheck,
  Star,
  Clock,
  Headphones,
  RefreshCw,
};

const GUARANTEES = [
  {
    icon: "Shield",
    title: "Paiement sécurisé",
    desc: "Votre argent est bloqué jusqu'à votre validation. Remboursement intégral si l'artisan ne se présente pas.",
    color: "orange" as const,
  },
  {
    icon: "BadgeCheck",
    title: "Artisans vérifiés",
    desc: "Chaque artisan est vérifié par notre équipe : CIN, diplôme, photo. Aucun inconnu ne peut s'inscrire.",
    color: "navy" as const,
  },
  {
    icon: "Star",
    title: "Avis certifiés",
    desc: "Les notes proviennent uniquement de clients ayant effectué une vraie mission. Impossibles à falsifier.",
    color: "orange" as const,
  },
  {
    icon: "Clock",
    title: "Prix annoncé à l'avance",
    desc: "Le prix est fixé AVANT l'intervention. Aucune mauvaise surprise à la facture.",
    color: "navy" as const,
  },
  {
    icon: "Headphones",
    title: "Support 7j/7",
    desc: "Notre équipe est disponible par WhatsApp et email pour tout litige ou problème.",
    color: "orange" as const,
  },
  {
    icon: "RefreshCw",
    title: "Remboursement garanti",
    desc: "Si vous n'êtes pas satisfait du travail effectué, nous vous remboursons ou trouvons un autre artisan.",
    color: "navy" as const,
  },
];

function iconColorClass(color: "navy" | "orange") {
  return color === "navy" ? "text-navy" : "text-orange";
}

function iconBgClass(color: "navy" | "orange") {
  return color === "navy" ? "bg-navy/[0.07]" : "bg-orange/10";
}

export function HowItWorksPage() {
  const [audience, setAudience] = useState<Audience>("client");
  const reduceMotion = useReducedMotion();
  const steps = audience === "client" ? CLIENT_STEPS : ARTISAN_STEPS;

  const panelMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 },
      };

  return (
    <>
      <section className="scroll-mt-28 bg-paper pb-8 pt-8 text-center md:pt-12">
        <div className="landing-container">
          <SectionTag>Comment ça marche</SectionTag>

          <DisplayTitle as="h1" size="display-1" className="mx-auto mb-4 mt-4 max-w-[600px]">
            Simple, rapide, <Accent>transparent</Accent>
          </DisplayTitle>

          <p className="mx-auto max-w-[52ch] text-lg leading-relaxed text-ink/70">
            De la demande à l&apos;intervention, en moins de 15 minutes chrono. Voici comment ça
            marche.
          </p>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="rounded-3xl border border-line bg-white p-8 shadow-[0_1px_0_rgba(11,27,43,0.04)] md:p-10">
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
                {HEADER_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center md:border-l md:border-line md:pl-6 md:text-left md:first:border-0 md:first:pl-0"
                  >
                    <div className="font-mono text-3xl tracking-[-0.02em] text-ink md:text-4xl">
                      <span className="text-rust">{stat.value.replace(/[0-9,]/g, "")}</span>
                      <span>{stat.value.replace(/[^0-9,]/g, "")}</span>
                      <span className="text-rust">{stat.suffix}</span>
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-widest text-ink/60">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <AudienceTabs audience={audience} onChange={setAudience} />

      <motion.div
        key={audience}
        role="tabpanel"
        id={`panel-${audience}`}
        aria-labelledby={`tab-${audience}`}
        {...panelMotion}
      >
        <HowItWorksSteps steps={steps} audience={audience} />
      </motion.div>

      <section id="garanties" className="scroll-mt-28 border-y border-dep-border bg-white py-16">
        <div className="container mx-auto max-w-[900px] px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/50">
              Nos garanties
            </p>
            <DisplayTitle as="h2" size="display-2">
              Vous êtes <Accent>protégé</Accent> à chaque étape
            </DisplayTitle>
            <p className="mx-auto mt-6 max-w-[52ch] text-lg text-ink/70">
              De la publication de la demande jusqu&apos;au paiement final, DEPANNI garantit chaque
              étape par des engagements concrets et vérifiables.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GUARANTEES.map((g, i) => {
              const Icon = GUARANTEE_ICONS[g.icon] ?? Shield;
              const motionProps = reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { delay: i * 0.06, duration: 0.3 },
                  };

              return (
                <motion.div
                  key={g.title}
                  {...motionProps}
                  className="rounded-2xl border border-dep-border bg-cream p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange hover:shadow-md"
                >
                  <div
                    className={cn(
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                      iconBgClass(g.color),
                    )}
                  >
                    <Icon className={cn("h-[18px] w-[18px]", iconColorClass(g.color))} aria-hidden />
                  </div>
                  <DisplayTitle as="h3" size="display-3" className="mb-2 text-base tracking-normal">
                    {g.title}
                  </DisplayTitle>
                  <p className="text-sm leading-relaxed text-dep-gray">{g.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorksFaq />

      <section className="relative overflow-hidden bg-orange py-20 text-center">
        <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full bg-black/5" />

        <div className="container relative z-10 mx-auto px-4">
          <DisplayTitle as="h2" size="display-1" className="mb-4 text-white">
            Prêt à <Accent className="text-white">essayer</Accent>&nbsp;?
          </DisplayTitle>
          <p className="mx-auto mb-8 max-w-[400px] text-base font-light text-white/80 md:text-lg">
            Votre premier artisan à El Jadida, en moins de 8 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <RequestCta
              variant="white"
              event="how-request"
              className="min-h-[48px] px-8 py-4 text-sm font-semibold text-orange shadow-xl hover:-translate-y-0.5"
            >
              Faire une demande
            </RequestCta>
            <Link
              href={AUTH_ROUTES.artisanRegister}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 text-sm font-medium text-white transition-all duration-200 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange"
            >
              Devenir artisan →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
