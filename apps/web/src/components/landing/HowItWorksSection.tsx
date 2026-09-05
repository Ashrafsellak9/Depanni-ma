"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bell, MapPin, Search, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { Accent, DisplayTitle } from "@/components/ui/display-title";

const STEPS: { number: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    number: "01",
    icon: Search,
    title: "Décrivez votre besoin",
    description: "Catégorie, photos, adresse et urgence — en moins de 2 minutes.",
  },
  {
    number: "02",
    icon: Bell,
    title: "Recevez des offres",
    description: "Les artisans proches vous envoient prix et délai en temps réel.",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Choisissez & suivez",
    description: "Chat, GPS et notifications jusqu'à l'arrivée sur place.",
  },
  {
    number: "04",
    icon: ShieldCheck,
    title: "Payez en sécurité",
    description: "Paiement sécurisé après validation du travail terminé.",
  },
];

export function HowItWorksSection() {
  const reduced = useReducedMotion();

  return (
    <section id="how-it-works" className="grain-ink relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div className="landing-container relative z-10">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/50">
            Comment ça marche
          </p>
          <DisplayTitle as="h2" size="display-2" className="!text-white">
            Simple comme <Accent>1, 2, 3, 4</Accent>
          </DisplayTitle>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.12 } } }}
          className="relative grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6"
        >
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px border-t border-dashed border-white/15 md:block"
            aria-hidden
          />

          {STEPS.map((step) => (
            <motion.div key={step.number} variants={fadeInUp} className="relative text-center">
              <div className="relative mb-6 inline-flex">
                <div className="relative z-10 flex size-16 items-center justify-center rounded-full border border-white/10 bg-ink-soft">
                  <step.icon className="size-6 text-rust" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <div className="absolute -right-3 -top-3 z-20 flex size-7 items-center justify-center rounded-full bg-rust font-mono text-xs font-semibold text-white">
                  {step.number}
                </div>
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mx-auto max-w-[24ch] text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link
            href="/comment-ca-marche"
            className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-rust"
          >
            <span>Voir le processus détaillé</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
