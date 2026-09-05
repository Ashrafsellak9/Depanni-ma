"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { InitialAvatar } from "@/components/landing/ui/InitialAvatar";
import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { LandingPill } from "@/components/landing/ui/LandingPill";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { Accent, DisplayTitle } from "@/components/ui/display-title";

const TRUST_AVATARS = ["SM", "FK", "LB", "YA"] as const;

export function HeroSection() {
  const reduced = useReducedMotion();
  const enter = reduced
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <section className="relative bg-paper pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="landing-container relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.div {...enter} transition={{ duration: 0.5 }}>
            <LandingPill>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-success" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Disponible à El Jadida
            </LandingPill>
          </motion.div>

          <motion.div {...enter} transition={{ duration: 0.55, delay: 0.06 }}>
            <DisplayTitle as="h1" size="display-1" className="mt-6">
              L&apos;artisan qu&apos;il vous <Accent>faut</Accent>,
              <br />
              <span className="lg:-indent-3">en quelques minutes</span>
            </DisplayTitle>
          </motion.div>

          <motion.p
            {...enter}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 max-w-[52ch] text-lg text-ink/70"
          >
            Décrivez votre panne, recevez jusqu&apos;à 3 offres d&apos;artisans vérifiés en moins
            de 8 minutes, et payez en toute sécurité. Disponible à El Jadida.
          </motion.p>

          <motion.div
            {...enter}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <RequestCta event="hero-request" className="min-h-[56px] px-8 text-base">
              Faire une demande
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </RequestCta>
            <Link
              href="#cta"
              data-event="hero-download"
              className="group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-px hover:border-ink/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.21 2.31-.9 3.57-.84 1.51.07 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.6 1.57-1.38 3.13-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.16 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Télécharger l&apos;app
            </Link>
          </motion.div>

          <motion.p
            {...enter}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mt-6 text-xs uppercase tracking-widest text-ink/70"
          >
            Gratuit pour les clients · Artisans vérifiés KYC · Paiement sécurisé
          </motion.p>

          <motion.div
            {...enter}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="mt-10 flex items-center gap-4"
          >
            <div className="flex">
              {TRUST_AVATARS.map((initials, i) => (
                <InitialAvatar
                  key={initials}
                  initials={initials}
                  className={`h-10 w-10 border-2 border-paper text-xs ${i > 0 ? "-ml-3" : ""}`}
                />
              ))}
            </div>
            <p className="text-sm text-ink/65">
              <span className="num font-mono tracking-[-0.02em] text-ink">+1&nbsp;200</span> clients à El
              Jadida
            </p>
          </motion.div>
        </div>

        <div className="overflow-visible lg:col-span-5 lg:col-start-8">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
