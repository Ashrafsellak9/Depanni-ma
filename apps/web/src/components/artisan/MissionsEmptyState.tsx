"use client";

import { Bell, PauseCircle, Power } from "lucide-react";

import { DisplayTitle } from "@/components/ui/display-title";

interface MissionsEmptyStateProps {
  isAvailable: boolean;
  onBecomeAvailable?: () => void;
}

export function MissionsEmptyState({ isAvailable, onBecomeAvailable }: MissionsEmptyStateProps) {
  if (!isAvailable) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-dep-gray/10">
          <PauseCircle size={28} className="text-dep-gray" />
        </div>
        <DisplayTitle as="h3" size="sm" className="mb-2 text-[18px]">
          Vous êtes en pause
        </DisplayTitle>
        <p className="mb-5 text-[13px] text-dep-gray">
          Activez votre disponibilité pour recevoir des missions
        </p>
        <button
          type="button"
          onClick={onBecomeAvailable}
          className="flex items-center gap-2 rounded-xl bg-green px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-green/90"
        >
          <Power size={16} />
          Me rendre disponible
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange/15 bg-orange/[0.08]">
        <Bell size={28} className="text-orange" />
      </div>
      <DisplayTitle as="h3" size="sm" className="mb-2 text-[18px]">
        En attente de missions...
      </DisplayTitle>
      <p className="max-w-[280px] text-[13px] leading-[1.6] text-dep-gray">
        Vous serez alerté dès qu&apos;une demande sera disponible dans votre zone d&apos;intervention.
      </p>
      <div className="mt-4 flex items-center gap-2 text-[12px] text-green">
        <div className="h-2 w-2 animate-pulse rounded-full bg-green" />
        Disponible · El Jadida Centre · rayon 5 km
      </div>
    </div>
  );
}
