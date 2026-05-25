"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import type { RevenueChartPoint } from "@/types/admin";

export function RevenueChart({ data }: { data: RevenueChartPoint[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "EEE d", { locale: fr }),
  }));

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Revenus — 7 derniers jours</CardTitle>
        <p className="text-xs text-slate-500">Comparaison avec la semaine précédente</p>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v} MAD`, ""]} />
            <Legend />
            <Bar dataKey="amount" name="Cette semaine" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previousAmount" name="Semaine -1" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
