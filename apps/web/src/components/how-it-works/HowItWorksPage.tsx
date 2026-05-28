"use client";

import { AnimatePresence, motion } from "framer-motion";
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

import { HowItWorksFaq } from "@/components/how-it-works/HowItWorksFaq";
import { HowItWorksSteps } from "@/components/how-it-works/HowItWorksSteps";
import {
  ARTISAN_STEPS,
  CLIENT_STEPS,
  HEADER_STATS,
  type Audience,
} from "@/components/how-it-works/howItWorksData";
import { SectionTag } from "@/components/landing/SectionTag";
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
    color: "green" as const,
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
    color: "orange" as const,
  },
  {
    icon: "Headphones",
    title: "Support 7j/7",
    desc: "Notre équipe est disponible par WhatsApp et email pour tout litige ou problème.",
    color: "navy" as const,
  },
  {
    icon: "RefreshCw",
    title: "Remboursement garanti",
    desc: "Si vous n'êtes pas satisfait du travail effectué, nous vous remboursons ou trouvons un autre artisan.",
    color: "green" as const,
  },
];

function iconColorClass(color: "green" | "navy" | "orange") {
  if (color === "green") return "text-green";
  if (color === "navy") return "text-navy";
  return "text-orange";
}

function iconBgClass(color: "green" | "navy" | "orange") {
  if (color === "green") return "bg-green/10";
  if (color === "navy") return "bg-navy/[0.07]";
  return "bg-orange/10";
}

export function HowItWorksPage() {
  const [audience, setAudience] = useState<Audience>("client");
  const steps = audience === "client" ? CLIENT_STEPS : ARTISAN_STEPS;

  return (
    <>
      <section className="border-b border-dep-border bg-cream pb-16 pt-8 text-center md:pt-12">
        <div className="container mx-auto px-4">
          <SectionTag>Comment ça marche</SectionTag>

          <h1 className="mx-auto mb-4 mt-4 max-w-[600px] font-syne text-[38px] font-extrabold leading-[1.05] tracking-[-2px] text-navy md:text-[52px]">
            Simple, rapide,
            <br />
            <span className="text-orange">transparent</span>
          </h1>

          <p className="mx-auto mb-8 max-w-[520px] text-[17px] font-light leading-[1.7] text-dep-gray md:text-[18px]">
            De la demande à l&apos;intervention, DEPANNI.ma connecte les citoyens d&apos;El Jadida avec des
            artisans vérifiés en quelques minutes.
          </p>

          <div className="mx-auto inline-flex max-w-full flex-wrap items-center justify-center gap-4 rounded-2xl border border-dep-border bg-white px-4 py-4 shadow-sm sm:gap-6 sm:px-8 md:flex-nowrap">
            {HEADER_STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && <div className="hidden h-10 w-px bg-dep-border sm:block" />}
                <div className="min-w-[72px] text-center">
                  <div className="font-syne text-[20px] font-extrabold leading-none text-orange sm:text-[22px]">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] text-dep-gray sm:text-[11px]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex justify-center bg-[#EDE8DF] py-10">
        <div className="flex gap-1 rounded-2xl border border-dep-border bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setAudience("client")}
            className={cn(
              "rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-all sm:px-6",
              audience === "client"
                ? "bg-navy text-white shadow-sm"
                : "text-dep-gray hover:text-navy",
            )}
          >
            👤 Je cherche un artisan
          </button>
          <button
            type="button"
            onClick={() => setAudience("artisan")}
            className={cn(
              "rounded-xl px-5 py-2.5 text-[14px] font-semibold transition-all sm:px-6",
              audience === "artisan"
                ? "bg-orange text-white shadow-sm"
                : "text-dep-gray hover:text-navy",
            )}
          >
            🔧 Je suis artisan
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={audience}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          <HowItWorksSteps steps={steps} />
        </motion.div>
      </AnimatePresence>

      <section className="border-y border-dep-border bg-white py-16">
        <div className="container mx-auto max-w-[900px] px-6">
          <div className="mb-10 text-center">
            <SectionTag>Nos garanties</SectionTag>
            <h2 className="mt-4 font-syne text-[32px] font-extrabold tracking-[-1px] text-navy md:text-[36px]">
              Vous êtes protégé à chaque étape
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {GUARANTEES.map((g, i) => {
              const Icon = GUARANTEE_ICONS[g.icon] ?? Shield;
              return (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-dep-border bg-cream p-6"
                >
                  <div
                    className={cn(
                      "mb-4 flex h-10 w-10 items-center justify-center rounded-xl",
                      iconBgClass(g.color),
                    )}
                  >
                    <Icon size={18} className={iconColorClass(g.color)} />
                  </div>
                  <h3 className="mb-2 font-syne text-[16px] font-bold text-navy">{g.title}</h3>
                  <p className="text-[13px] leading-[1.6] text-dep-gray">{g.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorksFaq />

      <section className="relative overflow-hidden bg-orange py-20 text-center">
        <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-[400px] w-[400px] rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute bottom-[-60px] left-[-60px] h-[300px] w-[300px] rounded-full bg-black/[0.06]" />

        <div className="container relative z-10 mx-auto px-4">
          <h2 className="mb-4 font-syne text-[36px] font-extrabold leading-[1.05] tracking-[-2px] text-white md:text-[48px]">
            Prêt à essayer ?
          </h2>
          <p className="mx-auto mb-8 max-w-[400px] text-[17px] font-light text-white/80">
            Votre premier artisan à El Jadida, en moins de 10 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={AUTH_ROUTES.newRequest}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-orange transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              🔧 Faire une demande
            </Link>
            <Link
              href={AUTH_ROUTES.artisanRegister}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/50 px-8 py-4 text-[15px] font-medium text-white transition-all hover:border-white hover:bg-white/[0.08]"
            >
              Devenir artisan →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
