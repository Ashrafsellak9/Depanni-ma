"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: React.ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `titanium-${uid}`;

  return (
    <div className={cn("relative w-full", className)} style={{ aspectRatio: "414 / 892" }}>
      <svg
        viewBox="0 0 414 892"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9C3B8" />
            <stop offset="45%" stopColor="#B7B1A6" />
            <stop offset="100%" stopColor="#9E9890" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradientId})`}
          fillRule="evenodd"
          d="M56 1h302c30.4 0 55 24.6 55 55v780c0 30.4-24.6 55-55 55H56c-30.4 0-55-24.6-55-55V56C1 25.6 25.6 1 56 1Zm-8 23h318c26 0 47 21 47 47v750c0 26-21 47-47 47H48c-26 0-47-21-47-47V71c0-26 21-47 47-47Z"
        />
        <rect x="0" y="168" width="4.5" height="34" rx="1.5" fill="#6A655E" />
        <rect x="0" y="218" width="4.5" height="62" rx="1.5" fill="#6A655E" />
        <rect x="0" y="292" width="4.5" height="62" rx="1.5" fill="#6A655E" />
        <rect x="409.5" y="236" width="4.5" height="86" rx="1.5" fill="#6A655E" />
      </svg>

      <div
        className="absolute overflow-hidden bg-paper"
        style={{
          top: "2.69%",
          left: "2.9%",
          right: "2.9%",
          bottom: "2.69%",
          borderRadius: "47px",
        }}
      >
        {children}
      </div>

      <svg
        viewBox="0 0 414 892"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden
      >
        <rect x="147" y="36" width="120" height="34" rx="17" fill="#0B1B2B" />
        <circle cx="178" cy="53" r="5" fill="#1A1A1A" />
        <circle cx="178" cy="53" r="2.2" fill="#0E1C28" />
      </svg>
    </div>
  );
}
