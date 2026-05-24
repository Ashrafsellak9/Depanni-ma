"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";

import { JobStatusBadge } from "@/components/citizen/JobStatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyMissions } from "@/hooks/citizen/useMyMissions";
import type { JobStatus } from "@/types";

const STATUS_OPTIONS: { value: JobStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "PENDING", label: "En attente" },
  { value: "ACTIVE", label: "Active" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminée" },
  { value: "CANCELLED", label: "Annulée" },
];

type DateFilter = "all" | "7d" | "30d";

export default function MissionsHistoryPage() {
  const [status, setStatus] = useState<JobStatus | "">("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const { data, isLoading, isError } = useMyMissions({
    status: status || undefined,
    limit: 50,
  });

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    if (dateFilter === "all") return items;
    const now = Date.now();
    const days = dateFilter === "7d" ? 7 : 30;
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return items.filter((j) => new Date(j.createdAt).getTime() >= cutoff);
  }, [data?.items, dateFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Historique</h1>
        <p className="text-muted-foreground">Toutes vos demandes et missions</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="status-filter">Statut</Label>
          <select
            id="status-filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus | "")}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="date-filter">Période</Label>
          <select
            id="date-filter"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="all">Toutes les dates</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">Impossible de charger vos missions.</p>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-12">Aucune mission trouvée.</p>
      )}

      <ul className="space-y-3">
        {filtered.map((job) => (
          <li key={job.id}>
            <Link href={`/missions/${job.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-navy truncate">{job.title}</p>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.city} · {format(new Date(job.createdAt), "d MMM yyyy", { locale: fr })}
                      {job.offerCount > 0 && ` · ${job.offerCount} offre(s)`}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
