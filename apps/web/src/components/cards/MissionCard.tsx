import Link from "next/link";
import { MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JobStatus } from "@/types";

interface MissionCardProps {
  id: string;
  title: string;
  status: JobStatus;
  city?: string;
  category?: string;
  href: string;
}

const statusVariant: Record<JobStatus, "default" | "secondary" | "success" | "danger" | "outline"> = {
  PENDING: "secondary",
  ACTIVE: "default",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "danger",
  EXPIRED: "outline",
};

const statusLabel: Record<JobStatus, string> = {
  PENDING: "En attente",
  ACTIVE: "Active",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

export function MissionCard({ id, title, status, city, category, href }: MissionCardProps) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-base">{title}</CardTitle>
            <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {category && <p className="capitalize">{category}</p>}
          {city && (
            <p className="mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {city}
            </p>
          )}
          <p className="mt-2 text-xs opacity-60">#{id.slice(0, 8)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
