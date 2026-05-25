export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidMoroccanLocal(local: string): boolean {
  const digits = local.replace(/\D/g, "");
  return /^[67]\d{8}$/.test(digits);
}

export function toE164Morocco(local: string): string {
  const digits = local.replace(/\D/g, "");
  return `+212${digits.startsWith("0") ? digits.slice(1) : digits}`;
}
