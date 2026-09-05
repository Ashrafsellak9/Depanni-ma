"use client";

import { motion, useReducedMotion } from "framer-motion";

import { TrustBadges } from "@/components/landing/TrustBadges";
import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { fadeInUp, viewportOnce } from "@/components/landing/motion";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AppStoreBadge, GooglePlayBadge } from "@/components/ui/store-badges";

type CtaSectionProps = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  showTrust?: boolean;
};

export function CtaSection({ title, subtitle, actions, showTrust = false }: CtaSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      id="cta"
      className="relative scroll-mt-28 overflow-hidden bg-rust pt-28 pb-24 text-white md:pt-36 md:pb-32"
    >
      <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/5 blur-3xl" />
      <svg
        viewBox="0 0 400 280"
        className="pointer-events-none absolute -bottom-16 -left-20 h-72 w-96 text-white/10"
        aria-hidden
      >
        <path
          d="M28 186C-8 112 62 18 168 32c92 12 148 86 138 154-12 78-96 118-176 96C52 260 48 230 28 186Z"
          fill="currentColor"
        />
      </svg>
      <svg
        viewBox="0 0 360 260"
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-80 text-white/10"
        aria-hidden
      >
        <path
          d="M320 48c42 54-8 128-78 154-74 28-168-8-176-86C58 44 148-8 226 12c48 12 76 12 94 36Z"
          fill="currentColor"
        />
      </svg>

      <div className="landing-container relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}
          className="mx-auto max-w-3xl overflow-visible text-center"
        >
          {showTrust ? (
            <motion.div variants={fadeInUp} className="mb-8">
              <TrustBadges compact onDark />
            </motion.div>
          ) : null}

          <motion.div variants={fadeInUp} className="overflow-visible">
            {title ?? (
              <DisplayTitle
                as="h2"
                size="display-1"
                className="overflow-visible pb-2 !text-white !leading-[1.2]"
              >
                Prêt à résoudre votre{" "}
                <Accent className="italic !text-white/95">problème</Accent> ?
              </DisplayTitle>
            )}
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-white/85 md:text-xl"
          >
            {subtitle ??
              "Rejoignez plus de 1 200 foyers à El Jadida qui font confiance à DEPANNI pour leurs urgences du quotidien."}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-12">
            {actions ? (
              <div className="flex flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap">
                {actions}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <RequestCta
                  variant="white"
                  event="cta-find-artisan"
                  className="px-8 py-4 text-lg shadow-none hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  Trouver un artisan
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </RequestCta>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="h-px w-12 bg-white/30" />
                  <span className="text-xs uppercase tracking-widest">ou téléchargez l&apos;app</span>
                  <div className="h-px w-12 bg-white/30" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AppStoreBadge variant="light" />
                  <GooglePlayBadge variant="light" />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
