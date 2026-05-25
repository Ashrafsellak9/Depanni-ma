"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { approveKyc, fetchKycPending, rejectKyc } from "@/services/adminApi";
import type { KycPendingItem } from "@/types/admin";

export default function KycQueuePage() {
  const queryClient = useQueryClient();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ reason: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "kyc-pending"],
    queryFn: () => fetchKycPending(1),
  });

  const items = (data?.items ?? []) as KycPendingItem[];

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin"] });

  const onApprove = async (id: string) => {
    try {
      await approveKyc(id);
      toast.success("Approuvé");
      refresh();
    } catch {
      toast.error("Erreur");
    }
  };

  const onReject = handleSubmit(async ({ reason }) => {
    if (!rejectId) return;
    try {
      await rejectKyc(rejectId, reason);
      toast.success("Refusé");
      setRejectId(null);
      reset();
      refresh();
    } catch {
      toast.error("Erreur");
    }
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">File d&apos;attente KYC</h2>
      {isLoading ? (
        <p className="text-slate-500">Chargement…</p>
      ) : items.length === 0 ? (
        <p className="text-slate-500">Aucun dossier en attente</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a) => (
            <div key={a.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h3 className="font-semibold">
                {a.firstName} {a.lastName}
              </h3>
              <p className="text-sm text-slate-500">{a.user.email}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(a.kycDocuments ?? {}).map(([k, url]) => (
                  <a
                    key={k}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 underline"
                  >
                    {k}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(a.id)}
                  className="rounded bg-emerald-600 px-3 py-1.5 text-sm text-white"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  onClick={() => setRejectId(a.id)}
                  className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-700"
                >
                  Refuser
                </button>
              </div>
              {rejectId === a.id && (
                <form onSubmit={onReject} className="mt-3 space-y-2">
                  <input
                    {...register("reason", { required: true })}
                    className="w-full rounded border px-2 py-1 text-sm"
                    placeholder="Motif"
                  />
                  <button type="submit" className="text-sm text-red-600">
                    Confirmer
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
