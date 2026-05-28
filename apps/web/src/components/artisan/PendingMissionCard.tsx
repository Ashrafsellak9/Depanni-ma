"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

export interface PendingMission {
  id: string;
  type: string;
  service: string;
  subtype: string;
  distance: string;
  eta: string;
  budget: string;
  urgency: "urgent" | "normal";
  client: { name: string; rating: string; missions: number };
  description: string;
  expiresIn: number;
  initialExpiresIn?: number;
  photos?: string[];
  competingArtisans?: string[];
  competingCount?: number;
}

interface PendingMissionCardProps {
  mission: PendingMission;
  onPropose?: (mission: PendingMission) => void;
  onSkip?: (mission: PendingMission) => void;
}

export function PendingMissionCard({ mission, onPropose, onSkip }: PendingMissionCardProps) {
  const initialTime = useRef(mission.initialExpiresIn ?? mission.expiresIn);
  const [timeLeft, setTimeLeft] = useState(mission.expiresIn);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const urgent = mission.urgency === "urgent";
  const competitors = mission.competingArtisans ?? [];
  const competitorCount = mission.competingCount ?? competitors.length;
  const extraPhotos = mission.photos && mission.photos.length > 3 ? mission.photos.length - 3 : 0;

  const progressPct = Math.min(100, (timeLeft / initialTime.current) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`overflow-hidden rounded-2xl border bg-navy p-5 ${
        urgent
          ? "border-l-4 border-l-orange border-orange/40"
          : "border-white/[0.08]"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mission.type}</span>
          <div>
            <div className="text-[15px] font-semibold text-white">
              {mission.service} — {mission.subtype}
            </div>
            <div className="mt-0.5 flex items-center gap-3 text-[12px] text-white/50">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {mission.distance}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {mission.eta}
              </span>
            </div>
          </div>
        </div>
        {urgent && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="rounded-full bg-orange px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white"
          >
            🚨 Urgent
          </motion.div>
        )}
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-white/70">{mission.description}</p>

      {mission.photos && mission.photos.length > 0 && (
        <div className="mb-3 flex gap-2">
          {mission.photos.slice(0, 3).map((photo, i) => (
            <div
              key={photo + i}
              className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] text-[24px] transition-colors hover:border-orange"
              title="Photo du problème"
            >
              📷
            </div>
          ))}
          {extraPhotos > 0 && (
            <div className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05]">
              <span className="text-center text-[10px] leading-tight text-white/40">
                +{extraPhotos}
                <br />
                photos
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
        <div>
          <div className="text-[12px] text-white/40">Client</div>
          <div className="text-[13px] font-semibold text-white">{mission.client.name}</div>
          <div className="text-[11px] text-white/50">
            {mission.client.rating} · {mission.client.missions} missions
          </div>
          {competitorCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {competitors.slice(0, 3).map((init) => (
                  <div
                    key={init}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-white/15 text-[8px] font-bold text-white"
                  >
                    {init}
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-white/45">
                {competitorCount} artisan{competitorCount > 1 ? "s ont" : " a"} déjà proposé
              </span>
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[12px] text-white/40">Budget estimé</div>
          <div className="font-syne text-lg font-bold text-orange">{mission.budget}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] text-white/40">Expire dans</span>
          <span
            className={`font-syne text-[13px] font-bold ${
              timeLeft < 60 ? "text-dep-red" : "text-orange"
            }`}
          >
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className={`h-full rounded-full ${
              timeLeft < 60 ? "bg-dep-red" : timeLeft < 120 ? "bg-orange" : "bg-green"
            }`}
            style={{ width: `${progressPct}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPropose?.(mission)}
          className="flex-1 rounded-xl bg-orange py-3 text-[13px] font-semibold text-white transition-colors hover:bg-orange-2"
        >
          Proposer mon prix
        </button>
        <button
          type="button"
          onClick={() => onSkip?.(mission)}
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/10"
        >
          Passer
        </button>
      </div>
    </motion.div>
  );
}
