"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { ActiveMissionCard } from "@/components/artisan/ActiveMissionCard";
import { CompletedMissionsList } from "@/components/artisan/CompletedMissionsList";
import { MissionsEmptyState } from "@/components/artisan/MissionsEmptyState";
import {
  PendingMissionCard,
  type PendingMission,
} from "@/components/artisan/PendingMissionCard";
import { PricingDrawer } from "@/components/artisan/PricingDrawer";
import type { ActiveMission, CompletedMission } from "@/components/artisan/artisanMissionsMock";
import { useActiveJobs } from "@/hooks/artisan/useActiveJobs";
import { useArtisanMissions } from "@/hooks/artisan/useArtisanMissions";
import { useArtisanProfile, useSetAvailability } from "@/hooks/artisan/useArtisanProfile";
import type { ActiveJobFeed, ArtisanMission } from "@/types/artisan";

const EL_JADIDA = { lat: 33.2316, lng: -8.5007 };

function emojiFor(label: string): string {
  const k = label.toLowerCase();
  if (k.includes("plomb")) return "🔧";
  if (k.includes("électr") || k.includes("electr")) return "⚡";
  if (k.includes("serrur")) return "🔑";
  if (k.includes("peint")) return "🎨";
  if (k.includes("méca") || k.includes("meca")) return "🚗";
  return "🛠️";
}

function mapPending(job: ActiveJobFeed): PendingMission {
  const budget =
    job.budgetMin != null && job.budgetMax != null
      ? `${job.budgetMin}–${job.budgetMax} MAD`
      : "À convenir";
  return {
    id: job.id,
    type: emojiFor(job.category),
    service: job.category,
    subtype: job.title,
    distance: `${job.distanceKm.toFixed(1)} km`,
    eta: `${Math.max(5, Math.round(job.distanceKm * 4))} min`,
    budget,
    urgency: job.urgency === "NOW" ? "urgent" : "normal",
    client: { name: "Client", rating: "Client", missions: job.offerCount },
    description: job.title,
    expiresIn: 180,
    initialExpiresIn: 180,
    competingCount: job.offerCount,
  };
}

function mapActive(m: ArtisanMission): ActiveMission {
  const started = m.startedAt ? new Date(m.startedAt) : new Date(m.createdAt);
  return {
    id: m.id,
    service: m.job.title,
    client: {
      name: `${m.citizen.firstName} ${m.citizen.lastName}`.trim(),
      phone: "",
      address: m.job.address || m.job.city,
    },
    price: m.totalAmount,
    startTime: started.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    status: m.status === "IN_PROGRESS" ? "working" : "en_route",
  };
}

function mapCompleted(m: ArtisanMission): CompletedMission {
  return {
    id: m.id,
    service: `${emojiFor(m.job.category)} ${m.job.title}`,
    client: `${m.citizen.firstName} ${m.citizen.lastName[0] ?? ""}.`,
    date: new Date(m.completedAt ?? m.createdAt).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    price: m.totalAmount,
    net: m.artisanNet,
    rating: 0,
  };
}

export default function ArtisanMissionsPage() {
  const [tab, setTab] = useState<"pending" | "active" | "done" | "all">("pending");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<PendingMission | null>(null);
  const [skipped, setSkipped] = useState<string[]>([]);

  const profile = useArtisanProfile();
  const setAvailability = useSetAvailability();
  const jobs = useActiveJobs(EL_JADIDA.lat, EL_JADIDA.lng);
  const missionsQ = useArtisanMissions({ limit: 50 });

  const isAvailable = profile.data?.availabilityStatus === "ONLINE";
  const pending = (jobs.data ?? []).map(mapPending).filter((m) => !skipped.includes(m.id));
  const missionItems = missionsQ.data?.items ?? [];
  const active = missionItems
    .filter((m) => m.status === "ACCEPTED" || m.status === "IN_PROGRESS")
    .map(mapActive);
  const completed = missionItems.filter((m) => m.status === "COMPLETED").map(mapCompleted);

  const tabs = useMemo(
    () => [
      { id: "pending" as const, label: "En attente", count: pending.length },
      { id: "active" as const, label: "En cours", count: active.length },
      { id: "done" as const, label: "Terminées", count: completed.length },
      { id: "all" as const, label: "Toutes", count: null },
    ],
    [pending.length, active.length, completed.length],
  );

  const openDrawer = (mission: PendingMission) => {
    setSelectedMission(mission);
    setDrawerOpen(true);
  };

  const pendingContent = !isAvailable ? (
    <MissionsEmptyState
      isAvailable={false}
      onBecomeAvailable={() => setAvailability.mutate(true)}
    />
  ) : pending.length === 0 ? (
    <MissionsEmptyState isAvailable />
  ) : (
    <div className="space-y-4">
      {pending.map((m) => (
        <PendingMissionCard
          key={m.id}
          mission={m}
          onPropose={openDrawer}
          onSkip={(mission) => setSkipped((ids) => [...ids, mission.id])}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 border-b border-dep-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
                tab === t.id
                  ? "border-orange text-orange"
                  : "border-transparent text-dep-gray hover:text-navy"
              }`}
            >
              {t.label}
              {t.count != null && (
                <span className="ml-1.5 rounded-full bg-orange/10 px-1.5 text-[11px] text-orange">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {tab === "pending" && (
          <button
            type="button"
            onClick={() => setAvailability.mutate(!isAvailable)}
            className={`rounded-xl border px-3 py-2 text-[12px] font-semibold transition-colors ${
              isAvailable
                ? "border-green/20 bg-green/10 text-green"
                : "border-dep-gray/20 bg-dep-gray/10 text-dep-gray"
            }`}
          >
            {isAvailable ? "● Disponible" : "○ En pause"}
          </button>
        )}
      </div>

      {tab === "pending" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {pendingContent}
        </motion.div>
      )}

      {tab === "active" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {active.length === 0 ? (
            <p className="rounded-2xl border border-dep-border bg-white p-6 text-sm text-dep-gray">
              Aucune mission en cours.
            </p>
          ) : (
            active.map((m) => <ActiveMissionCard key={m.id} mission={m} />)
          )}
        </motion.div>
      )}

      {(tab === "done" || tab === "all") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {tab === "all" && active[0] && (
            <div className="mb-6 rounded-2xl border border-dep-border bg-white p-4">
              <p className="text-[12px] text-dep-gray">Mission en cours</p>
              <p className="mt-1 text-[14px] font-semibold text-navy">{active[0].service}</p>
            </div>
          )}
          <CompletedMissionsList missions={completed} />
        </motion.div>
      )}

      <PricingDrawer
        open={drawerOpen}
        mission={selectedMission}
        onClose={() => setDrawerOpen(false)}
        onSubmit={() => {
          if (selectedMission) setSkipped((ids) => [...ids, selectedMission.id]);
        }}
      />
    </div>
  );
}
