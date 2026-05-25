"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AUTH_ROUTES } from "@/lib/auth";
import { fadeInRight, fadeInUp, staggerContainer, viewportOnce } from "@/components/landing/motion";
import { PhoneMockup } from "@/components/landing/PhoneMockup";

const TRUST_AVATARS = [
  { initials: "SM", bg: "from-navy to-navy-2" },
  { initials: "FK", bg: "from-orange to-orange-2" },
  { initials: "LB", bg: "from-green to-emerald-600" },
  { initials: "YA", bg: "from-violet-600 to-indigo-700" },
];

export function HeroSection() {
  return (
    <section
      id="el-jadida"
      className="relative overflow-x-hidden bg-cream pb-16 pt-28 md:pb-24 md:pt-36 lg:pt-40"
    >
      <div className="pointer-events-none absolute right-[-150px] top-[-150px] h-[600px] w-[600px] bg-[radial-gradient(circle,rgba(240,90,26,0.07),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-0 left-[-150px] h-[600px] w-[600px] bg-[radial-gradient(circle,rgba(15,30,53,0.05),transparent_60%)]" />

      <div className="container relative mx-auto grid items-center gap-12 px-4 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange/20 bg-white px-4 py-2 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
            </span>
            <span className="text-sm font-medium text-navy">Disponible à El Jadida</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-syne text-[38px] font-extrabold leading-[1.05] tracking-tight3 text-navy md:text-[52px] lg:text-[58px]"
          >
            L&apos;artisan qu&apos;il vous faut,
            <br />
            <em className="not-italic text-orange">en quelques minutes</em>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-lg text-lg font-light text-dep-gray md:text-[18px]"
          >
            Plomberie, électricité, serrurerie — publiez votre demande et recevez des offres
            d&apos;artisans vérifiés près de chez vous à El Jadida.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={AUTH_ROUTES.newRequest}
              className="inline-flex items-center justify-center rounded-full bg-orange px-8 py-4 text-base font-medium text-white transition-colors hover:bg-orange-2"
            >
              Faire une demande →
            </Link>
            <Link
              href="#cta"
              className="inline-flex items-center justify-center rounded-full border-2 border-navy/15 bg-transparent px-8 py-4 text-base font-medium text-navy transition-colors hover:border-navy/30 hover:bg-white"
            >
              📱 Télécharger l&apos;app
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {TRUST_AVATARS.map((a) => (
                <div
                  key={a.initials}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream bg-gradient-to-br text-xs font-bold text-white ${a.bg}`}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-dep-gray">
              <span className="font-semibold text-navy">+1 200</span> clients satisfaits à El Jadida
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center overflow-visible lg:justify-end lg:pr-4"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}
