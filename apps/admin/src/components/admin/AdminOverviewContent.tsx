"use client";

import { motion } from "framer-motion";

import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { AlertBanner } from "@/components/admin/AlertBanner";
import { HeatmapCard } from "@/components/admin/HeatmapCard";
import { KPI_DATA, KpiCard } from "@/components/admin/KpiCard";
import { KycQueue } from "@/components/admin/KycQueue";
import { MissionsTable } from "@/components/admin/MissionsTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopArtisansTable } from "@/components/admin/TopArtisansTable";

export function AdminOverviewContent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      <AlertBanner message="7 artisans en attente de validation KYC · 3 litiges ouverts nécessitent votre attention · 2 artisans sous la note minimale (3.5/5)" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_DATA.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MissionsTable />
        </div>
        <div className="space-y-6">
          <RevenueChart />
          <ActivityFeed />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <KycQueue />
        <HeatmapCard />
        <TopArtisansTable />
      </div>
    </motion.div>
  );
}
