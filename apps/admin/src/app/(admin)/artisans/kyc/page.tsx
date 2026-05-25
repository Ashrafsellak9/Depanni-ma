"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { KycReviewCard } from "@/components/kyc/KycReviewCard";
import { KycStatsBar } from "@/components/kyc/KycStatsBar";
import { fetchKycPending, rejectKyc } from "@/services/adminApi";
import type { KycPendingItem } from "@/types/moderation";

export default function KycQueuePage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "kyc-pending"],
    queryFn: () => fetchKycPending(1),
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin", "kyc-pending"] });

  const items = (data?.items ?? []) as KycPendingItem[];
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">File d&apos;attente KYC</h2>
      <p className="text-sm text-slate-500">Triée par date d&apos;inscription (plus ancien en premier)</p>

      {stats && <KycStatsBar stats={stats} />}

      {isLoading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="rounded-lg border bg-white p-8 text-center text-slate-500">Aucun dossier en attente</p>
      ) : (
        <div className="space-y-6">
          {items.map((a) => (
            <KycReviewCard
              key={a.id}
              artisan={a}
              onUpdated={refresh}
              onReject={async (id, body) => {
                await rejectKyc(id, body);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
