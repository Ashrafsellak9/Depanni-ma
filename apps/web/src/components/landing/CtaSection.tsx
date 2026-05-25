"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AUTH_ROUTES } from "@/lib/auth";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";

export function CtaSection() {
  return (
    <section id="cta" className="relative overflow-hidden bg-orange py-24 md:py-28">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-white/10" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="container relative mx-auto px-4 text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="font-syne text-[36px] font-extrabold leading-tight tracking-tight2 text-white md:text-[52px]"
        >
          Prêt à résoudre votre problème ?
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-4 max-w-xl text-lg font-light text-white/85"
        >
          Rejoignez plus de 1 200 foyers à El Jadida qui font confiance à DEPANNI pour leurs
          urgences du quotidien.
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={AUTH_ROUTES.newRequest}
            className="inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-orange transition-colors hover:bg-cream"
          >
            🔧 Trouver un artisan
          </Link>
          <Link
            href="#el-jadida"
            className="inline-flex rounded-full border-2 border-white px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            📱 Télécharger l&apos;app
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
