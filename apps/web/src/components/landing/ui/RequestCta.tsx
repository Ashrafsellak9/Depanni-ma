"use client";

import { LandingButton } from "@/components/landing/ui/LandingButton";
import { useRequestModal } from "@/store/requestModalStore";

type RequestCtaProps = {
  children: React.ReactNode;
  variant?: "rust" | "ghost" | "white" | "whiteGhost" | "ink";
  className?: string;
  event?: string;
  onClick?: () => void;
};

export function RequestCta({ children, variant, className, event, onClick }: RequestCtaProps) {
  const openModal = useRequestModal((s) => s.openModal);

  return (
    <LandingButton
      variant={variant}
      className={className}
      event={event}
      onClick={() => {
        onClick?.();
        openModal();
      }}
    >
      {children}
    </LandingButton>
  );
}
