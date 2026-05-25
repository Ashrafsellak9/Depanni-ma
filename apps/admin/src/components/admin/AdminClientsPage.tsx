"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AvatarCell } from "@/components/admin/AvatarCell";
import { useDebounce } from "@/hooks/useDebounce";
import { avatarColor, initials } from "@/lib/adminMappers";
import { fetchClients } from "@/services/adminApi";

interface ClientRow {
  id: string;
  firstName: string;
  lastName: string;
  user: { email: string; phone: string; isVerified: boolean; createdAt: string };
  _count: { jobs: number };
}

export function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "clients", debounced, page],
    queryFn: () => fetchClients(page),
  });

  const items = (data?.items ?? []) as unknown as ClientRow[];
  const filtered = useMemo(() => {
    if (!debounced) return items;
    const q = debounced.toLowerCase();
    return items.filter(
      (c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.user.email.toLowerCase().includes(q) ||
        c.user.phone.includes(q),
    );
  }, [items, debounced]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dep-gray" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher client, email, téléphone..."
          className="h-10 w-full rounded-xl border border-dep-border bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-orange/30"
        />
      </div>

      {isError && (
        <p className="text-sm text-dep-red">Impossible de charger les clients.</p>
      )}

      <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Client", "Email", "Téléphone", "Demandes", "Vérifié"].map((h) => (
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
                  <td colSpan={5} className="px-3 py-8 text-center text-dep-gray">
                    Chargement…
                  </td>
                </tr>
              )}
              {!isLoading &&
                filtered.map((c) => {
                  const name = `${c.firstName} ${c.lastName}`;
                  return (
                    <tr key={c.id} className="hover:bg-cream">
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <AvatarCell initials={initials(c.firstName, c.lastName)} color={avatarColor(c.id)} />
                          <span className="font-medium text-navy">{name}</span>
                        </div>
                      </td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{c.user.email}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{c.user.phone}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">{c._count.jobs}</td>
                      <td className="border-b border-dep-border/50 px-3 py-2.5">
                        {c.user.isVerified ? "Oui" : "Non"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 border-t border-dep-border px-4 py-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg px-3 py-1 text-sm disabled:opacity-40"
            >
              Précédent
            </button>
            <span className="text-sm text-dep-gray">
              {page} / {data.pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg px-3 py-1 text-sm disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
