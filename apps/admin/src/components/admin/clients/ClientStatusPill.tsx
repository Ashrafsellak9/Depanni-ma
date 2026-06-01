import { cn } from "@/lib/utils";

import type { ClientStatus } from "@/components/admin/clients/adminClientsMock";

const CONFIG: Record<ClientStatus, { label: string; style: string }> = {
  active: { label: "● Actif", style: "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]" },
  new: { label: "✦ Nouveau", style: "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]" },
  inactive: { label: "○ Inactif", style: "bg-[rgba(107,114,128,0.1)] text-[#6B7280]" },
  blocked: { label: "✕ Bloqué", style: "bg-[rgba(220,38,38,0.1)] text-[#DC2626]" },
};

export function ClientStatusPill({ status }: { status: ClientStatus }) {
  const c = CONFIG[status];
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", c.style)}>
      {c.label}
    </span>
  );
}
