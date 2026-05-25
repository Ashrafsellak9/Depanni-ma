"use client";

import { EarningsChart } from "@/components/artisan/EarningsChart";
import { KpiStrip } from "@/components/artisan/KpiStrip";
import { MissionAlertCard } from "@/components/artisan/MissionAlertCard";
import { MissionsTable } from "@/components/artisan/MissionsTable";
import { ProfileCard } from "@/components/artisan/ProfileCard";
import { RecentReviews } from "@/components/artisan/RecentReviews";

export default function ArtisanDashboardPage() {
  return (
    <div>
      <MissionAlertCard />
      <KpiStrip />

      <div className="mb-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EarningsChart />
        </div>
        <div className="lg:col-span-2">
          <MissionsTable />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentReviews />
        <ProfileCard />
      </div>
    </div>
  );
}
