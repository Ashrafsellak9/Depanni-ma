"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMad } from "@/lib/utils";
import { fetchMission } from "@/services/adminApi";

interface MissionDetail {
  id: string;
  status: string;
  totalAmount: number;
  commissionAmount: number;
  artisanNet: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  job: { title: string; city: string };
  artisan: { id: string; firstName: string; lastName: string; user?: { email: string } };
  citizen: { firstName: string; lastName: string; user?: { email: string } };
}

export default function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: mission, isLoading } = useQuery({
    queryKey: ["admin", "mission", id],
    queryFn: async () => (await fetchMission(id)) as unknown as MissionDetail,
    enabled: !!id,
  });

  if (isLoading || !mission) {
    return <p className="text-slate-500">Chargement…</p>;
  }

  const timeline = [
    { label: "Créée", at: mission.createdAt },
    mission.startedAt && { label: "Démarrée", at: mission.startedAt },
    mission.completedAt && { label: "Terminée", at: mission.completedAt },
  ].filter(Boolean) as { label: string; at: string }[];

  return (
    <div className="space-y-6">
      <Link href="/missions" className="text-sm text-indigo-600 hover:underline">
        ← Retour aux missions
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{mission.job.title}</h2>
          <p className="text-slate-500">{mission.job.city}</p>
        </div>
        <StatusBadge status={mission.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Montant total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatMad(mission.totalAmount)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Commission</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatMad(mission.commissionAmount)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Net artisan</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{formatMad(mission.artisanNet)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 border-l-2 border-indigo-200 pl-4">
            {timeline.map((t) => (
              <li key={t.label}>
                <p className="font-medium">{t.label}</p>
                <p className="text-xs text-slate-500">
                  {format(new Date(t.at), "PPpp", { locale: fr })}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Artisan</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href={`/artisans/${mission.artisan.id}`} className="text-indigo-600 hover:underline">
              {mission.artisan.firstName} {mission.artisan.lastName}
            </Link>
            <p className="text-sm text-slate-500">{mission.artisan.user?.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {mission.citizen.firstName} {mission.citizen.lastName}
            </p>
            <p className="text-sm text-slate-500">{mission.citizen.user?.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
