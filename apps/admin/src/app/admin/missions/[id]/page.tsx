"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";

import { StatusPill } from "@/components/admin/StatusPill";
import { mapMissionStatus } from "@/lib/adminMappers";
import { adminPaths } from "@/lib/adminPaths";
import { formatMad } from "@/lib/utils";
import { fetchMission } from "@/services/adminApi";

interface MissionDetail {
  id: string;
  status: string;
  totalAmount: number;
  commissionAmount?: number;
  artisanNet?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  job: { title: string; city: string };
  artisan: { id: string; firstName: string; lastName: string };
  citizen: { firstName: string; lastName: string };
}

export default function AdminMissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: mission, isLoading } = useQuery({
    queryKey: ["admin", "mission", id],
    queryFn: async () => (await fetchMission(id)) as unknown as MissionDetail,
    enabled: !!id,
  });

  if (isLoading || !mission) {
    return <p className="text-sm text-dep-gray">Chargement…</p>;
  }

  return (
    <div className="space-y-6">
      <Link href={adminPaths.missions()} className="text-sm font-medium text-orange hover:underline">
        ← Retour aux missions
      </Link>

      <div className="rounded-2xl border border-dep-border bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-syne text-xl font-bold text-navy">{mission.job.title}</h2>
            <p className="mt-1 text-sm text-dep-gray">{mission.job.city}</p>
          </div>
          <StatusPill status={mapMissionStatus(mission.status)} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-[11px] font-semibold uppercase text-dep-gray">Client</dt>
            <dd className="mt-1 font-medium text-navy">
              {mission.citizen.firstName} {mission.citizen.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase text-dep-gray">Artisan</dt>
            <dd className="mt-1 font-medium text-navy">
              {mission.artisan?.firstName
                ? `${mission.artisan.firstName} ${mission.artisan.lastName}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase text-dep-gray">Montant</dt>
            <dd className="mt-1 font-syne text-lg font-bold text-navy">
              {formatMad(mission.totalAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase text-dep-gray">Créée le</dt>
            <dd className="mt-1 text-sm">
              {format(new Date(mission.createdAt), "PPPp", { locale: fr })}
            </dd>
          </div>
          {mission.completedAt && (
            <div>
              <dt className="text-[11px] font-semibold uppercase text-dep-gray">Terminée le</dt>
              <dd className="mt-1 text-sm">
                {format(new Date(mission.completedAt), "PPPp", { locale: fr })}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
