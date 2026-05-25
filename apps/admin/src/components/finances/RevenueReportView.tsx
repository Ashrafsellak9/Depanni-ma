"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { formatMad } from "@/lib/utils";
import { exportRevenuePdf, exportTransactionsXlsx } from "@/lib/exportReports";
import {
  fetchRevenueReport,
  fetchTransactionsExport,
  type PeriodParams,
} from "@/services/adminApi";
import type { AnalyticsPeriod } from "@/types/analytics";

export function RevenueReportView() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const params = useMemo<PeriodParams>(() => {
    const p: PeriodParams = { period };
    if (period === "custom" && from && to) {
      p.from = new Date(from).toISOString();
      p.to = new Date(to + "T23:59:59").toISOString();
    }
    return p;
  }, [period, from, to]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "revenue", params],
    queryFn: () => fetchRevenueReport(params),
  });

  const exportXlsx = async () => {
    try {
      const tx = await fetchTransactionsExport(params);
      exportTransactionsXlsx(tx);
      toast.success("Excel exporté");
    } catch {
      toast.error("Export échoué");
    }
  };

  const exportPdf = () => {
    if (!data) return;
    exportRevenuePdf(data, "Rapport revenus");
    toast.success("PDF généré");
  };

  if (isLoading || !data) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PeriodSelector
          period={period}
          from={from}
          to={to}
          onChange={(p, f, t) => {
            setPeriod(p);
            if (f !== undefined) setFrom(f);
            if (t !== undefined) setTo(t);
          }}
        />
        <div className="flex gap-2">
          <button type="button" onClick={exportXlsx} className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">
            Export Excel
          </button>
          <button type="button" onClick={exportPdf} className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50">
            Rapport PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">GMV période</p>
          <p className="text-2xl font-bold">{formatMad(data.summary.gmv)}</p>
          <p className="text-xs text-emerald-600">{data.summary.gmvGrowth >= 0 ? "+" : ""}{data.summary.gmvGrowth}%</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs text-slate-500">Revenu DEPANNI</p>
          <p className="text-2xl font-bold">{formatMad(data.summary.depanniRevenue)}</p>
          <p className="text-xs text-slate-500">Commission moy. {(data.summary.avgCommissionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border bg-indigo-50 p-4">
          <p className="text-xs text-indigo-700">Projection fin de mois</p>
          <p className="text-lg font-bold text-indigo-900">GMV {formatMad(data.projection.projectedGmv)}</p>
          <p className="text-sm text-indigo-800">Revenus {formatMad(data.projection.projectedRevenue)}</p>
          <p className="text-xs text-indigo-600">
            Jour {data.projection.daysElapsed}/{data.projection.daysInMonth} (extrapolation linéaire)
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-2">Période</th>
              <th className="px-4 py-2">GMV</th>
              <th className="px-4 py-2">Revenu DEPANNI</th>
              <th className="px-4 py-2">Taux moy.</th>
              <th className="px-4 py-2">Croissance</th>
            </tr>
          </thead>
          <tbody>
            {data.periods.map((p) => (
              <tr key={p.start} className="border-b">
                <td className="px-4 py-2">{p.label}</td>
                <td className="px-4 py-2 font-medium">{formatMad(p.gmv)}</td>
                <td className="px-4 py-2">{formatMad(p.revenue)}</td>
                <td className="px-4 py-2">{(p.avgRate * 100).toFixed(1)}%</td>
                <td className="px-4 py-2">—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 font-semibold">Détail par catégorie</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="pb-2">Catégorie</th>
              <th className="pb-2">GMV</th>
              <th className="pb-2">Revenu</th>
              <th className="pb-2">Missions</th>
            </tr>
          </thead>
          <tbody>
            {data.byCategory.map((c) => (
              <tr key={c.category} className="border-t">
                <td className="py-2 capitalize">{c.category}</td>
                <td className="py-2">{formatMad(c.gmv)}</td>
                <td className="py-2">{formatMad(c.revenue)}</td>
                <td className="py-2">{c.missions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
