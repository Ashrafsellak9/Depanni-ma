"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { Download, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { exportRowsToCsv } from "@/lib/exportCsv";
import { formatMad } from "@/lib/utils";
import { adminPaths } from "@/lib/adminPaths";
import { fetchArtisans, type ArtisansListParams } from "@/services/adminApi";
import type { ArtisanListItem } from "@/types/moderation";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ArtisansTable() {
  const [search, setSearch] = useState("");
  const [kyc, setKyc] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const [subscription, setSubscription] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const debouncedSearch = useDebounce(search, 300);

  const params = useMemo<ArtisansListParams>(() => {
    const sort = sorting[0];
    const sortMap: Record<string, ArtisansListParams["sortBy"]> = {
      name: "firstName",
      rating: "rating",
      totalMissions: "totalMissions",
      monthRevenue: "monthRevenue",
    };
    return {
      search: debouncedSearch || undefined,
      kyc: kyc || undefined,
      specialty: specialty || undefined,
      city: city || undefined,
      ratingMin: ratingMin ? Number(ratingMin) : undefined,
      subscription: subscription || undefined,
      sortBy: sort ? (sortMap[sort.id] ?? "createdAt") : "createdAt",
      sortOrder: sort?.desc ? "desc" : "asc",
      limit: 100,
    };
  }, [debouncedSearch, kyc, specialty, city, ratingMin, subscription, sorting]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin", "artisans", params],
    queryFn: () => fetchArtisans(params),
  });

  const items = data?.items ?? [];

  const columns = useMemo<ColumnDef<ArtisanListItem>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
      },
      {
        id: "avatar",
        header: "",
        cell: ({ row }) => (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
            {row.original.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.original.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              `${row.original.firstName[0]}${row.original.lastName[0]}`
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        id: "name",
        header: "Nom",
        accessorFn: (r) => `${r.firstName} ${r.lastName}`,
        cell: ({ row }) => (
          <Link href={adminPaths.artisans(row.original.id)} className="font-medium text-orange hover:underline">
            {row.original.firstName} {row.original.lastName}
          </Link>
        ),
      },
      {
        id: "specialty",
        header: "Spécialité",
        accessorFn: (r) => r.specialties.join(", ") || "—",
      },
      {
        id: "kycStatus",
        header: "KYC",
        cell: ({ row }) => <StatusBadge status={row.original.kycStatus} />,
      },
      {
        id: "rating",
        header: "Note",
        accessorKey: "rating",
        cell: ({ row }) => `★ ${row.original.rating.toFixed(1)}`,
      },
      {
        id: "totalMissions",
        header: "Missions",
        accessorKey: "totalMissions",
      },
      {
        id: "monthRevenue",
        header: "Revenus mois",
        accessorKey: "monthRevenue",
        cell: ({ row }) => formatMad(row.original.monthRevenue),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Link
              href={adminPaths.artisans(row.original.id)}
              className="rounded border px-2 py-0.5 text-xs hover:bg-slate-50"
            >
              Voir
            </Link>
            {row.original.kycStatus === "PENDING" && (
              <Link href={adminPaths.kyc} className="text-xs text-orange hover:underline">
                KYC
              </Link>
            )}
          </div>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    getRowId: (r) => r.id,
    enableMultiSort: true,
  });

  const exportSelection = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    const rows = (selected.length > 0 ? selected : items).map((a) => ({
      nom: `${a.firstName} ${a.lastName}`,
      email: a.user.email,
      kyc: a.kycStatus,
      note: a.rating,
      missions: a.totalMissions,
      revenus_mois: a.monthRevenue,
      abonnement: a.subscriptionTier,
    }));
    exportRowsToCsv(rows, `artisans-${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Recherche nom, email, téléphone…"
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select value={kyc} onChange={(e) => setKyc(e.target.value)} className="rounded-lg border px-3 py-2 text-sm">
          <option value="">KYC — tous</option>
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Spécialité"
          className="w-32 rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ville"
          className="w-28 rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={ratingMin}
          onChange={(e) => setRatingMin(e.target.value)}
          placeholder="Note min"
          type="number"
          min={0}
          max={5}
          step={0.1}
          className="w-24 rounded-lg border px-3 py-2 text-sm"
        />
        <select
          value={subscription}
          onChange={(e) => setSubscription(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Abonnement</option>
          {["STANDARD", "PREMIUM", "PRO"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={exportSelection}
          className="flex items-center gap-1 rounded-lg border bg-white px-3 py-2 text-sm hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {isFetching && <p className="text-xs text-slate-400">Actualisation…</p>}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-slate-50 text-left text-xs text-slate-500">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-3 py-2">
                    {h.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={h.column.getCanSort() ? "flex items-center gap-1 hover:text-slate-800" : ""}
                        onClick={h.column.getToggleSortingHandler()}
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {{ asc: " ↑", desc: " ↓" }[h.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  Chargement…
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-400">
                  Aucun artisan
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">
        {data?.total ?? data?.items.length ?? 0} artisans — {Object.keys(rowSelection).length} sélectionné(s)
      </p>
    </div>
  );
}
