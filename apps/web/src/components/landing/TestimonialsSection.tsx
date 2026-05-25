"use client";

import { motion } from "framer-motion";

import { SectionTag } from "@/components/landing/SectionTag";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";

const TESTIMONIALS = [
  {
    quote:
      "Fuite d'eau un dimanche soir — trois offres en 10 minutes, plombier arrivé en 25 min. Impeccable.",
    name: "Sanae M.",
    role: "Citoyenne · Hay Salam",
    initials: "SM",
    gradient: "from-navy to-navy-2",
  },
  {
    quote:
      "DEPANNI m'a apporté 40 missions ce mois-ci. Paiements clairs, zéro paperasse.",
    name: "Khalid A.",
    role: "Plombier certifié",
    initials: "KA",
    gradient: "from-orange to-orange-2",
  },
  {
    quote:
      "Le suivi GPS et le chat rassurent toute la famille. On sait exactement quand l'artisan arrive.",
    name: "Youssef B.",
    role: "Citoyen · Centre-ville",
    initials: "YB",
    gradient: "from-green to-emerald-600",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-cream py-24 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <SectionTag>Témoignages</SectionTag>
          <h2 className="mt-4 font-syne text-[32px] font-extrabold tracking-tight2 text-navy md:text-[44px]">
            Ils nous font confiance
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.article
              key={t.name}
              variants={fadeInUp}
              className="flex flex-col rounded-[20px] border border-dep-border bg-white p-8"
            >
              <p className="text-orange">★★★★★</p>
              <blockquote className="mt-4 flex-1 text-base italic leading-relaxed text-navy/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-dep-border pt-6">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${t.gradient}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-navy">{t.name}</p>
                  <p className="text-sm text-dep-gray">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
