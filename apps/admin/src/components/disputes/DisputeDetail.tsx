"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { formatMad } from "@/lib/utils";
import { fetchDispute, resolveDispute } from "@/services/adminApi";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DisputeDetailData {
  payment: {
    id: string;
    amount: number;
    status: string;
    disputeReason: string | null;
    mission: {
      id: string;
      job: { title: string; city: string; photos: string[]; description: string };
      citizen: { firstName: string; lastName: string; user: { email: string } };
      artisan: { firstName: string; lastName: string; user: { email: string } };
      messages: Array<{
        id: string;
        content: string | null;
        type: string;
        fileUrl: string | null;
        createdAt: string;
        sender: { role: string };
      }>;
    };
    auditLogs: Array<{ action: string; createdAt: string; metadata: unknown }>;
  };
  adminLogs: Array<{ action: string; createdAt: string; metadata: unknown }>;
}

export function DisputeDetail({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [resolution, setResolution] = useState<"REFUND_CLIENT" | "RELEASE_ARTISAN" | "SPLIT">("REFUND_CLIENT");
  const [clientAmount, setClientAmount] = useState("");
  const [artisanAmount, setArtisanAmount] = useState("");
  const [note, setNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dispute", id],
    queryFn: async () => (await fetchDispute(id)) as unknown as DisputeDetailData,
  });

  if (isLoading || !data) return <p className="text-slate-500">Chargement…</p>;

  const { payment } = data;
  const m = payment.mission;

  const onResolve = async () => {
    try {
      await resolveDispute(id, {
        resolution,
        clientAmount: resolution === "SPLIT" ? Number(clientAmount) : undefined,
        artisanAmount: resolution === "SPLIT" ? Number(artisanAmount) : undefined,
        note: note || undefined,
      });
      toast.success("Litige résolu");
      void queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
    } catch {
      toast.error("Échec de la résolution");
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/finances/litiges" className="text-sm text-indigo-600 hover:underline">
        ← Litiges
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{m.job.title}</h2>
          <p className="text-slate-500">{m.job.city}</p>
          <p className="mt-2 text-2xl font-bold">{formatMad(payment.amount)}</p>
          <StatusBadge status={payment.status} />
        </div>
        <Link href={`/missions/${m.id}`} className="text-sm text-indigo-600 hover:underline">
          Voir la mission →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 text-sm">
          <h3 className="font-semibold">Client</h3>
          <p>
            {m.citizen.firstName} {m.citizen.lastName}
          </p>
          <p className="text-slate-500">{m.citizen.user.email}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 text-sm">
          <h3 className="font-semibold">Artisan</h3>
          <p>
            {m.artisan.firstName} {m.artisan.lastName}
          </p>
          <p className="text-slate-500">{m.artisan.user.email}</p>
        </div>
      </div>

      {payment.disputeReason && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Motif :</strong> {payment.disputeReason}
        </p>
      )}

      <section>
        <h3 className="mb-2 font-semibold">Conversation mission</h3>
        <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border bg-slate-50 p-4">
          {m.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded p-2 text-sm ${
                msg.sender.role === "CITIZEN" ? "bg-blue-50" : "bg-white"
              }`}
            >
              <span className="text-xs font-bold uppercase text-slate-400">{msg.sender.role}</span>
              <p>{msg.content ?? `[${msg.type}]`}</p>
              {msg.fileUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={msg.fileUrl} alt="" className="mt-2 max-h-32 rounded" />
              )}
              <p className="text-xs text-slate-400">
                {format(new Date(msg.createdAt), "PPp", { locale: fr })}
              </p>
            </div>
          ))}
        </div>
      </section>

      {m.job.photos.length > 0 && (
        <section>
          <h3 className="mb-2 font-semibold">Preuves / photos job</h3>
          <div className="flex flex-wrap gap-2">
            {m.job.photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt="" className="h-24 rounded border object-cover" />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-white p-6">
        <h3 className="mb-4 font-semibold">Résolution</h3>
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["REFUND_CLIENT", "Rembourser client"],
              ["RELEASE_ARTISAN", "Libérer fonds artisan"],
              ["SPLIT", "Partage (split)"],
            ] as const
          ).map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="resolution"
                value={val}
                checked={resolution === val}
                onChange={() => setResolution(val)}
              />
              {label}
            </label>
          ))}
        </div>
        {resolution === "SPLIT" && (
          <div className="mt-4 flex gap-4">
            <input
              type="number"
              placeholder={`Client (max ${payment.amount})`}
              value={clientAmount}
              onChange={(e) => setClientAmount(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Artisan"
              value={artisanAmount}
              onChange={(e) => setArtisanAmount(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
            />
          </div>
        )}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note interne"
          className="mt-4 w-full rounded border px-3 py-2 text-sm"
          rows={2}
        />
        <button
          type="button"
          onClick={onResolve}
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Confirmer la résolution
        </button>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Historique audit</h3>
        <ul className="space-y-1 text-sm text-slate-600">
          {[...payment.auditLogs, ...data.adminLogs].map((log, i) => (
            <li key={i}>
              {log.action} — {format(new Date(log.createdAt), "PPp", { locale: fr })}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
