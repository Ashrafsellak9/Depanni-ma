"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { formatMad } from "@/lib/utils";
import { adminPaths } from "@/lib/adminPaths";
import { fetchDisputes } from "@/services/adminApi";
import type { DisputeListItem } from "@/types/moderation";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function DisputesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: fetchDisputes,
  });

  const items = data ?? [];

  if (isLoading) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs text-slate-500">
            <th className="px-4 py-2">Priorité</th>
            <th className="px-4 py-2">Mission</th>
            <th className="px-4 py-2">Montant</th>
            <th className="px-4 py-2">Âge</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Parties</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                Aucun litige ouvert
              </td>
            </tr>
          ) : (
            items.map((d: DisputeListItem) => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      d.priorityScore > 500 ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {d.priorityScore}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Link href={adminPaths.litiges(d.id)} className="font-medium text-orange hover:underline">
                    {d.job.title}
                  </Link>
                  <p className="text-xs text-slate-400">{d.job.city}</p>
                </td>
                <td className="px-4 py-2 font-medium">{formatMad(d.amount)}</td>
                <td className="px-4 py-2">{d.ageHours}h</td>
                <td className="px-4 py-2">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-2 text-xs">
                  {d.citizen.firstName} {d.citizen.lastName}
                  <br />
                  vs {d.artisan.firstName} {d.artisan.lastName}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
