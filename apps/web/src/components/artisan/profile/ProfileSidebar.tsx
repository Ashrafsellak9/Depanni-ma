"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import type { ArtisanProfileForm } from "@/components/artisan/profile/useArtisanProfileForm";
import { DisplayTitle } from "@/components/ui/display-title";

const CHECKLIST = [
  { label: "Informations de base", done: true },
  { label: "Photo de profil", done: true },
  { label: "Spécialités renseignées", done: true },
  { label: "Zone d'intervention", done: true },
  { label: "Horaires de disponibilité", done: true },
  { label: "Bio / présentation", done: true },
  { label: "Photos de réalisations (3+)", doneKey: "photos" as const, points: "+10%" },
  { label: "Attestation compétence", done: false, points: "+8%" },
  { label: "Tarif horaire renseigné", doneKey: "rate" as const, points: "+4%" },
];

const STATS: { label: string; value: string; icon: LucideIcon; color: string }[] = [
  { label: "Vues du profil (30j)", value: "142", icon: Eye, color: "#7C3AED" },
  { label: "Taux de sélection", value: "68%", icon: TrendingUp, color: "#1B8A4E" },
  { label: "Taux de complétion missions", value: "97%", icon: CheckCircle, color: "#1B8A4E" },
  { label: "Temps moyen de réponse", value: "2 min", icon: Clock, color: "#F05A1A" },
];

export function ProfileSidebar({ form }: { form: ArtisanProfileForm }) {
  const score = form.profileScore;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - score / 100);

  const checklist = CHECKLIST.map((item) => {
    if (item.doneKey === "photos") return { ...item, done: form.photoCount >= 3 };
    if (item.doneKey === "rate") return { ...item, done: form.hourlyRate > 0 };
    return item;
  });

  const previewTags = form.tags.slice(0, 3);

  return (
    <div className="space-y-4 lg:sticky lg:top-20">
      <div className="rounded-2xl border border-dep-border bg-white p-5">
        <DisplayTitle as="h3" size="sm" className="mb-4 text-[14px] font-semibold">
          Score de profil
        </DisplayTitle>

        <div className="mb-5 flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#E5E0D8" strokeWidth="8" />
              <motion.circle
                cx="40"
                cy="40"
                r="34"
                fill="none"
                stroke="#F05A1A"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-[18px] font-extrabold text-navy">{score}%</span>
            </div>
          </div>
          <div>
            <div className="mb-1 text-[14px] font-semibold text-navy">
              {score >= 75 ? "Profil bien rempli" : "Profil à compléter"}
            </div>
            <p className="text-[12px] leading-[1.5] text-dep-gray">
              Complétez votre profil pour
              <br />
              apparaître en tête de liste
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  item.done ? "bg-green" : "bg-dep-border"
                }`}
              >
                {item.done ? (
                  <Check size={11} className="text-white" strokeWidth={3} />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
                )}
              </div>
              <span
                className={`flex-1 text-[12px] ${
                  item.done ? "text-dep-gray line-through" : "text-navy"
                }`}
              >
                {item.label}
              </span>
              {item.points && !item.done && (
                <span className="text-[10px] font-semibold text-orange">{item.points}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <DisplayTitle as="h3" size="sm" className="text-[13px] font-semibold">
            Aperçu client
          </DisplayTitle>
          <span className="text-[10px] text-dep-gray">Voici ce que voient les clients</span>
        </div>
        <div className="rounded-xl border border-dep-border bg-cream p-3">
          <div className="mb-2.5 flex items-center gap-2.5">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #F05A1A, #FF7A3D)" }}
            >
              {form.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-semibold text-navy">{form.fullName}</span>
                <BadgeCheck size={12} className="text-green" />
              </div>
              <div className="text-[11px] text-dep-gray">
                {form.mainService.replace(/^.\s/, "")} · 1,4 km
              </div>
            </div>
            <div className="text-right">
              <div className="text-[14px] font-bold text-navy">{form.hourlyRate} MAD</div>
              <div className="text-[10px] text-orange">★★★★★ 4.9</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {previewTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-dep-border bg-white px-2 py-0.5 text-[10px] text-navy"
              >
                {tag}
              </span>
            ))}
            {form.nightUrgency && (
              <span className="rounded-full border border-orange/20 bg-orange/10 px-2 py-0.5 text-[10px] text-orange">
                Urgent
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dep-border bg-white p-5">
        <DisplayTitle as="h3" size="sm" className="mb-3 text-[13px] font-semibold">
          Performance du profil
        </DisplayTitle>
        <div className="space-y-0">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center justify-between border-b border-dep-border/40 py-2 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Icon size={13} style={{ color: s.color }} />
                  <span className="text-[12px] text-dep-gray">{s.label}</span>
                </div>
                <span className="text-[13px] font-bold text-navy">{s.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
