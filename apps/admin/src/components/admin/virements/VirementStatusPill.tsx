import type { VirementStatus } from "@/components/admin/virements/adminVirementsMock";

const STATUS_CONFIG: Record<
  VirementStatus,
  { label: string; style: string }
> = {
  pending: {
    label: "○ En attente",
    style: "bg-[rgba(240,90,26,0.1)] text-[#F05A1A]",
  },
  processing: {
    label: "⟳ En traitement",
    style: "bg-[rgba(15,30,53,0.07)] text-[#0F1E35]",
  },
  done: {
    label: "✓ Traité",
    style: "bg-[rgba(27,138,78,0.1)] text-[#1B8A4E]",
  },
  failed: {
    label: "✕ Échec",
    style: "bg-[rgba(220,38,38,0.1)] text-[#DC2626]",
  },
};

export function VirementStatusPill({ status }: { status: VirementStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${c.style}`}>
      {c.label}
    </span>
  );
}
