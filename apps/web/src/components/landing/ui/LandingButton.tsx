"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

const variants = {
  rust: "bg-rust-deep text-white hover:bg-[#8F2A0C]",
  ghost: "border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-paper-2",
  white: "bg-white text-ink hover:bg-paper",
  whiteGhost: "border border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10",
  ink: "bg-ink text-paper hover:bg-ink-soft",
} as const;

type LandingButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  event?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const baseClass =
  "group inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-[-0.01em] transition-all duration-200 ease-out hover:-translate-y-px disabled:pointer-events-none disabled:opacity-40 disabled:hover:translate-y-0";

export function LandingButton({
  href,
  children,
  variant = "rust",
  className,
  event,
  onClick,
  disabled,
}: LandingButtonProps) {
  const classes = cn(baseClass, variants[variant], className);

  if (href && !disabled) {
    return (
      <Link href={href} data-event={event} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" data-event={event} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
