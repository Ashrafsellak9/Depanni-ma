"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

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
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PendingMissionCard({ mission }: { mission: PendingMission }) {
  const [expiresIn, setExpiresIn] = useState(mission.expiresIn);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const t = setInterval(() => setExpiresIn((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [expiresIn]);

  const urgent = mission.urgency === "urgent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 ${
        urgent
          ? "border-orange/30 bg-navy"
          : "border-white/10 bg-navy-2"
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
          <span className="rounded-full bg-orange px-2.5 py-1 text-[10px] font-bold uppercase text-white">
            Urgent
          </span>
        )}
      </div>

      <p className="mb-3 text-[13px] leading-relaxed text-white/70">{mission.description}</p>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
        <div>
          <div className="text-[12px] text-white/40">Client</div>
          <div className="text-[13px] font-semibold text-white">{mission.client.name}</div>
          <div className="text-[11px] text-white/50">
            {mission.client.rating} · {mission.client.missions} missions
          </div>
        </div>
        <div className="text-right">
          <div className="text-[12px] text-white/40">Budget estimé</div>
          <div className="font-syne text-lg font-bold text-orange">{mission.budget}</div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-[12px]">
        <span className="text-white/50">Expire dans</span>
        <span
          className={`font-mono font-bold ${expiresIn < 60 ? "text-dep-red" : "text-orange"}`}
        >
          {formatTime(expiresIn)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="flex-1 rounded-xl bg-orange py-3 text-[13px] font-semibold text-white hover:bg-orange-2"
        >
          Proposer mon prix
        </button>
        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-[13px] font-medium text-white/70 hover:bg-white/10"
        >
          Passer
        </button>
      </div>
    </motion.div>
  );
}
