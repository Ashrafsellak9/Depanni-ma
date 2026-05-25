"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/DataTable";
import { fetchClients } from "@/services/adminApi";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  user: { email: string; phone: string; isVerified: boolean };
  _count: { jobs: number };
}

const columns: ColumnDef<ClientRow>[] = [
  {
    header: "Client",
    accessorFn: (r) => `${r.firstName} ${r.lastName}`,
  },
  { header: "Email", accessorFn: (r) => r.user.email },
  { header: "Téléphone", accessorFn: (r) => r.user.phone },
  { header: "Jobs", accessorFn: (r) => r._count.jobs },
  {
    header: "Vérifié",
    cell: ({ row }) => (row.original.user.isVerified ? "Oui" : "Non"),
  },
];

export default function ClientsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: () => fetchClients(1),
  });

  const items = (data?.items ?? []) as unknown as ClientRow[];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Clients</h2>
      {isLoading ? <p className="text-slate-500">Chargement…</p> : <DataTable data={items} columns={columns} />}
    </div>
  );
}
