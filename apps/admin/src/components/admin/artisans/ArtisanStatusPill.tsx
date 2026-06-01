import { cn } from "@/lib/utils";

import type { ArtisanStatus } from "@/components/admin/artisans/adminArtisansMock";

const CONFIG: Record<ArtisanStatus, { label: string; style: string }> = {
  active: { label: "● Actif", style: "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]" },
  pending: { label: "○ KYC en attente", style: "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]" },
  inactive: { label: "○ Inactif", style: "bg-[rgba(107,114,128,0.1)] text-[#6B7280]" },
  suspended: { label: "✕ Suspendu", style: "bg-[rgba(220,38,38,0.1)] text-[#DC2626]" },
};

export function ArtisanStatusPill({ status }: { status: ArtisanStatus }) {
  const c = CONFIG[status];
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", c.style)}>
      {c.label}
    </span>
  );
}
