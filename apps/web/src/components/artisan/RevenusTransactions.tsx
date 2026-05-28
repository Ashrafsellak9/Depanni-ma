"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronDown, CreditCard, Download, Wrench } from "lucide-react";

import type { RevenusTransaction } from "@/components/artisan/artisanRevenusMock";
import { TRANSACTIONS } from "@/components/artisan/artisanRevenusMock";

const VISIBLE_INITIAL = 5;

function filterByType(tx: RevenusTransaction, typeFilter: string) {
  if (typeFilter === "all") return true;
  if (typeFilter === "missions") return tx.type === "mission";
  if (typeFilter === "virements") return tx.type === "virement";
  if (typeFilter === "commissions") return tx.type === "abonnement";
  return true;
}

export function RevenusTransactions() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(VISIBLE_INITIAL);

  const filtered = useMemo(
    () => TRANSACTIONS.filter((tx) => filterByType(tx, typeFilter)),
    [typeFilter],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="rounded-2xl border border-dep-border bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-navy">Historique des transactions</h3>
        <div className="flex flex-wrap gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setVisibleCount(VISIBLE_INITIAL);
            }}
            className="cursor-pointer rounded-xl border border-dep-border bg-white px-3 py-2 text-[12px] text-navy outline-none"
          >
            <option value="all">Tout afficher</option>
            <option value="missions">Missions uniquement</option>
            <option value="virements">Virements</option>
            <option value="commissions">Commissions</option>
          </select>
          <select className="cursor-pointer rounded-xl border border-dep-border bg-white px-3 py-2 text-[12px] text-navy outline-none">
            <option>Ce mois</option>
            <option>Mois dernier</option>
            <option>3 derniers mois</option>
          </select>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-dep-border bg-white px-3 py-2 text-[12px] text-navy transition-colors hover:bg-cream"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-dep-gray">Aucune transaction pour ce filtre</p>
      ) : (
        <>
          <div>
            {visible.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + 5)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dep-border bg-cream py-3 text-[13px] text-dep-gray transition-colors hover:bg-[#F0EBE1]"
            >
              <ChevronDown size={15} />
              Voir plus de transactions
            </button>
          )}
        </>
      )}
    </div>
  );
}

function TransactionRow({ tx }: { tx: RevenusTransaction }) {
  const iconBg =
    tx.type === "mission"
      ? "bg-orange/10"
      : tx.type === "virement"
        ? "bg-green/10"
        : "bg-dep-gray/10";

  return (
    <div className="-mx-5 flex items-center gap-4 border-b border-dep-border/50 px-5 py-4 transition-colors last:border-0 hover:bg-cream">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        {tx.type === "mission" && <Wrench size={16} className="text-orange" />}
        {tx.type === "virement" && <Building2 size={16} className="text-green" />}
        {tx.type === "abonnement" && <CreditCard size={16} className="text-dep-gray" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-navy">{tx.title}</div>
        <div className="mt-0.5 text-[11px] text-dep-gray">{tx.subtitle}</div>
        <div className="mt-0.5 text-[10px] text-[#9CA3AF]">{tx.date}</div>
      </div>

      {tx.status && (
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
            tx.status === "completed"
              ? "bg-green/10 text-green"
              : "bg-orange/10 text-orange"
          }`}
        >
          {tx.status === "completed" ? "✓ Reçu" : "⏳ En attente"}
        </span>
      )}

      <div
        className={`shrink-0 font-syne text-[16px] font-bold ${
          tx.amount > 0 ? "text-green" : "text-dep-red"
        }`}
      >
        {tx.amount > 0 ? "+" : ""}
        {tx.amount.toLocaleString("fr-FR")} MAD
      </div>
    </div>
  );
}
