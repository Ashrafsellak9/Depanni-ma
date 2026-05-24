"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import { MissionStatusBadge } from "@/components/artisan/MissionStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ArtisanMission } from "@/types/artisan";

interface RecentMissionsProps {
  missions?: ArtisanMission[];
  isLoading?: boolean;
}

export function RecentMissions({ missions = [], isLoading }: RecentMissionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (missions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Aucune mission récente.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Mission</th>
            <th className="px-4 py-3 font-medium hidden sm:table-cell">Client</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium hidden md:table-cell">Montant</th>
            <th className="px-4 py-3 font-medium hidden lg:table-cell">Date</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {missions.map((m) => (
            <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-navy">{m.job.title}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                {m.citizen.firstName} {m.citizen.lastName}
              </td>
              <td className="px-4 py-3">
                <MissionStatusBadge status={m.status} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell font-semibold text-primary">
                {m.artisanNet} MAD
              </td>
              <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                {format(new Date(m.createdAt), "d MMM yyyy", { locale: fr })}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/artisan/missions/${m.id}`}
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
