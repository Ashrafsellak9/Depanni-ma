import { cn } from "@/lib/utils";

export type AdminStatus =
  | "active"
  | "done"
  | "pending"
  | "cancelled"
  | "inactive"
  | "suspended";

const MISSION_STYLES: Record<
  "done" | "active" | "pending" | "cancelled",
  { label: string; className: string }
> = {
  done: {
    label: "Terminée",
    className:
      "bg-[rgba(15,30,53,0.07)] text-[#0F1E35] px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
  active: {
    label: "En cours",
    className:
      "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E] px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
  pending: {
    label: "En attente",
    className:
      "bg-[rgba(240,90,26,0.1)] text-[#F05A1A] px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
  cancelled: {
    label: "Annulée",
    className:
      "bg-[rgba(220,38,38,0.08)] text-[#DC2626] px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
};

const OTHER_STYLES: Record<"inactive" | "suspended", { label: string; className: string }> = {
  inactive: {
    label: "Inactif",
    className: "bg-dep-gray/10 text-dep-gray px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
  suspended: {
    label: "Suspendu",
    className:
      "bg-[rgba(220,38,38,0.08)] text-[#DC2626] px-[10px] py-[3px] rounded-full text-[11px] font-semibold",
  },
};

export function StatusPill({ status }: { status: AdminStatus }) {
  const s =
    status in MISSION_STYLES
      ? MISSION_STYLES[status as keyof typeof MISSION_STYLES]
      : OTHER_STYLES[status as keyof typeof OTHER_STYLES];

  return <span className={cn("inline-flex", s.className)}>{s.label}</span>;
}
