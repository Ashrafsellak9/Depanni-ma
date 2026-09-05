export const AUTH_INPUT_BASE =
  "min-h-[48px] w-full rounded-xl border bg-white text-sm text-navy outline-none transition-all duration-200 placeholder:text-dep-gray focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";

export const AUTH_INPUT_NORMAL =
  "border-dep-border focus:border-orange focus:ring-orange/20";

export const AUTH_INPUT_ERROR =
  "border-dep-red bg-dep-red/[0.04] focus:border-dep-red focus:ring-dep-red/20";

export const ARTISAN_SERVICES = [
  { id: "plomberie", label: "Plomberie" },
  { id: "electricite", label: "Électricité" },
  { id: "serrurerie", label: "Serrurerie" },
  { id: "mecanique", label: "Mécanique Auto" },
  { id: "peinture", label: "Peinture" },
  { id: "menage", label: "Ménage & Nettoyage" },
  { id: "electromenager", label: "Électroménager" },
  { id: "autre", label: "Autre" },
] as const;

export const WIZARD_STEPS = [
  { id: 1, title: "Vos informations" },
  { id: 2, title: "Votre activité" },
  { id: 3, title: "Vérification" },
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

export function getPasswordStrength(password: string): 0 | 1 | 2 | 3 {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score as 0 | 1 | 2 | 3;
}

export function formatMoroccanPhone(local: string): string {
  const digits = local.replace(/\D/g, "");
  return `+212${digits}`;
}

export function isValidLocalPhone(local: string): boolean {
  return /^[67]\d{8}$/.test(local.replace(/\D/g, ""));
}
