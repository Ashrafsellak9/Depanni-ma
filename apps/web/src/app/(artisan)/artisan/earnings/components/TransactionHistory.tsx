"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { WalletTransaction } from "@/types/artisan";

const PAGE_SIZE = 10;

interface TransactionHistoryProps {
  transactions?: WalletTransaction[];
  isLoading?: boolean;
}

function toCsv(rows: WalletTransaction[]): string {
  const header = "Date,Type,Montant,Solde après,Description";
  const lines = rows.map((t) =>
    [
      t.createdAt,
      t.type,
      t.amount,
      t.balanceAfter,
      (t.description ?? "").replace(/,/g, " "),
    ].join(","),
  );
  return [header, ...lines].join("\n");
}

export function TransactionHistory({ transactions = [], isLoading }: TransactionHistoryProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, page]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(transactions)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `depanni-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={!transactions.length}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Solde</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Aucune transaction.
                </td>
              </tr>
            ) : (
              pageItems.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(t.createdAt), "d MMM yyyy HH:mm", { locale: fr })}
                  </td>
                  <td className="px-4 py-3">{t.type}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      t.amount >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    {t.amount} MAD
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                    {t.balanceAfter} MAD
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}
