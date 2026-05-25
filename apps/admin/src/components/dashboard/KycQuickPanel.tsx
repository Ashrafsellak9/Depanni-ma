"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { approveKyc, rejectKyc } from "@/services/adminApi";
import type { KycPendingItem } from "@/types/admin";

export function KycQuickPanel({
  items,
  onUpdated,
}: {
  items: KycPendingItem[];
  onUpdated: () => void;
}) {
  const [rejectId, setRejectId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ reason: string }>();

  const onApprove = async (id: string) => {
    try {
      await approveKyc(id);
      toast.success("KYC approuvé");
      onUpdated();
    } catch {
      toast.error("Échec de l'approbation");
    }
  };

  const onReject = handleSubmit(async ({ reason }) => {
    if (!rejectId) return;
    try {
      await rejectKyc(rejectId, { reason });
      toast.success("KYC refusé");
      setRejectId(null);
      reset();
      onUpdated();
    } catch {
      toast.error("Échec du refus");
    }
  });

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">KYC en attente</CardTitle>
        <Link href="/artisans/kyc" className="text-xs text-indigo-600 hover:underline">
          Voir tout
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun dossier en attente</p>
        ) : (
          items.map((a) => (
            <div key={a.id} className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium text-slate-900">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-xs text-slate-500">{a.user.email}</p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => onApprove(a.id)}
                  className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Approuver
                </button>
                <button
                  type="button"
                  onClick={() => setRejectId(a.id)}
                  className="rounded border border-red-200 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Refuser
                </button>
              </div>
              {rejectId === a.id && (
                <form onSubmit={onReject} className="mt-2 space-y-2">
                  <input
                    {...register("reason", { required: true })}
                    placeholder="Motif du refus"
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                  <button type="submit" className="text-xs text-red-600 underline">
                    Confirmer le refus
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
