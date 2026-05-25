"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMad } from "@/lib/utils";
import type { AdminMissionRow } from "@/types/admin";

export function MissionsTable({
  title,
  missions,
}: {
  title: string;
  missions: AdminMissionRow[];
}) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-4 py-2">Mission</th>
              <th className="px-4 py-2">Ville</th>
              <th className="px-4 py-2">Artisan</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Montant</th>
            </tr>
          </thead>
          <tbody>
            {missions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Aucune mission
                </td>
              </tr>
            ) : (
              missions.map((m) => (
                <tr key={m.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-2">
                    <Link href={`/missions/${m.id}`} className="font-medium text-indigo-600 hover:underline">
                      {m.job.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-slate-600">{m.job.city}</td>
                  <td className="px-4 py-2">
                    {m.artisan.firstName} {m.artisan.lastName}
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-4 py-2 font-medium">{formatMad(m.totalAmount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
