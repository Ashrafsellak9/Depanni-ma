"use client";

import { Phone } from "lucide-react";
import { forwardRef } from "react";

import { authInputClass } from "@/components/auth/AuthFormField";

export type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  function PhoneInput({ hasError, onChange, ...props }, ref) {
    return (
      <div className="relative flex">
        <span
          className="flex min-h-[48px] items-center rounded-l-xl border border-r-0 border-dep-border bg-cream-2 px-3 text-sm font-medium text-navy"
          aria-hidden
        >
          +212
        </span>
        <div className="relative flex-1">
          <Phone
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray"
            aria-hidden
          />
          <input
            ref={ref}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="6XXXXXXXX"
            maxLength={9}
            aria-invalid={hasError || undefined}
            className={authInputClass(hasError, "rounded-l-none rounded-r-xl pl-9")}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
              onChange?.(e);
            }}
            {...props}
          />
        </div>
      </div>
    );
  },
);
