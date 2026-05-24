export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong";

export interface PasswordStrengthResult {
  level: PasswordStrengthLevel;
  score: number;
  label: string;
  color: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { level: "weak", score, label: "Faible", color: "#dc2626" };
  }
  if (score <= 3) {
    return { level: "fair", score, label: "Moyen", color: "#f59e0b" };
  }
  if (score <= 4) {
    return { level: "good", score, label: "Bon", color: "#16a34a" };
  }
  return { level: "strong", score, label: "Fort", color: "#15803d" };
}
