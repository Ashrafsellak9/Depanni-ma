"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { AlertBanner } from "@/components/admin/AlertBanner";
import { HeatmapCard } from "@/components/admin/HeatmapCard";
import { KPI_DATA, KpiCard } from "@/components/admin/KpiCard";
import { KycQueue } from "@/components/admin/KycQueue";
import { MissionsTable } from "@/components/admin/MissionsTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { TopArtisansTable } from "@/components/admin/TopArtisansTable";
import {
  buildAlertMessage,
  mapActivityFeed,
  mapKpisToCards,
  mapKycQueueItem,
  mapRevenueChart,
  mapTopArtisans,
  mergeOverviewMissions,
} from "@/lib/adminMappers";
import { approveKyc, fetchOverview, rejectKyc } from "@/services/adminApi";
import type { AdminOverview } from "@/types/admin";

export function AdminOverviewContent() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setOverview(await fetchOverview());
      setError("");
    } catch {
      setError("Impossible de charger le tableau de bord. Vérifiez l'API.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const kpis = overview ? mapKpisToCards(overview.kpis) : KPI_DATA;
  const missions = overview ? mergeOverviewMissions(overview) : undefined;
  const chart = overview ? mapRevenueChart(overview.revenueChart) : undefined;
  const activity = overview ? mapActivityFeed(overview.activityFeed) : undefined;
  const kycItems = overview ? overview.kycPending.map(mapKycQueueItem) : undefined;
  const top = overview ? mapTopArtisans(overview.topArtisans) : undefined;
  const alert = overview ? buildAlertMessage(overview.kpis) : null;

  const handleApprove = async (id: string) => {
    try {
      await approveKyc(id);
      toast.success("KYC approuvé");
      await load();
    } catch {
      toast.error("Échec de l'approbation");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectKyc(id, { reason: "Document incomplet", sendEmail: false });
      toast.success("KYC refusé");
      await load();
    } catch {
      toast.error("Échec du refus");
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      {error && (
        <p className="rounded-xl border border-dep-red/20 bg-dep-red/[0.06] px-4 py-2 text-sm text-dep-red">
          {error}
        </p>
      )}
      {alert ? <AlertBanner message={alert} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} isString={typeof kpi.value === "string"} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MissionsTable missions={missions} />
        </div>
        <div className="space-y-6">
          <RevenueChart chart={chart} />
          <ActivityFeed items={activity} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <KycQueue
          items={kycItems}
          pendingCount={overview?.kpis.kycPending}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <HeatmapCard pointCount={overview?.heatmapPoints.length} />
        <TopArtisansTable artisans={top} />
      </div>
    </motion.div>
  );
}
