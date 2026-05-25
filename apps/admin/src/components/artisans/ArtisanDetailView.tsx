"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useState } from "react";

import { adminPaths } from "@/lib/adminPaths";
import toast from "react-hot-toast";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMad } from "@/lib/utils";
import {
  banArtisan,
  fetchArtisan,
  reactivateArtisan,
  resetArtisanRating,
  sendArtisanMessage,
  suspendArtisan,
  upgradeArtisanSubscription,
} from "@/services/adminApi";

const TABS = ["Profil", "Missions", "Revenus", "Documents", "Litiges", "Activité", "Chat"] as const;

interface ArtisanDetail {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  specialties: string[];
  kycStatus: string;
  rating: number;
  totalMissions: number;
  subscriptionTier: string;
  availabilityStatus: string;
  monthRevenue: number;
  cinNumber?: string;
  zones: string[];
  user: { email: string; phone: string; accountStatus: string; createdAt: string };
  wallet?: { balance: number };
  kycDocuments: Record<string, string>;
  missions: Array<{
    id: string;
    status: string;
    totalAmount: number;
    artisanNet: number;
    job: { title: string; city: string; photos: string[] };
    payments: Array<{ id: string; status: string; amount: number }>;
  }>;
  walletTx: Array<{ type: string; amount: number; description?: string; createdAt: string }>;
  payments: Array<{ id: string; amount: number; status: string }>;
  auditLog: Array<{ id: string; action: string; actorId: string; metadata: unknown; createdAt: string }>;
  adminMessages: Array<{ metadata: { content?: string }; createdAt: string; actorId: string }>;
}

