"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@depanni/ui";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { fetchArtisan } from "@/services/adminApi";

interface ArtisanDetail {
  id: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
  availabilityStatus: string;
  rating: number;
  totalMissions: number;
  subscriptionTier: string;
  user: { email: string; phone: string };
  missions: Array<{ id: string; status: string; job: { title: string; city: string } }>;
}

export default function ArtisanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: artisan, isLoading } = useQuery({
    queryKey: ["admin", "artisan", id],
    queryFn: async () => (await fetchArtisan(id)) as unknown as ArtisanDetail,
    enabled: !!id,
  });

  if (isLoading || !artisan) return <p className="text-slate-500">Chargement…</p>;

  return (
    <div className="space-y-6">
      <Link href="/artisans" className="text-sm text-indigo-600 hover:underline">
        ← Artisans
      </Link>
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">
          {artisan.firstName} {artisan.lastName}
        </h2>
        <StatusBadge status={artisan.kycStatus} />
        <StatusBadge status={artisan.availabilityStatus} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Note</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">★ {artisan.rating.toFixed(1)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Missions</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{artisan.totalMissions}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Abonnement</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">{artisan.subscriptionTier}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          <p>{artisan.user.email}</p>
          <p>{artisan.user.phone}</p>
        </CardContent>
      </Card>

      {artisan.missions?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Missions récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {artisan.missions.map((m: { id: string; status: string; job: { title: string; city: string } }) => (
                <li key={m.id}>
                  <Link href={`/missions/${m.id}`} className="text-indigo-600 hover:underline">
                    {m.job.title}
                  </Link>
                  <span className="ml-2 text-slate-400">
                    {m.job.city} — {m.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
