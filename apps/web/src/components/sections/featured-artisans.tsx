"use client";

import { ArrowLeft, ArrowRight as ArrowRightIcon, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { FEATURED_ARTISANS, type FeaturedArtisan } from "@/lib/featured-artisans";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 280;
const GAP = 20;
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

function CarouselButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Précédent" : "Suivant"}
      className={cn(
        "flex size-11 items-center justify-center rounded-full border border-line bg-white transition-all",
        "hover:-translate-y-0.5 hover:border-rust hover:text-rust",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-line disabled:hover:text-inherit",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}

function ArtisanCard({ artisan }: { artisan: FeaturedArtisan }) {
  const name = `${artisan.firstName} ${artisan.lastInitial}`;
  const rating = artisan.rating.toFixed(1).replace(".", ",");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(11,27,43,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(11,27,43,0.12)]">
      <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-paper-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artisan.photoUrl}
          alt={`${name}, ${artisan.trade}`}
          className={cn(
            "artisan-photo absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            artisan.photoPosition ?? "object-center",
          )}
          loading="lazy"
          data-placeholder="true"
        />
        {artisan.isOnline ? (
          <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-ink">En ligne</span>
          </div>
        ) : null}
        <div className="group/badge absolute right-3 top-3 z-10">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 shadow-sm backdrop-blur-sm">
            <svg
              className="size-3 text-rust"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-widest text-ink">Vérifié</span>
          </div>
          <div className="pointer-events-none invisible absolute right-0 top-full z-20 mt-2 w-56 rounded-lg bg-ink p-3 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover/badge:visible group-hover/badge:opacity-100">
            <div className="mb-1 font-medium">Vérification complète</div>
            <div className="leading-relaxed text-white/70">
              Pièce d&apos;identité, patente, attestations professionnelles et entretien avec notre
              équipe.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight text-ink">{name}</h3>
        <div className="mt-1 text-sm text-ink/60">
          {artisan.trade} · {artisan.neighborhood}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <div className="flex gap-0.5" aria-hidden>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="size-3.5 fill-rust text-rust" />
            ))}
          </div>
          <span className="font-mono font-medium tabular-nums text-ink">{rating}</span>
          <span className="text-ink/40">·</span>
          <span className="font-mono tabular-nums text-ink/60">{artisan.interventions} avis</span>
        </div>
        <blockquote className="mt-4 line-clamp-2 font-display text-sm italic leading-relaxed text-ink/80">
          « {artisan.quote} »
        </blockquote>
        <Link
          href={`/artisans/${artisan.id}`}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-ink/60 transition-colors group-hover:text-rust"
        >
          <span className="border-b border-transparent transition-colors group-hover:border-rust">
            Voir le profil
          </span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

function ViewAllArtisansCard({ totalCount }: { totalCount: number }) {
  return (
    // TODO: Pointer vers /artisans quand la page catalogue existera.
    <Link
      href="#"
      className="group flex h-full min-h-[28rem] flex-col justify-between rounded-2xl bg-ink p-6 text-white transition-colors hover:bg-ink-soft"
    >
      <div>
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-rust">Notre réseau</div>
        <div className="font-display text-2xl font-semibold leading-tight">
          Découvrez nos {totalCount} artisans vérifiés
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-white/80 transition-colors group-hover:text-rust">
        <span>Explorer le réseau</span>
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function MobileScrollIndicator({
  scrollRef,
  count,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  count: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const updateIndex = () => {
      setActiveIndex(Math.round(el.scrollLeft / SCROLL_AMOUNT));
    };
    el.addEventListener("scroll", updateIndex, { passive: true });
    return () => el.removeEventListener("scroll", updateIndex);
  }, [scrollRef]);

  return (
    <div className="mt-6 flex justify-center gap-1.5 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i === activeIndex ? "w-6 bg-rust" : "w-1 bg-line",
          )}
        />
      ))}
    </div>
  );
}

export function FeaturedArtisans() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  function scrollByDir(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 8);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 8);
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const frame = window.requestAnimationFrame(updateScrollState);
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <section id="visages" className="bg-paper py-24 md:py-32" aria-labelledby="artisans-faces-title">
      <div className="landing-container mb-10">
        {process.env.NODE_ENV === "development" ? (
          <div className="mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-800">
            Attention : les photos et profils d&apos;artisans sont des placeholders. À remplacer par
            de vrais artisans avec consentement écrit avant production.
          </div>
        ) : null}

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/65">Notre réseau</p>
            <DisplayTitle as="h2" size="display-2" id="artisans-faces-title">
              Les visages de <Accent>DEPANNI</Accent>
            </DisplayTitle>
            <p className="mt-4 max-w-[52ch] text-lg text-ink/70">
              Identité vérifiée, patente contrôlée, entretien avec notre équipe. Chaque artisan est
              validé avant d&apos;accéder à la plateforme.
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <CarouselButton direction="prev" onClick={() => scrollByDir(-SCROLL_AMOUNT)} disabled={!canScrollPrev} />
            <CarouselButton direction="next" onClick={() => scrollByDir(SCROLL_AMOUNT)} disabled={!canScrollNext} />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-paper to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-paper to-transparent md:block" />
        <div
          ref={scrollRef}
          className="scrollbar-hide snap-x snap-mandatory scroll-px-6 scroll-smooth overflow-x-auto px-6 md:scroll-px-16 md:px-16"
        >
          <div className="flex gap-5 pb-2">
            {FEATURED_ARTISANS.map((artisan) => (
              <div key={artisan.id} className="w-[280px] shrink-0 snap-start">
                <ArtisanCard artisan={artisan} />
              </div>
            ))}
            <div className="w-[280px] shrink-0 snap-start">
              <ViewAllArtisansCard totalCount={224} />
            </div>
          </div>
        </div>
      </div>

      <MobileScrollIndicator scrollRef={scrollRef} count={FEATURED_ARTISANS.length + 1} />
    </section>
  );
}
