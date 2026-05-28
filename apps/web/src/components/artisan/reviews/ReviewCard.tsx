"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import type { ArtisanReview } from "@/components/artisan/reviews/artisanReviewsMock";
import { ReplyInput } from "@/components/artisan/reviews/ReplyInput";

const CRITERIA_LABELS: Record<keyof ArtisanReview["criteria"], string> = {
  quality: "Qualité",
  punctuality: "Ponctualité",
  communication: "Comm.",
  price: "Prix",
  cleanliness: "Propreté",
};

type ReviewCardProps = {
  review: ArtisanReview;
  onReply: (id: number, text: string) => void;
};

export function ReviewCard({ review, onReply }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 rounded-2xl border bg-white p-5 ${
        review.rating <= 3 ? "border-[rgba(220,38,38,0.2)]" : "border-[#E5E0D8]"
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white"
            style={{ background: review.client.color }}
          >
            {review.client.initials}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#0F1E35]">{review.client.name}</div>
            <div className="mt-0.5 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`text-[13px] ${s <= review.rating ? "text-[#F05A1A]" : "text-[#E5E0D8]"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-[#6B7280]">· {review.mission}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-[11px] text-[#6B7280]">{review.date}</div>
          <div className="mt-0.5 text-[11px] font-semibold text-[#1B8A4E]">
            {review.missionPrice} MAD
          </div>
        </div>
      </div>

      <p className="mb-3 text-[13px] italic leading-[1.6] text-[#0F1E35]">&ldquo;{review.comment}&rdquo;</p>

      <div className="mb-3 rounded-xl bg-[#FAF7F2] p-3">
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(review.criteria) as [keyof ArtisanReview["criteria"], number][]).map(
            ([key, val]) => (
              <div key={key} className="text-center">
                <div className="mb-1 truncate text-[9px] capitalize text-[#6B7280]">
                  {CRITERIA_LABELS[key]}
                </div>
                <div
                  className={`text-[12px] font-bold ${
                    val === 5 ? "text-[#1B8A4E]" : val === 4 ? "text-[#0F1E35]" : "text-[#DC2626]"
                  }`}
                >
                  {val}/5
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {review.rating <= 3 && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-[rgba(220,38,38,0.12)] bg-[rgba(220,38,38,0.04)] px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0 text-[#DC2626]" />
          <span className="text-[11px] text-[#DC2626]">
            Note basse — Répondre à cet avis améliore votre réputation
          </span>
        </div>
      )}

      {review.reply && (
        <div className="mb-3 rounded-r-xl border-l-2 border-[#0F1E35] bg-[rgba(15,30,53,0.04)] py-2.5 pl-3 pr-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#0F1E35]">
            Votre réponse
          </div>
          <p className="text-[12px] leading-[1.5] text-[#0F1E35]">{review.reply}</p>
        </div>
      )}

      {!review.reply && <ReplyInput reviewId={review.id} onReply={onReply} />}
    </motion.div>
  );
}
