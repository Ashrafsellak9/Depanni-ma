"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { JobStatusBadge } from "@/components/citizen/JobStatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMission } from "@/hooks/citizen/useMyMissions";

export function ActiveMissionBanner() {
  const { activeMission, isLoading } = useActiveMission();

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-xl" />;
  }

  if (!activeMission) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">Mission en cours</p>
          <p className="font-semibold text-navy">{activeMission.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <JobStatusBadge status={activeMission.status} />
            {activeMission.mission?.artisan && (
              <span className="text-sm text-muted-foreground">
                {activeMission.mission.artisan.firstName} {activeMission.mission.artisan.lastName}
              </span>
            )}
          </div>
        </div>
      </div>
      <Button asChild variant="default" size="sm">
        <Link href={`/missions/${activeMission.id}`}>
          Suivre
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
