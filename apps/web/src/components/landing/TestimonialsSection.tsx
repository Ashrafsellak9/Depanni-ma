"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionTag } from "@/components/landing/SectionTag";
import { InitialAvatar } from "@/components/landing/ui/InitialAvatar";
import { StarRow } from "@/components/landing/ui/StarRow";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { Accent, DisplayTitle } from "@/components/ui/display-title";

const TESTIMONIALS = [
  {
    quote:
      "Fuite d'eau un dimanche soir, j'ai décrit le problème en deux minutes. Trois offres reçues en moins de 10 minutes et le plombier est arrivé en 25 minutes. Travail propre et tarif annoncé respecté.",
    name: "Sanae M.",
    role: "Citoyenne · Hay Salam",
    initials: "SM",
    service: "Plomberie",
    date: "il y a 2 semaines",
    offset: false,
  },
  {
    quote:
      "Panne de courant générale un jeudi matin. L'électricien a accepté mon offre en 5 minutes et tout était réparé avant midi. Le paiement sécurisé après validation, c'est vraiment rassurant.",
    name: "Khalid A.",
    role: "Citoyen · Quartier Saada",
    initials: "KA",
    service: "Électricité",
    date: "il y a 1 mois",
    offset: true,
  },
  {
    quote:
      "Porte claquée avec les clés à l'intérieur, le serrurier est intervenu en moins de 20 minutes. Le suivi GPS et le chat rassurent toute la famille : on sait exactement quand l'artisan arrive.",
    name: "Youssef B.",
    role: "Citoyen · Centre-ville",
    initials: "YB",
    service: "Serrurerie",
    date: "il y a 3 semaines",
    offset: false,
  },
];

export function TestimonialsSection() {
  const reduced = useReducedMotion();

  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="landing-container">
        <div className="mb-14 text-center">
          <SectionTag>Témoignages</SectionTag>
          <DisplayTitle as="h2" size="display-2" className="mt-4">
            Ils nous font <Accent>confiance</Accent>
          </DisplayTitle>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.12 } } }}
          className="grid items-start gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeInUp}
              className={`relative overflow-hidden rounded-2xl border border-line/60 bg-paper p-8 shadow-card ${
                t.offset ? "md:mt-6" : ""
              }`}
            >
              <span
                className="pointer-events-none absolute right-4 top-2 font-display text-display-2 text-rust/20"
                aria-hidden
              >
                «
              </span>
              <div className="relative flex items-center justify-between">
                <StarRow />
                <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-medium text-ink">
                  {t.service}
                </span>
              </div>
              <blockquote className="relative mt-4 flex-1 font-display text-lg italic leading-relaxed text-ink/85">
                {t.quote}
              </blockquote>
              <div className="relative mt-6 flex items-center gap-3 border-t border-line/60 pt-6">
                <InitialAvatar initials={t.initials} className="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-ink/60">{t.role}</p>
                </div>
                <p className="shrink-0 text-xs text-ink/50">{t.date}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6"
        >
          <p className="text-sm text-ink/60">
            <span className="font-mono tabular-nums text-ink">4,8/5</span>
            <span className="text-ink/60"> sur +300 avis</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
