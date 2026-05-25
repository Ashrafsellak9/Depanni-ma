"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { fetchArtisans } from "@/services/adminApi";

interface ArtisanRow {
  id: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
  availabilityStatus: string;
  totalMissions: number;
  rating: number;
  user: { email: string; phone: string };
}

const columns: ColumnDef<ArtisanRow>[] = [
  {
    header: "Artisan",
    cell: ({ row }) => (
      <Link href={`/artisans/${row.original.id}`} className="text-indigo-600 hover:underline">
        {row.original.firstName} {row.original.lastName}
      </Link>
    ),
  },
  { header: "Email", accessorFn: (r) => r.user.email },
  {
    header: "KYC",
    cell: ({ row }) => <StatusBadge status={row.original.kycStatus} />,
  },
  {
    header: "Dispo",
    cell: ({ row }) => <StatusBadge status={row.original.availabilityStatus} />,
  },
  { header: "Missions", accessorKey: "totalMissions" },
  {
    header: "Note",
    accessorFn: (r) => r.rating.toFixed(1),
  },
];

export default function ArtisansPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "artisans"],
    queryFn: () => fetchArtisans({ limit: 50 }),
  });

  const items = (data?.items ?? []) as unknown as ArtisanRow[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Artisans</h2>
        <Link href="/artisans/kyc" className="text-sm text-indigo-600 hover:underline">
          File KYC →
        </Link>
      </div>
      {isLoading ? <p className="text-slate-500">Chargement…</p> : <DataTable data={items} columns={columns} />}
    </div>
  );
}
