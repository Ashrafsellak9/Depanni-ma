"use client";

import { ChevronRight, HardHat, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const ICON_STYLES = {
  orange: "bg-orange/10 text-orange",
  navy: "bg-navy/10 text-navy",
} as const;

const ICONS = {
  home: Home,
  hardhat: HardHat,
} as const;

export function AccountTypeCard({
  href,
  icon,
  iconColor,
  title,
  description,
  ariaLabel,
}: {
  href: string;
  icon: keyof typeof ICONS;
  iconColor: keyof typeof ICON_STYLES;
  title: string;
  description: string;
  ariaLabel: string;
}) {
  const Icon = ICONS[icon];
  const router = useRouter();

  const navigate = () => router.push(href);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={navigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      }}
      className="group flex min-h-[72px] cursor-pointer items-center gap-4 rounded-2xl border border-dep-border bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${ICON_STYLES[iconColor]}`}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-extrabold text-navy">{title}</span>
        <span className="mt-0.5 block text-sm text-dep-gray">{description}</span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-dep-gray transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-orange"
        aria-hidden
      />
    </div>
  );
}
