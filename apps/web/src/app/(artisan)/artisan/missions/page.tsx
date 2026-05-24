"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight, Search } from "lucide-react";

import { MissionStatusBadge } from "@/components/artisan/MissionStatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanMissions } from "@/hooks/artisan/useArtisanMissions";
import type { MissionStatus } from "@/types";

const STATUS_OPTIONS: { value: MissionStatus | ""; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "ACCEPTED", label: "Acceptées" },
  { value: "IN_PROGRESS", label: "En cours" },
  { value: "COMPLETED", label: "Terminées" },
  { value: "CANCELLED", label: "Annulées" },
];

export default function ArtisanMissionsPage() {
  const [status, setStatus] = useState<MissionStatus | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useArtisanMissions({
    status: status || undefined,
    search: debouncedSearch || undefined,
    limit: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Missions</h1>
        <p className="text-muted-foreground">Historique et missions en cours</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              className="pl-9"
              placeholder="Titre, ville…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-48">
          <Label htmlFor="status">Statut</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as MissionStatus | "")}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-danger">Impossible de charger les missions.</p>
      )}

      {!isLoading && (data?.items.length ?? 0) === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">Aucune mission.</p>
      )}

      <ul className="space-y-2">
        {data?.items.map((m) => (
          <li key={m.id}>
            <Link
              href={`/artisan/missions/${m.id}`}
              className="flex items-center justify-between rounded-xl border p-4 transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="font-semibold text-navy truncate">{m.job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {m.citizen.firstName} {m.citizen.lastName} · {m.job.city} ·{" "}
                  {format(new Date(m.createdAt), "d MMM yyyy", { locale: fr })}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <MissionStatusBadge status={m.status} />
                <span className="hidden font-semibold text-primary sm:inline">
                  {m.artisanNet} MAD
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
