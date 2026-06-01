import { cn } from "@/lib/utils";

import type { LitigeStatus } from "@/components/admin/litiges/adminLitigesMock";

const STYLES: Record<LitigeStatus, string> = {
  open: "bg-[rgba(220,38,38,0.08)] text-[#DC2626] border border-[rgba(220,38,38,0.2)]",
  mediation: "bg-[rgba(240,90,26,0.1)] text-[#F05A1A] border border-[rgba(240,90,26,0.2)]",
  pending_info:
    "bg-[rgba(234,179,8,0.1)] text-[#CA8A04] border border-[rgba(234,179,8,0.2)]",
  resolved: "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E] border border-[rgba(27,138,78,0.2)]",
};

export function LitigeStatusPill({
  status,
  label,
}: {
  status: LitigeStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold",
        STYLES[status],
      )}
    >
      {label}
    </span>
  );
}
