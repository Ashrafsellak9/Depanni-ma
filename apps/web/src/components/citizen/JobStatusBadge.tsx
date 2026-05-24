import { Badge } from "@/components/ui/badge";
import type { JobStatus } from "@/types";

const LABELS: Record<JobStatus, string> = {
  PENDING: "En attente",
  ACTIVE: "Active",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

const VARIANTS: Record<JobStatus, "default" | "secondary" | "success" | "danger" | "outline"> = {
  PENDING: "secondary",
  ACTIVE: "default",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
  EXPIRED: "outline",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
