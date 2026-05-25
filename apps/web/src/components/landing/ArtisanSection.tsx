"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

import { SectionTag } from "@/components/landing/SectionTag";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { AUTH_ROUTES } from "@/lib/auth";

const BENEFITS = [
  "Inscription gratuite en 5 minutes",
  "Demandes géolocalisées près de vous",
  "Paiements sécurisés chaque semaine",
  "Badge vérifié après validation KYC",
];

export function ArtisanSection() {
  return (
    <section id="artisans" className="bg-cream-2 py-24 md:py-28">
      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeInUp}>
            <SectionTag>Pour les artisans</SectionTag>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 font-syne text-[32px] font-extrabold tracking-tight2 text-navy md:text-[44px]"
          >
            Développez votre activité à El Jadida
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 max-w-lg text-base font-light text-dep-gray">
            Rejoignez des centaines d&apos;artisans qui reçoivent des missions qualifiées, gèrent
            leurs offres depuis l&apos;app et encaissent en toute transparence.
          </motion.p>
          <motion.ul variants={fadeInUp} className="mt-8 space-y-4">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-navy">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div variants={fadeInUp} className="mt-10">
            <Link
              href={AUTH_ROUTES.artisanRegister}
              className="inline-flex rounded-full bg-orange px-8 py-4 text-base font-medium text-white transition-colors hover:bg-orange-2"
            >
              Devenir artisan →
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="col-span-2 rounded-[20px] bg-navy p-6 text-white md:p-8">
            <p className="text-sm text-white/50">Revenus moyens</p>
            <p className="mt-2 font-syne text-3xl font-extrabold md:text-4xl">
              +3 200 <span className="text-orange">MAD</span>
              <span className="text-lg font-medium text-white/70"> / mois</span>
            </p>
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-green/20 px-3 py-1 text-sm font-medium text-green">
              ↑ +18% ce trimestre
            </p>
          </div>
          <div className="rounded-[20px] border border-dep-border bg-white p-6">
            <p className="font-syne text-2xl font-extrabold text-navy">280+</p>
            <p className="mt-1 text-sm text-dep-gray">Artisans inscrits · Vérifiés ✓</p>
          </div>
          <div className="rounded-[20px] border border-dep-border bg-white p-6">
            <p className="font-syne text-2xl font-extrabold text-navy">
              4.8<span className="text-orange">★</span>
            </p>
            <p className="mt-1 text-sm text-dep-gray">Note moyenne · Top artisans</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
