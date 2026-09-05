"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, CheckCircle, MapPin, MessageCircle, Navigation } from "lucide-react";
import toast from "react-hot-toast";

import { ChatPanel } from "@/app/(citizen)/missions/[id]/components/ChatPanel";
import { MissionStatusBadge } from "@/components/artisan/MissionStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useArtisanMission } from "@/hooks/artisan/useArtisanMissions";
import { DisplayTitle } from "@/components/ui/display-title";
import { api, getApiErrorMessage } from "@/lib/api";

export default function ArtisanMissionDetailPage() {
  const params = useParams();
  const missionId = typeof params.id === "string" ? params.id : "";

  const { data: mission, isLoading, isError, refetch } = useArtisanMission(missionId);

  const gpsUrl =
    mission &&
    `https://www.google.com/maps/dir/?api=1&destination=${mission.job.lat},${mission.job.lng}`;

  const completeMission = async () => {
    if (!mission) return;
    try {
      await api.patch(
        `/jobs/${mission.jobId}/offers/${mission.offer.id}/complete`,
      );
      toast.success("Mission marquée comme terminée");
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !mission) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/artisan/missions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <p className="text-danger">Mission introuvable.</p>
      </div>
    );
  }

  const canComplete = ["ACCEPTED", "IN_PROGRESS"].includes(mission.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2" asChild>
            <Link href="/artisan/missions">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Missions
            </Link>
          </Button>
          <DisplayTitle as="h1" size="sm" className="text-2xl">
            {mission.job.title}
          </DisplayTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <MissionStatusBadge status={mission.status} />
            <span>
              {mission.citizen.firstName} {mission.citizen.lastName}
            </span>
            <span>·</span>
            <span>{format(new Date(mission.createdAt), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <ChatPanel missionId={mission.id} />
          {gpsUrl && (
            <Button asChild variant="default">
              <a href={gpsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 h-4 w-4" />
                Navigation GPS
              </a>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Adresse intervention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="font-medium text-navy">{mission.job.address}</p>
          <p className="text-muted-foreground">{mission.job.city}</p>
          {mission.job.description && (
            <p className="pt-2 text-muted-foreground whitespace-pre-wrap">
              {mission.job.description}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Montant client</p>
            <p className="text-2xl font-bold text-navy">{mission.totalAmount} MAD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Commission</p>
            <p className="text-2xl font-bold text-danger">-{mission.commissionAmount} MAD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Votre net</p>
            <p className="text-2xl font-bold text-success">{mission.artisanNet} MAD</p>
          </CardContent>
        </Card>
      </div>

      {canComplete && (
        <Button className="w-full sm:w-auto" onClick={() => void completeMission()}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Terminer la mission
        </Button>
      )}

      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 pt-6 text-sm text-muted-foreground">
          <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
          Utilisez le chat pour coordonner l&apos;intervention avec le client.
        </CardContent>
      </Card>
    </div>
  );
}
