"use client";

import { motion } from "framer-motion";
import { AlertCircle, MessageSquare, Star, ThumbsUp } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CRITERIA_BREAKDOWN,
  RATING_TREND,
  STAR_DISTRIBUTION,
  TOTAL_REVIEWS,
  AVERAGE_RATING,
} from "@/components/artisan/reviews/artisanReviewsMock";
import { DisplayTitle } from "@/components/ui/display-title";

type ReviewsSidebarProps = {
  unrepliedCount: number;
};

export function ReviewsSidebar({ unrepliedCount }: ReviewsSidebarProps) {
  return (
    <div className="lg:sticky lg:top-[80px]">
      <div className="mb-4 rounded-2xl bg-[#0F1E35] p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="mb-1 text-[11px] uppercase tracking-wider text-[rgba(255,255,255,0.4)]">
              Note globale
            </div>
            <div className="font-display text-[52px] font-black leading-none tracking-[-3px] text-white">
              {AVERAGE_RATING}
              <span className="font-sans text-[20px] font-light text-[rgba(255,255,255,0.4)]">
                /5
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-[24px] tracking-wider text-[#F05A1A]">★★★★★</div>
            <div className="text-[12px] text-[rgba(255,255,255,0.5)]">{TOTAL_REVIEWS} avis clients</div>
            <div className="mt-2 inline-block rounded-full bg-[rgba(27,138,78,0.2)] px-2.5 py-1 text-[10px] font-semibold text-[#4ADE80]">
              Top 5% des artisans
            </div>
          </div>
        </div>

        {STAR_DISTRIBUTION.map((row) => (
          <div key={row.star} className="mb-2 flex items-center gap-2.5">
            <span className="w-3 flex-shrink-0 text-right text-[11px] text-[rgba(255,255,255,0.5)]">
              {row.star}
            </span>
            <span className="flex-shrink-0 text-[11px] text-[#F05A1A]">★</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${row.pct}%` }}
                transition={{ duration: 1, delay: row.star * 0.08, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  row.star >= 4
                    ? "bg-[#F05A1A]"
                    : row.star === 3
                      ? "bg-[rgba(255,255,255,0.3)]"
                      : "bg-[rgba(220,38,38,0.6)]"
                }`}
              />
            </div>
            <span className="w-6 flex-shrink-0 text-right text-[11px] text-[rgba(255,255,255,0.4)]">
              {row.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-2xl border border-[#E5E0D8] bg-white p-5">
        <DisplayTitle as="h3" size="sm" className="mb-4 text-[13px] font-semibold">
          Évaluation par critère
        </DisplayTitle>
        {CRITERIA_BREAKDOWN.map((c) => (
          <div key={c.label} className="mb-3 last:mb-0">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">{c.label}</span>
              <span className="text-[12px] font-bold text-[#0F1E35]">{c.score.toFixed(1)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E0D8]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(c.score / 5) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: c.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 rounded-2xl border border-[#E5E0D8] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <DisplayTitle as="h3" size="sm" className="text-[13px] font-semibold">
            Évolution de la note
          </DisplayTitle>
          <span className="text-[10px] font-semibold text-[#1B8A4E]">↑ +0.2 ce mois</span>
        </div>
        <div style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={RATING_TREND}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#6B7280" }}
              />
              <YAxis
                domain={[4.4, 5.0]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "#6B7280" }}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid #E5E0D8",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(v: number) => [`${v}/5`, "Note"]}
              />
              <Line
                dataKey="note"
                stroke="#F05A1A"
                strokeWidth={2.5}
                dot={{ fill: "#F05A1A", r: 3 }}
                activeDot={{ r: 5, fill: "#F05A1A" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Avis ce mois", value: "8", icon: MessageSquare, color: "#F05A1A" },
          {
            label: "Sans réponse",
            value: String(unrepliedCount),
            icon: AlertCircle,
            color: "#DC2626",
          },
          { label: "Taux 5 étoiles", value: "81%", icon: Star, color: "#1B8A4E" },
          { label: "Recommandent", value: "98%", icon: ThumbsUp, color: "#1B8A4E" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[#E5E0D8] bg-white p-3">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Icon size={12} style={{ color: s.color }} />
                <span className="text-[10px] text-[#6B7280]">{s.label}</span>
              </div>
              <div className="font-display text-[20px] font-bold text-[#0F1E35]">{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
