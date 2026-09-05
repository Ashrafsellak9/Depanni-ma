"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { CheckMark } from "@/components/landing/ui/CheckMark";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { EarningsCalculator } from "@/components/sections/earnings-calculator";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";

const BENEFITS = [
  "Inscription gratuite en 5 minutes",
  "Demandes géolocalisées près de vous",
  "Paiements sécurisés chaque semaine",
  "Badge vérifié après validation KYC",
];

export function ArtisanSection() {
  const reduced = useReducedMotion();

  return (
    <section id="artisans" className="bg-paper-2 py-24 md:py-32">
      <div className="landing-container grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}
          className="lg:col-span-5"
        >
          <motion.div variants={fadeInUp} className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-rust">Pour les artisans</span>
            <span className="h-px w-8 bg-rust/40" aria-hidden />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <DisplayTitle as="h2" size="display-2">
              Développez votre activité à El <Accent>Jadida</Accent>
            </DisplayTitle>
          </motion.div>
          <motion.p variants={fadeInUp} className="mt-4 max-w-lg text-base text-ink/70">
            Combien pourriez-vous gagner&nbsp;? Ajustez le calculateur ci-contre selon votre métier
            et vos disponibilités. Les chiffres sont réels&nbsp;: ils sont calculés à partir des
            revenus moyens de nos artisans à El Jadida.
          </motion.p>
          <motion.ul variants={fadeInUp} className="mt-8 space-y-4">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink">
                <CheckMark className="mt-0.5 h-5 w-5 shrink-0 text-rust" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div
            variants={fadeInUp}
            className="mt-8 rounded-2xl border border-line bg-paper p-6"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-avatar-3">
                <span className="font-display font-semibold text-ink">Y</span>
              </div>
              <div>
                <div className="text-sm font-medium text-ink">Youssef A.</div>
                <div className="text-xs text-ink/60">Électricien · Sur DEPANNI depuis 14 mois</div>
              </div>
            </div>
            <p className="font-display text-sm italic leading-relaxed text-ink/85">
              « J&apos;ai fait × 2,3 mon chiffre d&apos;affaires en un an. Le calculateur ci-contre
              m&apos;a convaincu de tester, la réalité a dépassé. »
            </p>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-6 text-sm"
          >
            <span className="text-ink/60">Déjà artisan&nbsp;?</span>
            <Link
              href={AUTH_ROUTES.artisanLogin}
              className="group inline-flex items-center gap-1 font-medium text-rust hover:text-rust-deep"
            >
              Connectez-vous
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="text-ink/30">·</span>
            <Link
              href="/comment-ca-marche#parcours"
              className="text-ink/60 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-rust"
            >
              Comment ça fonctionne pour les artisans
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.55 }}
          className="lg:col-span-7"
        >
          <EarningsCalculator />
        </motion.div>
      </div>
    </section>
  );
}
