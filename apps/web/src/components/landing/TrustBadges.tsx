import { BadgeCheck, Headset, RotateCcw, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Paiement sécurisé",
    sub: "CMI · Visa · Mastercard",
  },
  {
    icon: BadgeCheck,
    label: "Artisans vérifiés KYC",
    sub: "Identité & diplômes contrôlés",
  },
  {
    icon: RotateCcw,
    label: "Satisfait ou réintervention",
    sub: "Garantie sur chaque mission",
  },
  {
    icon: Headset,
    label: "Support 7\u00a0j/7",
    sub: "Une équipe à votre écoute",
  },
];

export function TrustBadges({
  compact = false,
  onDark = false,
  className = "",
}: {
  compact?: boolean;
  onDark?: boolean;
  className?: string;
}) {
  if (compact) {
    return (
      <ul className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-2", className)}>
        {BADGES.map((b) => (
          <li
            key={b.label}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              onDark ? "text-white/90" : "text-ink",
            )}
          >
            <b.icon className={cn("h-4 w-4", onDark ? "text-white" : "text-rust")} strokeWidth={1.5} />
            {b.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {BADGES.map((b) => (
        <li
          key={b.label}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-5 py-3.5 transition-all duration-200",
            onDark
              ? "border border-white/8 bg-ink-soft hover:-translate-y-px hover:border-rust/40"
              : "border border-line/60 bg-paper hover:-translate-y-px hover:border-rust/40",
          )}
        >
          <b.icon className="h-4 w-4 shrink-0 text-rust" strokeWidth={1.5} aria-hidden />
          <span>
            <span className={cn("block text-sm font-medium", onDark ? "text-white" : "text-ink")}>
              {b.label}
            </span>
            <span className={cn("block text-xs", onDark ? "text-white/70" : "text-ink/70")}>{b.sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
