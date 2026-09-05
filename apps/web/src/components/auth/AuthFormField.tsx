"use client";

import { AlertCircle } from "lucide-react";

import { AUTH_INPUT_BASE, AUTH_INPUT_ERROR, AUTH_INPUT_NORMAL } from "@/components/auth/artisanRegisterConstants";
import { cn } from "@/lib/utils";

export function RequiredMark() {
  return <span className="text-orange" aria-hidden> *</span>;
}

export function RequiredLegend() {
  return (
    <p className="text-xs text-dep-gray">
      <span className="text-orange">*</span> Champs obligatoires
    </p>
  );
}

export function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-sm text-dep-red">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export function AuthField({
  id,
  label,
  required,
  error,
  hint,
  children,
  labelExtra,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  labelExtra?: React.ReactNode;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-semibold text-navy">
          {label}
          {required && <RequiredMark />}
        </label>
        {labelExtra}
      </div>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-dep-gray">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  );
}

export function authFieldDescribedBy(id: string, error?: string, hint?: string) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

export function authInputClass(hasError?: boolean, extra?: string) {
  return cn(AUTH_INPUT_BASE, hasError ? AUTH_INPUT_ERROR : AUTH_INPUT_NORMAL, extra);
}
