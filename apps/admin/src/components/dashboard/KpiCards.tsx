"use client";

import { Activity, Briefcase, Star, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { formatMad } from "@/lib/utils";
import type { AdminKpis } from "@/types/admin";

const items = [
  { key: "missionsToday" as const, label: "Missions aujourd'hui", icon: Briefcase, format: (v: number) => String(v) },
  { key: "gmvToday" as const, label: "GMV jour", icon: Wallet, format: formatMad },
  { key: "activeArtisans" as const, label: "Artisans actifs", icon: Users, format: (v: number) => String(v) },
  { key: "satisfaction" as const, label: "Satisfaction", icon: Star, format: (v: number) => `${v}/5` },
];

export function KpiCards({ kpis, live }: { kpis: AdminKpis; live?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, label, icon: Icon, format }) => (
        <Card key={key} className="relative overflow-hidden border-slate-200 shadow-sm">
          {live && (
            <span className="absolute right-3 top-3 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          )}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">{label}</CardTitle>
            <Icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{format(kpis[key])}</p>
          </CardContent>
        </Card>
      ))}
      <Card className="border-slate-200 shadow-sm sm:col-span-2 xl:col-span-4">
        <CardContent className="flex flex-wrap gap-6 py-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            {kpis.missionsInProgress} missions en cours
          </span>
          <span>{kpis.kycPending} KYC en attente</span>
          <span className="text-red-600">{kpis.disputesOpen} litiges ouverts</span>
        </CardContent>
      </Card>
    </div>
  );
}
