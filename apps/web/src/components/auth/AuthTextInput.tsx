"use client";

import { type LucideIcon } from "lucide-react";
import { forwardRef } from "react";

import { authInputClass } from "@/components/auth/AuthFormField";
import { cn } from "@/lib/utils";

export type AuthTextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: LucideIcon;
  hasError?: boolean;
};

export const AuthTextInput = forwardRef<HTMLInputElement, AuthTextInputProps>(
  function AuthTextInput({ icon: Icon, hasError, className, ...props }, ref) {
    return (
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray"
            aria-hidden
          />
        )}
        <input
          ref={ref}
          className={authInputClass(hasError, cn(Icon ? "pl-10" : "px-3.5", className))}
          aria-invalid={hasError || undefined}
          {...props}
        />
      </div>
    );
  },
);
