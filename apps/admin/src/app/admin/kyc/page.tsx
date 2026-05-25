"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { KycReviewCard } from "@/components/kyc/KycReviewCard";
import { KycStatsBar } from "@/components/kyc/KycStatsBar";
import { fetchKycPending, rejectKyc } from "@/services/adminApi";
import type { KycPendingItem } from "@/types/moderation";

export default function AdminKycPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "kyc-pending"],
    queryFn: () => fetchKycPending(1),
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin", "kyc-pending"] });
  const items = (data?.items ?? []) as KycPendingItem[];

  return (
    <div className="space-y-6">
      {data?.stats && (
        <div className="rounded-2xl border border-dep-border bg-white p-4">
          <KycStatsBar stats={data.stats} />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-dep-gray">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-dep-border bg-white p-8 text-center text-sm text-dep-gray">
          Aucun dossier en attente
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((a) => (
            <div key={a.id} className="rounded-2xl border border-dep-border bg-white p-4">
              <KycReviewCard
                artisan={a}
                onUpdated={refresh}
                onReject={async (id, body) => {
                  await rejectKyc(id, body);
                  refresh();
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
