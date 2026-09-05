export const AUTH_INPUT_BASE =
  "min-h-[48px] w-full rounded-xl border bg-white text-sm text-navy outline-none transition-all duration-200 placeholder:text-dep-gray focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

export const AUTH_INPUT_NORMAL =
  "border-dep-border focus:border-orange focus:ring-orange/20";

export const AUTH_INPUT_ERROR =
  "border-dep-red bg-dep-red/[0.04] focus:border-dep-red focus:ring-dep-red/20";

export const FALLBACK_LOGIN_STATS = [
  { value: "280+", label: "Artisans actifs" },
  { value: "4,8★", label: "Note moyenne" },
  { value: "< 8 min", label: "Temps de réponse" },
] as const;
