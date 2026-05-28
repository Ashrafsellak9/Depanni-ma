"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import toast from "react-hot-toast";

import type { ArtisanReview } from "@/components/artisan/reviews/artisanReviewsMock";
import {
  AVERAGE_RATING,
  TOTAL_REVIEWS,
  filterReviews,
  getFilterCounts,
  type ReviewFilterId,
} from "@/components/artisan/reviews/artisanReviewsMock";
import { ReviewCard } from "@/components/artisan/reviews/ReviewCard";

const FILTER_TABS: { label: string; id: ReviewFilterId }[] = [
  { label: "Tous", id: "all" },
  { label: "★★★★★", id: "5" },
  { label: "★★★★", id: "4" },
  { label: "★★★ et -", id: "low" },
  { label: "Sans réponse", id: "unreplied" },
];

type ReviewsListProps = {
  reviews: ArtisanReview[];
  onReply: (id: number, text: string) => void;
};

export function ReviewsList({ reviews, onReply }: ReviewsListProps) {
  const [filter, setFilter] = useState<ReviewFilterId>("all");
  const [visibleCount, setVisibleCount] = useState(4);

  const counts = useMemo(() => getFilterCounts(reviews), [reviews]);
  const filtered = useMemo(() => filterReviews(reviews, filter), [reviews, filter]);
  const visible = filtered.slice(0, visibleCount);
  const remaining =
    filter === "all"
      ? TOTAL_REVIEWS - visible.length
      : Math.max(0, filtered.length - visible.length);

  const handleExport = () => {
    toast.success("Export des avis en cours de préparation…");
  };

  const handleReply = (id: number, text: string) => {
    onReply(id, text);
    toast.success("Réponse publiée");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-['Syne'] text-[18px] font-bold text-[#0F1E35]">Mes avis clients</h2>
          <p className="text-[12px] text-[#6B7280]">
            {TOTAL_REVIEWS} avis · Note moyenne {AVERAGE_RATING}/5
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-2 text-[12px] text-[#0F1E35] transition-colors hover:bg-[#FAF7F2]"
        >
          <Download size={13} />
          Exporter
        </button>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFilter(f.id);
              setVisibleCount(4);
            }}
            className={`flex flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[12px] font-medium transition-all ${
              filter === f.id
                ? "bg-[#0F1E35] text-white"
                : "border border-[#E5E0D8] bg-white text-[#6B7280] hover:border-[#0F1E35]"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                filter === f.id
                  ? "bg-[rgba(255,255,255,0.2)] text-white"
                  : "bg-[#F4F0E8] text-[#6B7280]"
              }`}
            >
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center">
          <p className="text-[13px] text-[#6B7280]">Aucun avis pour ce filtre</p>
        </div>
      ) : (
        visible.map((review) => (
          <ReviewCard key={review.id} review={review} onReply={handleReply} />
        ))
      )}

      {remaining > 0 && visible.length > 0 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 4)}
            className="mx-auto flex items-center gap-2 rounded-xl border border-[#E5E0D8] bg-white px-6 py-3 text-[13px] text-[#6B7280] transition-colors hover:bg-[#FAF7F2]"
          >
            <ChevronDown size={15} />
            Voir plus d&apos;avis ({remaining} restants)
          </button>
        </div>
      )}
    </div>
  );
}
