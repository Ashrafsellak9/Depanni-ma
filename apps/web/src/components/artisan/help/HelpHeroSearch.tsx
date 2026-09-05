"use client";

import { Search, X } from "lucide-react";

import { POPULAR_SEARCHES } from "@/components/artisan/help/artisanHelpData";
import { DisplayTitle } from "@/components/ui/display-title";

type HelpHeroSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function HelpHeroSearch({ search, onSearchChange }: HelpHeroSearchProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#0F1E35] p-8">
      <div className="pointer-events-none absolute right-[-60px] top-[-60px] h-[300px] w-[300px] rounded-full border border-[rgba(255,255,255,0.04)]" />
      <div className="pointer-events-none absolute bottom-[-40px] left-[30%] h-[200px] w-[200px] rounded-full bg-[rgba(240,90,26,0.05)]" />

      <div className="relative z-10 mx-auto max-w-[560px] text-center">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-[rgba(255,255,255,0.4)]">
          Centre d&apos;aide
        </div>
        <DisplayTitle as="h1" size="display-3" className="mb-2 text-white">
          Comment pouvons-nous vous aider&nbsp;?
        </DisplayTitle>
        <p className="mb-5 text-[13px] text-[rgba(255,255,255,0.5)]">
          Recherchez dans nos guides, FAQ et tutoriels
        </p>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ex: comment être payé, modifier mon profil..."
            className="w-full rounded-xl border border-[#E5E0D8] bg-white py-3.5 pl-11 pr-4 font-sans text-[14px] text-[#0F1E35] outline-none placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[rgba(240,90,26,0.2)]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F1E35]"
              aria-label="Effacer la recherche"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onSearchChange(t)}
              className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[11px] text-[rgba(255,255,255,0.6)] transition-colors hover:bg-[rgba(255,255,255,0.12)]"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
