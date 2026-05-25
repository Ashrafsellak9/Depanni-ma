"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { AvatarCell } from "@/components/admin/AvatarCell";
import { StatusPill } from "@/components/admin/StatusPill";
import {
  avatarColor,
  formatMadSpaced,
  initials,
  mapMissionStatus,
} from "@/lib/adminMappers";
import { adminPaths } from "@/lib/adminPaths";
import { fetchMissions } from "@/services/adminApi";
import type { AdminMissionRow } from "@/types/admin";

export function AdminMissionsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "missions", status, search],
    queryFn: () =>
      fetchMissions({
        status: status || undefined,
        search: search || undefined,
        limit: 50,
      }),
  });

  const items = useMemo(() => (data?.items ?? []) as AdminMissionRow[], [data]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher mission, client, artisan..."
            className="h-10 w-full rounded-xl border border-dep-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm"
        >
          <option value="">Statut — Tous</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminée</option>
          <option value="ACCEPTED">Acceptée</option>
          <option value="CANCELLED">Annulée</option>
          <option value="DISPUTED">Litige</option>
        </select>
        <select className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm" disabled>
          <option>Période — Toutes</option>
        </select>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-dep-border bg-white px-4 text-sm font-medium text-navy hover:bg-cream"
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </button>
      </div>

      {isError && (
        <p className="text-sm text-dep-red">Impossible de charger les missions. Vérifiez l&apos;API.</p>
      )}

      <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {[
                  "Mission ID",
                  "Client",
                  "Service",
                  "Artisan",
                  "Montant",
                  "Commission",
                  "Statut",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="border-b border-dep-border px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-dep-gray"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-dep-gray">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading &&
                items.map((m) => {
                  const clientName = `${m.citizen.firstName} ${m.citizen.lastName}`;
                  const av = initials(m.citizen.firstName, m.citizen.lastName);
                  const artisanName =
                    m.artisan?.firstName != null
                      ? `${m.artisan.firstName} ${m.artisan.lastName ?? ""}`.trim()
                      : "—";
                  const commission = m.totalAmount
                    ? formatMadSpaced(Math.round(m.totalAmount * 0.15))
                    : "—";
                  return (
                    <tr key={m.id} className="hover:bg-cream">
                      <td className="border-b border-dep-border/50 px-3 py-2.5 font-mono text-xs text-dep-gray">
                        #{m.id.slice(0, 8)}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <AvatarCell initials={av} color={avatarColor(clientName)} />
                          <span className="font-medium">{clientName}</span>
                        </div>
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{m.job.title}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{artisanName}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5 font-syne font-bold">
                        {formatMadSpaced(m.totalAmount)}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{commission}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <StatusPill status={mapMissionStatus(m.status)} />
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5 text-dep-gray">
                        {format(new Date(m.createdAt), "dd/MM HH:mm", { locale: fr })}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <Link
                          href={adminPaths.missions(m.id)}
                          className="inline-block rounded-md border border-dep-border bg-cream px-2.5 py-1 text-[11px] font-medium hover:bg-cream-2"
                        >
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-dep-gray">
                    Aucune mission trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-dep-border px-4 py-3 text-sm">
            <span className="text-dep-gray">
              Page {data.pagination.page} / {data.pagination.totalPages} ({data.pagination.total}{" "}
              missions)
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
