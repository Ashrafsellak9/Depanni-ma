"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CtaSection } from "@/components/landing/CtaSection";
import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { FaqAccordion } from "@/components/landing/ui/FaqAccordion";
import { LandingButton } from "@/components/landing/ui/LandingButton";
import { RequestCta } from "@/components/landing/ui/RequestCta";
import { SectionTag } from "@/components/landing/SectionTag";
import { TarifsCommission } from "@/components/pricing/TarifsCommission";
import { TarifsCompare } from "@/components/pricing/TarifsCompare";
import { TarifsArtisanPlans, TarifsClientView } from "@/components/pricing/TarifsPlans";
import { TARIFS_FAQ, type TarifsAudience } from "@/components/pricing/tarifsData";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";
import { cn } from "@/lib/utils";

const TABS: { id: TarifsAudience; label: string }[] = [
  { id: "client", label: "Je suis client" },
  { id: "artisan", label: "Je suis artisan" },
];

export function TarifsPage() {
  const searchParams = useSearchParams();
  const [audience, setAudience] = useState<TarifsAudience>("client");

  useEffect(() => {
    if (searchParams.get("tab") === "artisan") setAudience("artisan");
  }, [searchParams]);

  const select = (next: TarifsAudience) => {
    setAudience(next);
    const url = new URL(window.location.href);
    if (next === "artisan") url.searchParams.set("tab", "artisan");
    else url.searchParams.delete("tab");
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <>
      <section className="bg-paper pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="landing-container text-center">
          <SectionTag>Tarifs</SectionTag>
          <DisplayTitle as="h1" size="display-1" className="mx-auto mt-5 max-w-[18ch]">
            Tarifs <Accent>transparents</Accent>, pensés pour vous.
          </DisplayTitle>
          <p className="mx-auto mt-5 max-w-[58ch] font-sans text-lg text-ink/70">
            Les clients ne paient jamais l&apos;utilisation de la plateforme. Les artisans
            choisissent le plan qui correspond à leur volume d&apos;activité, sans engagement.
          </p>

          <div
            role="tablist"
            aria-label="Tarifs client ou artisan"
            className="mx-auto mt-10 inline-flex rounded-full bg-paper-2 p-1.5"
          >
            {TABS.map((tab) => {
              const selected = audience === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tarifs-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`tarifs-panel-${tab.id}`}
                  onClick={() => select(tab.id)}
                  className={cn(
                    "min-h-[44px] rounded-full px-5 py-2 font-sans text-sm font-medium transition-colors duration-200",
                    selected ? "bg-ink text-white shadow-sm" : "text-ink/60 hover:text-ink",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        role="tabpanel"
        id={`tarifs-panel-${audience}`}
        aria-labelledby={`tarifs-tab-${audience}`}
        className="bg-paper pb-20"
      >
        <div className={cn("landing-container", audience === "artisan" && "pt-8")}>
          {audience === "client" ? <TarifsClientView /> : <TarifsArtisanPlans />}
        </div>
      </section>

      {audience === "artisan" ? <TarifsCompare /> : null}

      <TarifsCommission />

      <section className="bg-paper py-20 md:py-28" aria-labelledby="tarifs-faq-title">
        <div className="landing-container">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-24">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/50">FAQ</p>
              <DisplayTitle as="h2" size="display-3" id="tarifs-faq-title">
                Questions sur les <Accent>tarifs</Accent>.
              </DisplayTitle>
              <p className="mt-6 text-base leading-relaxed text-ink/70">
                Commissions, engagement, paiement. Tout est écrit noir sur blanc, rien n&apos;est
                caché.
              </p>
              <a
                href="mailto:contact@depanni.ma"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-rust hover:text-rust-deep"
              >
                Une autre question ?
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
            <div>
              <FaqAccordion items={TARIFS_FAQ} defaultOpen="changer" />
            </div>
          </div>
        </div>
      </section>

      <CtaSection
        showTrust={false}
        title={
          <DisplayTitle as="h2" size="display-1" className="overflow-visible !text-white !leading-[1.2]">
            Prêt à <Accent className="italic !text-white/95">rejoindre</Accent> DEPANNI&nbsp;?
          </DisplayTitle>
        }
        subtitle="Inscrivez-vous en 5 minutes. Les clients ne paient jamais la plateforme. Les artisans choisissent leur formule, sans engagement."
        actions={
          <>
            <LandingButton
              href={AUTH_ROUTES.artisanRegister}
              variant="white"
              event="tarifs-cta-artisan"
              className="min-h-[52px] px-8"
            >
              Devenir artisan
            </LandingButton>
            <RequestCta variant="whiteGhost" event="tarifs-cta-request" className="min-h-[52px] px-8">
              Faire une demande
            </RequestCta>
          </>
        }
      />
    </>
  );
}
