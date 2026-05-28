"use client";

import {
  Camera,
  Check,
  CheckCircle,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Wrench,
} from "lucide-react";

import type { ActiveMission } from "@/components/artisan/artisanMissionsMock";

const STEPS = [
  { label: "Accepté", icon: Check, done: true, active: false },
  { label: "En route", icon: Navigation, done: true, active: true },
  { label: "Au travail", icon: Wrench, done: false, active: false },
  { label: "Terminé", icon: CheckCircle, done: false, active: false },
];

export function ActiveMissionCard({ mission }: { mission: ActiveMission }) {
  const net = Math.round(mission.price * 0.85);

  return (
    <div className="overflow-hidden rounded-2xl border border-dep-border bg-white">
      <div className="flex items-center justify-between bg-navy p-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green" />
          <span className="text-[13px] font-semibold text-white">Mission en cours</span>
        </div>
        <span className="text-[12px] text-white/50">Démarrée à {mission.startTime}</span>
      </div>

      <div className="p-5">
        <p className="mb-4 text-[14px] font-semibold text-navy">{mission.service}</p>

        <div className="relative mb-6 flex items-center justify-between">
          <div className="absolute left-4 right-4 top-4 h-[2px] bg-dep-border" />
          <div className="absolute left-4 top-4 h-[2px] w-[45%] bg-orange" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="z-10 flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    s.done && !s.active
                      ? "bg-green text-white"
                      : s.active
                        ? "bg-orange text-white"
                        : "border-2 border-dep-border bg-white text-dep-gray"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <span
                  className={`text-[10px] ${
                    s.active
                      ? "font-semibold text-orange"
                      : s.done
                        ? "text-green"
                        : "text-dep-gray"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-dep-border bg-cream p-4">
          <div>
            <div className="mb-1 text-[12px] text-dep-gray">Client</div>
            <div className="text-[14px] font-semibold text-navy">{mission.client.name}</div>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] text-dep-gray">
              <MapPin size={11} />
              {mission.client.address}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href={`tel:${mission.client.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10"
              aria-label="Appeler le client"
            >
              <Phone size={16} className="text-green" />
            </a>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/[0.06]"
              aria-label="Message"
            >
              <MessageCircle size={16} className="text-navy" />
            </button>
            <a
              href="https://waze.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/10"
              aria-label="Navigation"
            >
              <Navigation size={16} className="text-orange" />
            </a>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl border border-dep-border bg-cream p-3">
          <span className="text-[13px] text-dep-gray">Montant convenu</span>
          <div className="text-right">
            <span className="font-syne text-[20px] font-bold text-navy">{mission.price} MAD</span>
            <div className="text-[11px] text-green">Net: {net} MAD</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-dep-border bg-cream py-3.5 text-[13px] font-semibold text-navy"
          >
            <Camera size={15} />
            Ajouter photo
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-green py-3.5 text-[13px] font-bold text-white"
          >
            <CheckCircle size={15} />
            Mission terminée
          </button>
        </div>
      </div>
    </div>
  );
}
