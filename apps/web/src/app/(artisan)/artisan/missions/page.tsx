"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  ACTIVE_MISSION,
  COMPLETED_MISSIONS,
  PENDING_MISSIONS,
} from "@/components/artisan/artisanMissionsMock";
import { ActiveMissionCard } from "@/components/artisan/ActiveMissionCard";
import { CompletedMissionsList } from "@/components/artisan/CompletedMissionsList";
import { MissionsEmptyState } from "@/components/artisan/MissionsEmptyState";
import {
  PendingMissionCard,
  type PendingMission,
} from "@/components/artisan/PendingMissionCard";
import { PricingDrawer } from "@/components/artisan/PricingDrawer";

const TABS = [
  { id: "pending", label: "En attente", count: 2 },
  { id: "active", label: "En cours", count: 1 },
  { id: "done", label: "Terminées", count: null },
  { id: "all", label: "Toutes", count: null },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ArtisanMissionsPage() {
  const [tab, setTab] = useState<TabId>("pending");
  const [isAvailable, setIsAvailable] = useState(true);
  const [pending, setPending] = useState(PENDING_MISSIONS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<PendingMission | null>(null);

  const openDrawer = (mission: PendingMission) => {
    setSelectedMission(mission);
    setDrawerOpen(true);
  };

  const handleSkip = (mission: PendingMission) => {
    setPending((list) => list.filter((m) => m.id !== mission.id));
  };

  const handleSubmitOffer = () => {
    if (selectedMission) {
      setPending((list) => list.filter((m) => m.id !== selectedMission.id));
    }
  };

  const pendingContent = useMemo(() => {
    if (!isAvailable) {
      return <MissionsEmptyState isAvailable={false} onBecomeAvailable={() => setIsAvailable(true)} />;
    }
    if (pending.length === 0) {
      return <MissionsEmptyState isAvailable />;
    }
    return (
      <div className="space-y-4">
        {pending.map((m) => (
          <PendingMissionCard
            key={m.id}
            mission={m}
            onPropose={openDrawer}
            onSkip={handleSkip}
          />
        ))}
      </div>
    );
  }, [isAvailable, pending]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 border-b border-dep-border">
          {TABS.map((t) => (
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
            onClick={() => setIsAvailable((v) => !v)}
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ActiveMissionCard mission={ACTIVE_MISSION} />
        </motion.div>
      )}

      {(tab === "done" || tab === "all") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {tab === "all" && (
            <div className="mb-6 rounded-2xl border border-dep-border bg-white p-4">
              <p className="text-[12px] text-dep-gray">Mission en cours</p>
              <p className="mt-1 text-[14px] font-semibold text-navy">{ACTIVE_MISSION.service}</p>
            </div>
          )}
          <CompletedMissionsList missions={COMPLETED_MISSIONS} />
        </motion.div>
      )}

      <PricingDrawer
        open={drawerOpen}
        mission={selectedMission}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleSubmitOffer}
      />
    </div>
  );
}
