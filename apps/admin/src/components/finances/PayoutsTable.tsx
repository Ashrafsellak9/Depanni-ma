"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMad } from "@/lib/utils";
import { exportPayoutsCsv, exportRevenuePdf } from "@/lib/exportReports";
import { fetchPayouts, fetchRevenueReport, processPendingPayoutsBatch } from "@/services/adminApi";
import type { PayoutRow } from "@/types/analytics";

export function PayoutsTable() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "payouts", statusFilter],
    queryFn: () => fetchPayouts(statusFilter || undefined),
  });

  const items = data?.items ?? [];

  const columns = useMemo<ColumnDef<PayoutRow>[]>(
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
            disabled={row.original.status !== "PENDING"}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        header: "Artisan",
        accessorFn: (r) => `${r.artisan.firstName} ${r.artisan.lastName}`,
      },
      {
        header: "Montant",
        cell: ({ row }) => formatMad(row.original.amount),
      },
      {
        header: "IBAN",
        accessorFn: (r) => r.iban ?? "—",
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.iban ?? row.original.bankName ?? "—"}</span>
        ),
      },
      {
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Date",
        accessorFn: (r) => new Date(r.createdAt).toLocaleString("fr-MA"),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (r) => r.id,
  });

  const processBatch = async () => {
    try {
      const res = await processPendingPayoutsBatch();
      toast.success(`${res.processed}/${res.total} virements traités`);
      void queryClient.invalidateQueries({ queryKey: ["admin", "payouts"] });
      setRowSelection({});
    } catch {
      toast.error("Batch échoué");
    }
  };

  const exportCsv = () => {
    const selected = table.getSelectedRowModel().rows.map((r) => r.original);
    const rows = (selected.length > 0 ? selected : items).map((p) => ({
      artisan: `${p.artisan.firstName} ${p.artisan.lastName}`,
      amount: p.amount,
      iban: p.iban ?? "",
      status: p.status,
      date: p.createdAt,
    }));
    exportPayoutsCsv(rows);
    toast.success("CSV exporté");
  };

  const exportPdfRecap = async () => {
    try {
      const report = await fetchRevenueReport({ period: "30d" });
      exportRevenuePdf(report, "Récap virements & revenus");
      toast.success("PDF généré");
    } catch {
      toast.error("PDF échoué");
    }
  };

  const pendingCount = items.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tous statuts</option>
          {["PENDING", "PROCESSING", "DONE", "FAILED"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={processBatch}
          disabled={pendingCount === 0}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Traiter tous PENDING ({pendingCount})
        </button>
        <button type="button" onClick={exportCsv} className="rounded-lg border px-3 py-2 text-sm">
          Export CSV comptable
        </button>
        <button type="button" onClick={exportPdfRecap} className="rounded-lg border px-3 py-2 text-sm">
          Récap PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-slate-50 text-left text-xs text-slate-500">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-2">
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
