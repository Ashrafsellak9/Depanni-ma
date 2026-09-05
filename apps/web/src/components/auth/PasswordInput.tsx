"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useState } from "react";

import { authInputClass } from "@/components/auth/AuthFormField";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  showStrength?: boolean;
  strengthValue?: string;
  ruleHint?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      hasError,
      showStrength,
      strengthValue,
      ruleHint,
      id,
      placeholder = "Votre mot de passe",
      autoComplete = "new-password",
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const toggleLabel = visible ? "Masquer le mot de passe" : "Afficher le mot de passe";

    return (
      <div className="space-y-2">
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray"
            aria-hidden
          />
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-invalid={hasError || undefined}
            className={authInputClass(hasError, "pl-10 pr-11")}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-dep-gray transition-colors duration-200 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-label={toggleLabel}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {showStrength && strengthValue !== undefined && <PasswordStrength password={strengthValue} />}
        {ruleHint && (
          <p className="text-xs text-dep-gray">8 caractères minimum, une majuscule, un chiffre</p>
        )}
      </div>
    );
  },
);
