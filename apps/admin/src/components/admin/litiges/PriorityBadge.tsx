import type { LitigePriority } from "@/components/admin/litiges/adminLitigesMock";

const CONFIG: Record<
  LitigePriority,
  { label: string; bg: string; text: string }
> = {
  urgent: { label: "🔴 Urgent", bg: "rgba(220,38,38,0.1)", text: "#DC2626" },
  high: { label: "🟠 Élevée", bg: "rgba(240,90,26,0.1)", text: "#F05A1A" },
  medium: { label: "🟡 Moyenne", bg: "rgba(234,179,8,0.1)", text: "#CA8A04" },
  low: { label: "🟢 Faible", bg: "rgba(27,138,78,0.1)", text: "#1B8A4E" },
  resolved: { label: "✓ Résolu", bg: "rgba(107,114,128,0.1)", text: "#6B7280" },
};

export function PriorityBadge({ priority }: { priority: LitigePriority }) {
  const c = CONFIG[priority];
  return (
    <span
      className="whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}
