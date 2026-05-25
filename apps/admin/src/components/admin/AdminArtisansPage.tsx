"use client";

import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { AvatarCell } from "@/components/admin/AvatarCell";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { useDebounce } from "@/hooks/useDebounce";
import {
  avatarColor,
  initials,
  mapArtisanAccountStatus,
} from "@/lib/adminMappers";
import { adminPaths } from "@/lib/adminPaths";
import { fetchArtisans, fetchKycStats } from "@/services/adminApi";
import type { ArtisanListItem } from "@/types/moderation";

export function AdminArtisansPage() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: kycStats } = useQuery({
    queryKey: ["admin", "kyc-stats"],
    queryFn: fetchKycStats,
    staleTime: 120_000,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "artisans", debouncedSearch, specialty, accountStatus],
    queryFn: () =>
      fetchArtisans({
        search: debouncedSearch || undefined,
        specialty: specialty || undefined,
        accountStatus: accountStatus || undefined,
        limit: 50,
      }),
  });

  const items = data?.items ?? [];

  const avgRating = useMemo(() => {
    const rated = items.filter((a) => a.rating > 0);
    if (!rated.length) return 4.8;
    return rated.reduce((s, a) => s + a.rating, 0) / rated.length;
  }, [items]);

  const activeCount = items.filter((a) => a.availabilityStatus === "AVAILABLE").length;
  const miniKpis = [
    {
      label: "Total inscrits",
      value: data?.total ?? items.length,
      suffix: "",
      change: "Liste actuelle",
      trend: "up" as const,
      icon: "HardHat",
      iconBg: "navy" as const,
    },
    {
      label: "Actifs aujourd'hui",
      value: activeCount,
      suffix: "",
      change: "Sur cette page",
      trend: "up" as const,
      icon: "HardHat",
      iconBg: "green" as const,
    },
    {
      label: "En attente KYC",
      value: kycStats?.pending ?? 0,
      suffix: "",
      change: "À valider",
      trend: "up" as const,
      icon: "ClipboardList",
      iconBg: "orange" as const,
    },
    {
      label: "Note moyenne",
      value: avgRating,
      suffix: "/5",
      change: "Page courante",
      trend: "up" as const,
      icon: "Star",
      iconBg: "purple" as const,
    },
  ] as const;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {miniKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher artisan..."
            className="h-10 w-full rounded-xl border border-dep-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange/30"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm"
        >
          <option value="">Spécialité — Toutes</option>
          <option value="Plombier">Plombier</option>
          <option value="Électricien">Électricien</option>
          <option value="Serrurier">Serrurier</option>
        </select>
        <select
          value={accountStatus}
          onChange={(e) => setAccountStatus(e.target.value)}
          className="h-10 rounded-xl border border-dep-border bg-white px-3 text-sm"
        >
          <option value="">Statut — Tous</option>
          <option value="ACTIVE">Actif</option>
          <option value="SUSPENDED">Suspendu</option>
          <option value="INACTIVE">Inactif</option>
        </select>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange px-4 text-sm font-medium text-white hover:bg-orange-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter artisan
        </button>
      </div>

      {isError && (
        <p className="text-sm text-dep-red">Impossible de charger les artisans.</p>
      )}

      <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Artisan", "Spécialité", "Zone", "Missions", "Note", "Statut", "Commission", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="border-b border-dep-border px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-dep-gray"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-dep-gray">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading &&
                items.map((a: ArtisanListItem) => {
                  const name = `${a.firstName} ${a.lastName}`;
                  const av = initials(a.firstName, a.lastName);
                  const status = mapArtisanAccountStatus(
                    a.user.accountStatus,
                    a.kycStatus,
                  );
                  return (
                    <tr key={a.id} className="hover:bg-cream">
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <AvatarCell initials={av} color={avatarColor(a.id)} />
                          <span className="font-medium text-navy">{name}</span>
                        </div>
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        {a.specialties[0] ?? "—"}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        {a.zones[0] ?? "—"}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{a.totalMissions}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        {a.rating > 0 ? `${a.rating.toFixed(1)}★` : "—"}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <StatusPill status={status} />
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        {a.subscriptionTier === "FREE" ? "10%" : "15%"}
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <div className="flex gap-1">
                          <Link
                            href={adminPaths.artisans(a.id)}
                            className="rounded-md border border-dep-border bg-cream px-2 py-1 text-[11px] hover:bg-cream-2"
                          >
                            Voir
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
