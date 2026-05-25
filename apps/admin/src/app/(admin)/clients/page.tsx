"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { DataTable } from "@/components/tables/DataTable";
import { useDebounce } from "@/hooks/useDebounce";
import { exportRowsToCsv } from "@/lib/exportCsv";
import { fetchClients } from "@/services/adminApi";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  user: { email: string; phone: string; isVerified: boolean; createdAt: string };
  _count: { jobs: number };
}

const columns: ColumnDef<ClientRow>[] = [
  { header: "Client", accessorFn: (r) => `${r.firstName} ${r.lastName}` },
  { header: "Email", accessorFn: (r) => r.user.email },
  { header: "Téléphone", accessorFn: (r) => r.user.phone },
  { header: "Jobs", accessorFn: (r) => r._count.jobs },
  {
    header: "Vérifié",
    cell: ({ row }) => (row.original.user.isVerified ? "Oui" : "Non"),
  },
  {
    header: "Inscription",
    accessorFn: (r) => new Date(r.user.createdAt).toLocaleDateString("fr-MA"),
  },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "clients", debounced],
    queryFn: () => fetchClients(1),
  });

  const items = useMemo(() => {
    const all = (data?.items ?? []) as unknown as ClientRow[];
    if (!debounced.trim()) return all;
    const q = debounced.toLowerCase();
    return all.filter(
      (c) =>
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.user.email.toLowerCase().includes(q) ||
        c.user.phone.includes(q),
    );
  }, [data?.items, debounced]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Clients</h2>
        <button
          type="button"
          onClick={() =>
            exportRowsToCsv(
              items.map((c) => ({
                nom: `${c.firstName} ${c.lastName}`,
                email: c.user.email,
                phone: c.user.phone,
                jobs: c._count.jobs,
              })),
              "clients-export",
            )
          }
          className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
        >
          Export CSV
        </button>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Recherche client…"
        className="w-full max-w-md rounded-lg border px-3 py-2 text-sm"
      />
      {isLoading ? <p className="text-slate-500">Chargement…</p> : <DataTable data={items} columns={columns} />}
    </div>
  );
}
