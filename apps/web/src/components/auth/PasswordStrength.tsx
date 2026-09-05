"use client";

import { getPasswordStrength } from "@/components/auth/artisanRegisterConstants";
import { cn } from "@/lib/utils";

const STRENGTH_LABELS = ["", "Faible", "Moyen", "Fort"] as const;
const STRENGTH_COLORS = ["bg-dep-border", "bg-dep-red", "bg-orange", "bg-green"] as const;

export function PasswordStrength({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              strength >= level ? STRENGTH_COLORS[strength] : "bg-cream-2",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-dep-gray">
        Force : <span className="font-medium text-navy">{STRENGTH_LABELS[strength]}</span>
      </p>
    </div>
  );
}
