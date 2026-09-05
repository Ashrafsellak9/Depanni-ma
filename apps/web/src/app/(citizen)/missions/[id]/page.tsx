"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Phone, Star } from "lucide-react";

import { ChatPanel } from "@/app/(citizen)/missions/[id]/components/ChatPanel";
import { SearchingBanner } from "@/app/(citizen)/missions/[id]/components/SearchingBanner";
import { OffersList } from "@/app/(citizen)/missions/[id]/components/OffersList";
import { TrackingMap } from "@/components/maps";
import { JobStatusBadge } from "@/components/citizen/JobStatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobOfferNotifications } from "@/hooks/citizen/useJobOfferNotifications";
import { MissionCheckout } from "@/components/payments/MissionCheckout";
import { DisplayTitle } from "@/components/ui/display-title";
import { useMissionDetail } from "@/hooks/citizen/useMissionDetail";

export default function MissionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = typeof params.id === "string" ? params.id : "";
  const isSearching =
    searchParams.get("searching") === "1" ||
    searchParams.get("searching") === "true";

  const { data: job, isLoading, isError } = useMissionDetail(jobId);
  useJobOfferNotifications(jobId);

  const mission = job?.mission;
  const trackingEnabled =
    !!mission && ["ACCEPTED", "IN_PROGRESS"].includes(mission.status);
  const showOffers = job?.status === "PENDING" || job?.status === "ACTIVE";
  const artisan = mission?.artisan;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[320px] w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/missions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
        <p className="text-danger">Mission introuvable.</p>
      </div>
    );
  }

  const showSearching =
    isSearching && job.status === "PENDING" && (job.offers?.length ?? job.offerCount ?? 0) === 0;

  return (
    <div className="space-y-6">
      {showSearching && <SearchingBanner />}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" className="-ml-2 mb-2" asChild>
            <Link href="/missions">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Historique
            </Link>
          </Button>
          <DisplayTitle as="h1" size="sm" className="text-2xl">
            {job.title}
          </DisplayTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <JobStatusBadge status={job.status} />
            <span>{job.city}</span>
            <span>·</span>
            <span>{format(new Date(job.createdAt), "d MMMM yyyy", { locale: fr })}</span>
          </div>
        </div>
        <ChatPanel missionId={mission?.id} disabled={!mission} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suivi en direct</CardTitle>
        </CardHeader>
        <CardContent>
          <TrackingMap
            missionId={mission?.id}
            jobLat={job.lat}
            jobLng={job.lng}
            enabled={trackingEnabled}
          />
        </CardContent>
      </Card>

      {artisan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Votre artisan</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {artisan.avatar && <AvatarImage src={artisan.avatar} alt="" />}
                <AvatarFallback>
                  {artisan.firstName[0]}
                  {artisan.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-navy">
                  {artisan.firstName} {artisan.lastName}
                </p>
                {artisan.rating != null && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    {artisan.rating.toFixed(1)}
                  </p>
                )}
              </div>
            </div>
            {artisan.phone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${artisan.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Appeler
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <section>
        <DisplayTitle as="h2" size="sm" className="mb-3 text-lg font-semibold">
          Description
        </DisplayTitle>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{job.description}</p>
      </section>

      <Separator />

      {showOffers && (
        <section>
          <DisplayTitle as="h2" size="sm" className="mb-3 text-lg font-semibold">
            Offres reçues
          </DisplayTitle>
          <OffersList
            jobId={job.id}
            offers={job.offers}
            canRespond={job.status === "PENDING" || job.status === "ACTIVE"}
          />
        </section>
      )}

      {mission && (
        <Card>
          <CardContent className="pt-6 text-sm">
            <p>
              <span className="text-muted-foreground">Montant mission : </span>
              <span className="font-semibold text-navy">{mission.totalAmount} MAD</span>
            </p>
            <p className="mt-1">
              <span className="text-muted-foreground">Statut mission : </span>
              {mission.status}
            </p>
          </CardContent>
        </Card>
      )}

      {mission && mission.totalAmount > 0 && (
        <MissionCheckout
          jobId={job.id}
          amount={mission.totalAmount}
          enabled={["ACCEPTED", "IN_PROGRESS", "PENDING"].includes(mission.status)}
        />
      )}
    </div>
  );
}
