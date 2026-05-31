/** Chiffres locaux marocains (sans indicatif). */
export function extractLocalDigits(input: string): string {
  const raw = input.replace(/\D/g, "");
  if (raw.startsWith("212")) return raw.slice(3, 12);
  if (raw.startsWith("0")) return raw.slice(1, 10);
  return raw.slice(0, 9);
}

/** Affichage: 6 12 34 56 78 */
export function formatLocalPhoneDisplay(digits: string): string {
  const d = extractLocalDigits(digits);
  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 2) {
    parts.push(d.slice(i, i + 2));
  }
  return parts.join(" ").trim();
}

/** API: +212612345678 */
export function toE164Morocco(localDigits: string): string {
  const d = extractLocalDigits(localDigits);
  if (d.length !== 9) return "";
  return `+212${d}`;
}

export function isValidMoroccanLocal(digits: string): boolean {
  const d = extractLocalDigits(digits);
  return /^[5-7]\d{8}$/.test(d);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isStrongPassword(password: string): boolean {
  return (
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
  );
}
