import { Droplets, KeyRound, Paintbrush, Sparkles, User, Wrench, Zap } from "lucide-react";

import { Accent, DisplayTitle } from "@/components/ui/display-title";

const CATEGORIES = [
  { label: "Plomberie", icon: Droplets, active: true },
  { label: "Électricité", icon: Zap, active: false },
  { label: "Serrurerie", icon: KeyRound, active: false },
  { label: "Mécanique", icon: Wrench, active: false },
  { label: "Peinture", icon: Paintbrush, active: false },
  { label: "Ménage", icon: Sparkles, active: false },
] as const;

export function AppHomeScreen() {
  return (
    <div className="flex h-full flex-col bg-paper px-5 pb-6 pt-12">
      <div className="flex items-center justify-between font-sans text-[10px] text-ink">
        <span className="num font-medium">09:41</span>
        <div className="flex items-center gap-1.5" aria-hidden>
          <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
            <path d="M1 8.5c2.4-2.6 5.6-4 7-4s4.6 1.4 7 4l-1.3 1.2C12.2 7.4 9.8 6.4 8 6.4S3.8 7.4 2.3 9.7L1 8.5Z" />
            <path d="M4.2 9.8C5.5 8.4 6.8 7.7 8 7.7s2.5.7 3.8 2.1L8 14 4.2 9.8Z" opacity="0.55" />
          </svg>
          <svg viewBox="0 0 24 12" className="h-2.5 w-5">
            <rect x="0.6" y="1" width="18" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <rect x="2" y="2.5" width="13.5" height="7" rx="1" fill="currentColor" />
            <rect x="19.5" y="3.5" width="1.8" height="5" rx="0.6" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="font-display text-[15px] font-bold text-ink">
          DEPANNI<span className="font-sans font-medium text-rust">.ma</span>
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-ink">
          <User className="h-4 w-4" strokeWidth={1.5} aria-hidden />
        </span>
      </div>

      <DisplayTitle as="h2" size="sm" className="mt-7 text-xl font-semibold">
        De quoi avez-vous <Accent>besoin</Accent>&nbsp;?
      </DisplayTitle>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className={`flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl ${
              cat.active ? "bg-rust text-white" : "border border-line bg-white text-ink"
            }`}
          >
            <cat.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            <span className="font-sans text-[10px] font-medium">{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-2xl border border-line/60 bg-white px-3 py-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-success" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <p className="font-sans text-[11px] text-ink">24 artisans en ligne près de vous</p>
      </div>
    </div>
  );
}
