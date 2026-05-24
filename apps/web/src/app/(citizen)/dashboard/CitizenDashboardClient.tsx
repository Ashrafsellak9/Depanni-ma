"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { ActiveMissionBanner } from "@/app/(citizen)/dashboard/components/ActiveMissionBanner";
import { ArtisansMap } from "@/app/(citizen)/dashboard/components/ArtisansMap";
import { QuickServiceGrid } from "@/app/(citizen)/dashboard/components/QuickServiceGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobOfferNotifications } from "@/hooks/citizen/useJobOfferNotifications";
import { useMyMissions } from "@/hooks/citizen/useMyMissions";

export function CitizenDashboardClient() {
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | undefined>();

  const { data, isLoading } = useMyMissions({ limit: 100 });
  useJobOfferNotifications();

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Géolocalisation non supportée");
      setLat(33.5731);
      setLng(-7.5898);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {
        setGeoError("Position par défaut : Casablanca");
        setLat(33.5731);
        setLng(-7.5898);
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, []);

  const items = data?.items ?? [];
  const pending = items.filter((j) => j.status === "PENDING").length;
  const active = items.filter((j) => ["ACTIVE", "IN_PROGRESS"].includes(j.status)).length;
  const done = items.filter((j) => j.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Accueil</h1>
          <p className="text-muted-foreground">Artisans disponibles près de vous</p>
        </div>
        <Button asChild variant="destructive" size="lg" className="shadow-md">
          <Link href="/request/new?urgency=NOW">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Demande urgente
          </Link>
        </Button>
      </div>

      <ActiveMissionBanner />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-navy">Services</h2>
        <QuickServiceGrid
          selectedCategoryId={categoryId}
          onSelectCategory={setCategoryId}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-navy">Artisans à proximité</h2>
          {geoError && <p className="text-xs text-muted-foreground">{geoError}</p>}
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <ArtisansMap lat={lat} lng={lng} categoryId={categoryId} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {isLoading ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-navy">{pending}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">En cours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{active}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Terminées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-success">{done}</p>
              </CardContent>
            </Card>
          </>
        )}
      </section>
    </div>
  );
}
