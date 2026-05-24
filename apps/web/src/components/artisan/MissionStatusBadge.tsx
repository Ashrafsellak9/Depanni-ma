import { Badge } from "@/components/ui/badge";
import type { MissionStatus } from "@/types";

const LABELS: Record<MissionStatus, string> = {
  ACCEPTED: "Acceptée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  DISPUTED: "Litige",
};

const VARIANTS: Record<
  MissionStatus,
  "default" | "secondary" | "success" | "danger" | "outline"
> = {
  ACCEPTED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
  DISPUTED: "outline",
};

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
