"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { animate, useMotionValue, useReducedMotion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ArrowRight } from "@/components/landing/ui/ArrowRight";
import { LandingButton } from "@/components/landing/ui/LandingButton";
import { Accent, DisplayTitle } from "@/components/ui/display-title";
import { AUTH_ROUTES } from "@/lib/auth";
import { calculateMonthlyEarnings, type Trade } from "@/lib/earnings-calculator";
import { cn } from "@/lib/utils";

const TRADES: { value: Trade; label: string }[] = [
  { value: "plomberie", label: "Plomberie" },
  { value: "electricite", label: "Électricité" },
  { value: "serrurerie", label: "Serrurerie" },
  { value: "mecanique", label: "Mécanique auto" },
  { value: "peinture", label: "Peinture" },
  { value: "menage", label: "Ménage" },
  { value: "electromenager", label: "Électroménager" },
];

const NEIGHBORHOODS = [
  "Centre-ville",
  "Hay Salam",
  "Hay El Matar",
  "Sidi Bouzid",
  "Plateau",
  "El Jadida Beach",
  "Sidi Moussa",
  "Boulevard Mohammed V",
  "Hay Essalam",
  "Route de Casablanca",
];

function formatMad(value: number) {
  return new Intl.NumberFormat("fr-FR", { useGrouping: true, maximumFractionDigits: 0 })
    .format(value)
    .replace(/[.,\s]/g, "\u202F");
}

function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [motionValue, reduced, value]);

  return <span className="num tabular-nums">{formatMad(display)}</span>;
}

export function EarningsCalculator() {
  const [trade, setTrade] = useState<Trade>("plomberie");
  const [hours, setHours] = useState(25);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([
    "Centre-ville",
    "Hay Salam",
  ]);
  const [open, setOpen] = useState(false);

  const result = useMemo(
    () => calculateMonthlyEarnings(trade, hours, selectedNeighborhoods),
    [hours, selectedNeighborhoods, trade],
  );

  const tradeLabel = TRADES.find((t) => t.value === trade)?.label ?? "Plomberie";

  function toggleNeighborhood(name: string) {
    setSelectedNeighborhoods((current) =>
      current.includes(name) ? current.filter((n) => n !== name) : [...current, name],
    );
  }

  return (
    <div className="grain-ink relative min-h-[520px] overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-10">
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-16 -top-10 hidden h-[420px] w-[420px] text-rust/8 md:block"
        aria-hidden
      >
        <path
          d="M86 248C42 168 78 64 186 42c98-20 176 48 214 128 42 88 18 186-62 238-86 56-198 38-252-28C42 318 114 302 86 248Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10">
        {process.env.NODE_ENV === "development" ? (
          <div className="mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-200">
            Attention : les moyennes métier / quartier sont des placeholders. À remplacer par les
            données réelles El Jadida avant production.
          </div>
        ) : null}
        <p className="font-mono text-xs uppercase tracking-widest text-rust">Calculateur</p>
        <DisplayTitle as="h3" size="sm" className="mt-3 text-2xl font-semibold text-white md:text-3xl">
          Simulez vos revenus <Accent>mensuels</Accent>
        </DisplayTitle>

        <hr className="my-6 border-white/8" />

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Votre métier</p>
            <DropdownMenu.Root open={open} onOpenChange={setOpen}>
              <DropdownMenu.Trigger
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-ink-soft px-4 py-3 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-rust"
                aria-label="Choisir un métier"
              >
                <span>{tradeLabel}</span>
                <ChevronDown
                  className={cn("h-4 w-4 text-rust transition-transform duration-200", open && "rotate-180")}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={6}
                  className="z-[80] min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden rounded-xl border border-white/10 bg-ink-soft p-1 shadow-card"
                >
                  {TRADES.map((item) => (
                    <DropdownMenu.Item
                      key={item.value}
                      onSelect={() => setTrade(item.value)}
                      className={cn(
                        "cursor-pointer rounded-lg px-4 py-2.5 text-sm text-white outline-none hover:bg-rust/10",
                        item.value === trade && "bg-rust/10 text-rust",
                      )}
                    >
                      {item.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <p className="text-xs uppercase tracking-widest text-white/60">Heures disponibles / semaine</p>
              <span className="font-mono text-lg text-rust">
                <span className="num">{hours}</span>h
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              aria-label="Heures disponibles par semaine"
              className="mt-3 w-full cursor-pointer appearance-none rounded-full bg-white/10 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-rust [&::-moz-range-thumb]:shadow-lg [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rust [&::-webkit-slider-thumb]:shadow-lg"
            />
            <div className="mt-2 flex justify-between text-[10px] text-white/60">
              <span>5h</span>
              <span>15h</span>
              <span>30h</span>
              <span>45h</span>
              <span>60h</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="text-xs uppercase tracking-widest text-white/60">Vos quartiers d&apos;intervention</p>
              <span className="text-xs text-white/60">
                {selectedNeighborhoods.length}/10 sélectionnés
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {NEIGHBORHOODS.map((name) => {
                const selected = selectedNeighborhoods.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleNeighborhood(name)}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      selected
                        ? "border-rust bg-rust/15 text-rust"
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white/80",
                    )}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Revenus estimés</p>
            <div className="my-4 font-mono text-6xl font-medium leading-none tracking-[-0.04em] text-white md:text-7xl">
              <AnimatedNumber value={result.netRevenue} />
              <span className="ml-3 text-rust">MAD</span>
            </div>
            <p className="text-sm text-white/60">/ mois, après commission</p>

            <div className="space-y-3 border-t border-white/8 py-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/60">Missions estimées</span>
                <span className="font-mono text-base tabular-nums text-white">
                  ~ {result.missionsPerMonth} / mois
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/60">Prix moyen par mission</span>
                <span className="font-mono text-base tabular-nums text-white">
                  {formatMad(result.avgPrice)} MAD
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/60">Commission plateforme (15%)</span>
                <span className="font-mono text-base tabular-nums text-rust">
                  − {formatMad(result.commission)} MAD
                </span>
              </div>
            </div>

            <LandingButton
              href={AUTH_ROUTES.artisanRegister}
              event="calculator-become-artisan"
              className="mt-6 w-full px-6 py-4 text-lg"
            >
              Devenir artisan
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LandingButton>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/60">
              <Info className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
              Estimation basée sur les données réelles de nos artisans à El Jadida (moyenne des 6
              derniers mois). Vos revenus réels dépendent de votre activité, votre disponibilité et la
              qualité de votre travail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
