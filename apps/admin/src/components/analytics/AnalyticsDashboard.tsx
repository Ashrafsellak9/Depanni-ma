"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PeriodSelector } from "@/components/analytics/PeriodSelector";
import { formatMad } from "@/lib/utils";
import { fetchAnalytics, type PeriodParams } from "@/services/adminApi";
import type { AnalyticsPeriod } from "@/types/analytics";

const PIE_COLORS = ["#1e3a5f", "#3b82f6", "#60a5fa", "#93c5fd", "#f59e0b", "#10b981", "#8b5cf6"];

export function AnalyticsDashboard() {
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
    queryKey: ["admin", "analytics", params],
    queryFn: () => fetchAnalytics(params),
  });

  const handlePeriod = (p: AnalyticsPeriod, f?: string, t?: string) => {
    setPeriod(p);
    if (f !== undefined) setFrom(f);
    if (t !== undefined) setTo(t);
  };

  if (isLoading || !data) {
    return <p className="text-slate-500">Chargement analytics…</p>;
  }

  const gmvChart = data.gmvByDay.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "d MMM", { locale: fr }),
  }));

  const funnelSteps = [
    { name: "Demandes", value: data.funnel.jobsCreated, fill: "#94a3b8" },
    { name: "Offres reçues", value: data.funnel.jobsWithOffers, fill: "#60a5fa" },
    { name: "Acceptées", value: data.funnel.missionsAccepted, fill: "#3b82f6" },
    { name: "Complétées", value: data.funnel.missionsCompleted, fill: "#10b981" },
  ];

  return (
    <div className="space-y-8">
      <PeriodSelector period={period} from={from} to={to} onChange={handlePeriod} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "GMV total", value: formatMad(data.metrics.gmvTotal), sub: `${data.metrics.gmvGrowth >= 0 ? "+" : ""}${data.metrics.gmvGrowth}%` },
          { label: "Revenus DEPANNI", value: formatMad(data.metrics.depanniRevenue) },
          { label: "Missions créées", value: String(data.metrics.missionsCreated) },
          { label: "Complétées / Annulées", value: `${data.metrics.missionsCompleted} / ${data.metrics.missionsCancelled}` },
          { label: "Taux complétion", value: `${data.metrics.completionRate}%` },
          { label: "Demandes (jobs)", value: String(data.metrics.jobsCreated) },
          { label: "Inscriptions", value: String(data.metrics.newSignups) },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{m.label}</p>
            <p className="text-xl font-bold text-slate-900">{m.value}</p>
            {m.sub && <p className="text-xs text-emerald-600">{m.sub}</p>}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">GMV par jour</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v} MAD`, ""]} />
                <Area type="monotone" dataKey="gmv" stroke="#1e3a5f" fill="#3b82f6" fillOpacity={0.3} name="GMV" />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Revenus" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="mb-4 font-semibold">Missions par catégorie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.missionsByCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={90} label>
                  {data.missionsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-semibold">Croissance inscriptions</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.signupsByDay.slice(-30)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => format(parseISO(v), "d/M")} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="citizens" stackId="a" fill="#3b82f6" name="Citoyens" />
              <Bar dataKey="artisans" stackId="a" fill="#10b981" name="Artisans" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-semibold">Heatmap horaires — demandes</h3>
        <p className="mb-4 text-xs text-slate-500">Intensité des créations de jobs (jour × heure)</p>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="p-1" />
                {data.hourlyHeatmap.labels.hours.filter((_, i) => i % 3 === 0).map((h) => (
                  <th key={h} className="p-1 text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.hourlyHeatmap.grid.map((row, dow) => (
                <tr key={dow}>
                  <td className="pr-2 font-medium text-slate-500">{data.hourlyHeatmap.labels.days[dow]}</td>
                  {row.map((count, hour) => {
                    if (hour % 3 !== 0) return null;
                    const intensity = count / data.hourlyHeatmap.max;
                    return (
                      <td key={hour} className="p-0.5">
                        <div
                          className="h-5 w-8 rounded"
                          style={{
                            backgroundColor: `rgba(30, 58, 95, ${0.1 + intensity * 0.9})`,
                          }}
                          title={`${count} demandes`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-semibold">Funnel conversion</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelSteps} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={4}>
                {funnelSteps.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {(
          [
            ["Par revenu", data.topArtisans.byRevenue, "revenue"],
            ["Par missions", data.topArtisans.byMissions, "totalMissions"],
            ["Par note", data.topArtisans.byRating, "rating"],
          ] as const
        ).map(([title, list, key]) => (
          <div key={title} className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-3 font-semibold">Top 10 — {title}</h3>
            <ol className="space-y-2 text-sm">
              {list.map((a, i) => (
                <li key={a.id} className="flex justify-between">
                  <span>
                    {i + 1}.{" "}
                    <Link href={`/artisans/${a.id}`} className="text-indigo-600 hover:underline">
                      {a.firstName} {a.lastName}
                    </Link>
                  </span>
                  <span className="font-medium text-slate-700">
                    {key === "revenue"
                      ? formatMad((a as { revenue: number }).revenue)
                      : key === "rating"
                        ? `★ ${a.rating.toFixed(1)}`
                        : a.totalMissions}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">KPIs vs objectifs</h3>
        <div className="space-y-4">
          {data.goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div key={g.key}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{g.label}</span>
                  <span className="text-slate-500">
                    {g.current.toLocaleString("fr-MA")} / {g.target.toLocaleString("fr-MA")} ({pct}%)
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : "bg-indigo-600"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
