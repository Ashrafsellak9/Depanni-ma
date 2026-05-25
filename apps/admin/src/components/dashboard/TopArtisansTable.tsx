"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { StatusBadge } from "@/components/ui/StatusBadge";
import type { TopArtisan } from "@/types/admin";

export function TopArtisansTable({ artisans }: { artisans: TopArtisan[] }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Top artisans du mois</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Artisan</th>
              <th className="px-4 py-2">Missions</th>
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map((a, i) => (
              <tr key={a.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2 font-bold text-slate-400">{i + 1}</td>
                <td className="px-4 py-2">
                  <Link href={`/artisans/${a.id}`} className="text-indigo-600 hover:underline">
                    {a.firstName} {a.lastName}
                  </Link>
                </td>
                <td className="px-4 py-2">{a.totalMissions}</td>
                <td className="px-4 py-2">★ {a.rating.toFixed(1)}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={a.availabilityStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
