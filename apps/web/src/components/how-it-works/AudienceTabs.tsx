"use client";

import { useCallback, useEffect, useRef } from "react";
import { User, Wrench } from "lucide-react";

import type { Audience } from "@/components/how-it-works/howItWorksData";
import { cn } from "@/lib/utils";

const TABS: { id: Audience; label: string; Icon: typeof User }[] = [
  { id: "client", label: "Je cherche un artisan", Icon: User },
  { id: "artisan", label: "Je suis artisan", Icon: Wrench },
];

type AudienceTabsProps = {
  audience: Audience;
  onChange: (audience: Audience) => void;
};

export function AudienceTabs({ audience, onChange }: AudienceTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectTab = useCallback(
    (next: Audience, focus = false) => {
      onChange(next);
      const url = new URL(window.location.href);
      url.searchParams.set("tab", next);
      url.hash = "";
      window.history.replaceState(null, "", url.toString());

      if (focus) {
        const idx = TABS.findIndex((t) => t.id === next);
        tabRefs.current[idx]?.focus();
      }

      containerRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
    },
    [onChange],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace("#", "");
    if (params.get("tab") === "artisan" || hash === "artisan") {
      onChange("artisan");
    }
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = e.key === "ArrowRight" ? (index + 1) % TABS.length : (index - 1 + TABS.length) % TABS.length;
      selectTab(TABS[next]!.id, true);
    }
    if (e.key === "Home") {
      e.preventDefault();
      selectTab("client", true);
    }
    if (e.key === "End") {
      e.preventDefault();
      selectTab("artisan", true);
    }
  };

  return (
    <div ref={containerRef} id="parcours" className="scroll-mt-28 bg-paper">
      <div className="mx-auto mb-16 mt-16 max-w-2xl px-6 text-center md:mt-24">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/50">Votre profil</p>
        <h2 className="mb-8 font-display text-2xl font-semibold text-ink md:text-3xl">
          Vous êtes plutôt&nbsp;?
        </h2>

        <div
          role="tablist"
          aria-label="Parcours citoyen ou artisan"
          className="inline-flex max-w-full flex-col items-stretch gap-1 rounded-3xl border border-line bg-paper-2 p-1.5 sm:flex-row sm:items-center sm:rounded-full"
        >
          {TABS.map((tab, index) => {
            const selected = audience === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  "inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5 text-base font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2",
                  selected
                    ? tab.id === "client"
                      ? "bg-ink text-white shadow-lg"
                      : "bg-rust text-white shadow-lg"
                    : "text-ink/60 hover:text-ink",
                )}
              >
                <tab.Icon className="size-4" strokeWidth={1.75} aria-hidden />
                {tab.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-ink/50">
          Le processus change selon votre profil. Choisissez ci-dessus pour voir les étapes qui vous
          concernent.
        </p>
      </div>
    </div>
  );
}
