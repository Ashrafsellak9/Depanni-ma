"use client";

import { motion } from "framer-motion";

import { SectionTag } from "@/components/landing/SectionTag";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";

const STEPS = [
  {
    n: "01",
    title: "Décrivez votre besoin",
    desc: "Catégorie, photos, adresse et urgence — en moins de 2 minutes.",
  },
  {
    n: "02",
    title: "Recevez des offres",
    desc: "Les artisans proches vous envoient prix et délai en temps réel.",
  },
  {
    n: "03",
    title: "Choisissez & suivez",
    desc: "Chat, GPS et notifications jusqu'à l'arrivée sur place.",
  },
  {
    n: "04",
    title: "Payez en sécurité",
    desc: "Paiement sécurisé après validation du travail terminé.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-navy py-24 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <SectionTag className="bg-white/10 text-orange">Comment ça marche</SectionTag>
          <h2 className="mt-4 font-syne text-[32px] font-extrabold tracking-tight2 text-white md:text-[44px]">
            Simple comme 1, 2, 3, 4
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="relative grid gap-10 md:grid-cols-4 md:gap-6"
        >
          <div
            className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px border-t border-dashed border-white/25 md:block"
            aria-hidden
          />

          {STEPS.map((step) => (
            <motion.div key={step.n} variants={fadeInUp} className="relative text-center md:text-left">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 md:mx-0">
                <span className="font-syne text-[28px] font-extrabold text-orange">{step.n}</span>
              </div>
              <h3 className="font-syne text-lg font-extrabold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
