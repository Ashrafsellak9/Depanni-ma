"use client";

import { AlertCircle } from "lucide-react";

export function AuthErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-dep-red/15 bg-dep-red/[0.06] px-3 py-2.5"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-dep-red" aria-hidden />
      <div className="text-sm text-dep-red">{children}</div>
    </div>
  );
}
