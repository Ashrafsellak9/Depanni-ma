"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useState } from "react";

import {
  AUTH_INPUT_BASE,
  AUTH_INPUT_ERROR,
  AUTH_INPUT_NORMAL,
} from "@/components/auth/authFormStyles";
import { cn } from "@/lib/utils";

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  capsLockOn?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { hasError, capsLockOn, id, autoComplete = "current-password", ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="space-y-1.5">
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
            aria-invalid={hasError || undefined}
            className={cn(
              AUTH_INPUT_BASE,
              "pl-10 pr-11",
              hasError ? AUTH_INPUT_ERROR : AUTH_INPUT_NORMAL,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-dep-gray transition-colors duration-200 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
        {capsLockOn && id && (
          <p id={`${id}-caps`} className="text-xs text-dep-gray" role="status">
            Verr. Maj activée
          </p>
        )}
      </div>
    );
  },
);
