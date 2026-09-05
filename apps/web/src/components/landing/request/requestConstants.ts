import {
  Car,
  Droplet,
  Key,
  MoreHorizontal,
  Paintbrush,
  Refrigerator,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Exactement les 7 services homepage + Autre. Pas de climatisation. */
export const REQUEST_SERVICES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "plomberie", label: "Plomberie", icon: Droplet },
  { id: "electricite", label: "Électricité", icon: Zap },
  { id: "serrurerie", label: "Serrurerie", icon: Key },
  { id: "mecanique", label: "Mécanique", icon: Car },
  { id: "peinture", label: "Peinture", icon: Paintbrush },
  { id: "menage", label: "Ménage", icon: Sparkles },
  { id: "electromenager", label: "Électroménager", icon: Refrigerator },
  { id: "autre", label: "Autre", icon: MoreHorizontal },
];

export const REQUEST_DISTRICTS = [
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
] as const;

/** Numéro marocain : 06/07/05… ou +212. */
export const MA_PHONE_RE = /^(?:\+212|0)[5-7]\d{8}$/;

export const REQUEST_FIELD_CLASS =
  "w-full rounded-xl border border-line bg-white px-3.5 py-3 font-sans text-sm text-ink outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-rust focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, "");
}

export function isValidMaPhone(value: string): boolean {
  return MA_PHONE_RE.test(normalizePhone(value));
}

export function maskPhone(value: string): string {
  const d = normalizePhone(value);
  if (d.startsWith("+212") && d.length >= 12) {
    return `+212 ${d[4]} XX XX ${d.slice(-4, -2)} ${d.slice(-2)}`;
  }
  if (d.length >= 10) {
    return `${d.slice(0, 2)} ${d.slice(2, 4)} XX XX ${d.slice(-2)}`;
  }
  return d;
}

export function minDateTimeLocal(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function formatScheduledAt(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("fr-MA", { dateStyle: "medium", timeStyle: "short" });
}