export function ArtisanDetailView({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profil");
  const [message, setMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "artisan", id],
    queryFn: async () => (await fetchArtisan(id)) as unknown as ArtisanDetail,
  });

  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin", "artisan", id] });

  if (isLoading || !data) return <p className="text-slate-500">Chargement…</p>;

  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      toast.success(msg);
      refresh();
    } catch {
      toast.error("Action échouée");
    }
  };

  return (
    <div className="space-y-6">
      <Link href={adminPaths.artisans()} className="text-sm font-medium text-orange hover:underline">
        ← Artisans
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {data.firstName} {data.lastName}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={data.kycStatus} />
            <StatusBadge status={data.availabilityStatus} />
            <StatusBadge status={data.user.accountStatus} />
            <span className="text-sm text-slate-500">{data.subscriptionTier}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.user.accountStatus !== "ACTIVE" ? (
            <button
              type="button"
              onClick={() => run(() => reactivateArtisan(id), "Compte réactivé")}
              className="rounded border px-3 py-1.5 text-sm text-emerald-700"
            >
              Réactiver
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => run(() => suspendArtisan(id), "Compte suspendu")}
                className="rounded border px-3 py-1.5 text-sm"
              >
                Suspendre
              </button>
              <button
                type="button"
                onClick={() => run(() => banArtisan(id), "Compte banni")}
                className="rounded border border-red-200 px-3 py-1.5 text-sm text-red-700"
              >
                Bannir
              </button>
            </>
          )}
          <select
            defaultValue={data.subscriptionTier}
            onChange={(e) => run(() => upgradeArtisanSubscription(id, e.target.value), "Abonnement mis à jour")}
            className="rounded border px-2 py-1.5 text-sm"
          >
            {["STANDARD", "PREMIUM", "PRO"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => run(() => resetArtisanRating(id), "Note réinitialisée")}
            className="rounded border px-3 py-1.5 text-sm"
          >
            Réinit. note
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t ? "border-b-2 border-indigo-600 text-indigo-600" : "text-slate-500"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profil" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4 text-sm">
            <p>
              <strong>Email :</strong> {data.user.email}
            </p>
            <p>
              <strong>Tél :</strong> {data.user.phone}
            </p>
            <p>
              <strong>Inscription :</strong>{" "}
              {format(new Date(data.user.createdAt), "PPP", { locale: fr })}
            </p>
            <p>
              <strong>Zones :</strong> {data.zones.join(", ") || "—"}
            </p>
            <p>
              <strong>Note :</strong> ★ {data.rating.toFixed(1)} · {data.totalMissions} missions
            </p>
            <p>
              <strong>Revenus mois :</strong> {formatMad(data.monthRevenue)}
            </p>
            {data.wallet && (
              <p>
                <strong>Solde wallet :</strong> {formatMad(data.wallet.balance)}
              </p>
            )}
          </div>
          {data.bio && (
            <div className="rounded-lg border bg-white p-4 text-sm">
              <strong>Bio</strong>
              <p className="mt-2 text-slate-600">{data.bio}</p>
            </div>
          )}
        </div>
      )}

      {tab === "Missions" && (
        <ul className="space-y-2">
          {data.missions.map((m) => (
            <li key={m.id} className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 text-sm">
              <div>
                <Link href={adminPaths.missions(m.id)} className="font-medium text-orange hover:underline">
                  {m.job.title}
                </Link>
                <span className="ml-2 text-slate-400">
                  {m.job.city} — <StatusBadge status={m.status} />
                </span>
              </div>
              <span className="font-medium">{formatMad(m.artisanNet)}</span>
            </li>
          ))}
        </ul>
      )}

      {tab === "Revenus" && (
        <div className="space-y-2">
          <p className="text-lg font-bold">{formatMad(data.monthRevenue)} ce mois</p>
          {data.walletTx.map((tx) => (
            <div key={tx.createdAt + tx.amount} className="flex justify-between rounded border bg-white px-4 py-2 text-sm">
              <span>
                {tx.type} — {tx.description ?? ""}
              </span>
              <span className={tx.amount >= 0 ? "text-emerald-600" : "text-red-600"}>
                {formatMad(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "Documents" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(data.kycDocuments).map(([k, url]) => (
            <div key={k} className="rounded-lg border p-4">
              <p className="text-xs font-bold uppercase text-slate-500">{k}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={k} className="mt-2 max-h-64 rounded object-contain" />
            </div>
          ))}
        </div>
      )}

      {tab === "Litiges" && (
        <ul className="space-y-2">
          {data.payments.length === 0 ? (
            <p className="text-slate-400">Aucun litige</p>
          ) : (
            data.payments.map((p) => (
              <li key={p.id}>
                <Link href={adminPaths.litiges(p.id)} className="text-orange hover:underline">
                  Paiement {p.id.slice(0, 8)}… — {formatMad(p.amount)} — {p.status}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}

      {tab === "Activité" && (
        <ul className="space-y-2 border-l-2 border-indigo-100 pl-4">
          {data.auditLog.map((log) => (
            <li key={log.id} className="text-sm">
              <span className="font-medium">{log.action}</span>
              <span className="ml-2 text-slate-400">
                {format(new Date(log.createdAt), "PPpp", { locale: fr })}
              </span>
              {log.metadata != null && (
                <pre className="mt-1 max-w-xl overflow-x-auto rounded bg-slate-50 p-2 text-xs text-slate-600">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </li>
          ))}
        </ul>
      )}

      {tab === "Chat" && (
        <div className="max-w-xl space-y-4">
          <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border bg-slate-50 p-4">
            {data.adminMessages.length === 0 ? (
              <p className="text-sm text-slate-400">Aucun message admin</p>
            ) : (
              data.adminMessages.map((m, i) => (
                <div key={i} className="rounded bg-white p-3 text-sm shadow-sm">
                  <p>{(m.metadata as { content?: string })?.content}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {format(new Date(m.createdAt), "PPp", { locale: fr })}
                  </p>
                </div>
              ))
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!message.trim()) return;
              run(() => sendArtisanMessage(id, message), "Message envoyé").then(() => setMessage(""));
            }}
            className="flex gap-2"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message à l'artisan (email + journal)"
              className="flex-1 rounded-lg border px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
