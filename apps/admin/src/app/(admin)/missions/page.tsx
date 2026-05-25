"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMad } from "@/lib/utils";
import { fetchMissions } from "@/services/adminApi";
import type { AdminMissionRow } from "@/types/admin";

const columns: ColumnDef<AdminMissionRow>[] = [
  {
    header: "Mission",
    cell: ({ row }) => (
      <Link href={`/missions/${row.original.id}`} className="text-indigo-600 hover:underline">
        {row.original.job.title}
      </Link>
    ),
  },
  { header: "Ville", accessorFn: (r) => r.job.city },
  {
    header: "Artisan",
    accessorFn: (r) => `${r.artisan.firstName} ${r.artisan.lastName}`,
  },
  {
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    header: "Montant",
    cell: ({ row }) => formatMad(row.original.totalAmount),
  },
];

export default function MissionsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "missions", status, search],
    queryFn: () =>
      fetchMissions({
        status: status || undefined,
        search: search || undefined,
        limit: 50,
      }),
  });

  const items = (data?.items ?? []) as AdminMissionRow[];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Missions</h2>
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tous statuts</option>
          {["ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISPUTED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : (
        <DataTable data={items} columns={columns} />
      )}
    </div>
  );
}
