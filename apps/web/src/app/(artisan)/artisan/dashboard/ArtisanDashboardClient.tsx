"use client";

import Link from "next/link";

import { AvailabilityToggle } from "@/app/(artisan)/artisan/dashboard/components/AvailabilityToggle";
import { RecentMissions } from "@/app/(artisan)/artisan/dashboard/components/RecentMissions";
import { StatsCards } from "@/app/(artisan)/artisan/dashboard/components/StatsCards";
import { Button } from "@/components/ui/button";
import { DisplayTitle } from "@/components/ui/display-title";
import { useArtisanEarnings } from "@/hooks/artisan/useArtisanEarnings";
import { useArtisanMissions } from "@/hooks/artisan/useArtisanMissions";
import { useArtisanProfile } from "@/hooks/artisan/useArtisanProfile";

export function ArtisanDashboardClient() {
  const { data: profile, isLoading: profileLoading } = useArtisanProfile();
  const { data: earnings, isLoading: earningsLoading } = useArtisanEarnings();
  const { data: missions, isLoading: missionsLoading } = useArtisanMissions({
    limit: 5,
  });

  const isOnline = profile?.availabilityStatus === "ONLINE";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <DisplayTitle as="h1" size="sm" className="text-2xl">
            Bonjour {profile?.firstName ?? "Artisan"}
          </DisplayTitle>
          <p className="text-muted-foreground">Votre activité du jour</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/artisan/missions">Toutes les missions</Link>
        </Button>
      </div>

      <AvailabilityToggle
        isOnline={isOnline}
        kycApproved={profile?.kycStatus === "APPROVED"}
        isLoading={profileLoading}
      />

      <StatsCards
        missionsToday={earnings?.summary.missionsToday}
        revenueToday={earnings?.summary.revenueToday}
        rating={earnings?.summary.rating ?? profile?.rating}
        isLoading={earningsLoading || profileLoading}
      />

      <section>
        <DisplayTitle as="h2" size="sm" className="mb-4 text-lg font-semibold">
          Missions récentes
        </DisplayTitle>
        <RecentMissions missions={missions?.items} isLoading={missionsLoading} />
      </section>
    </div>
  );
}
