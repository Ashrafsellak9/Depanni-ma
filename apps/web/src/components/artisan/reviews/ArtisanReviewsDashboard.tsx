"use client";

import { useMemo, useState } from "react";

import { ReviewsList } from "@/components/artisan/reviews/ReviewsList";
import { ReviewsSidebar } from "@/components/artisan/reviews/ReviewsSidebar";
import { MOCK_REVIEWS } from "@/components/artisan/reviews/artisanReviewsMock";
import type { ArtisanReview } from "@/components/artisan/reviews/artisanReviewsMock";

export function ArtisanReviewsDashboard() {
  const [reviews, setReviews] = useState<ArtisanReview[]>(MOCK_REVIEWS);

  const unrepliedCount = useMemo(() => reviews.filter((r) => !r.reply).length, [reviews]);

  const handleReply = (id: number, text: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: text } : r)));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ReviewsList reviews={reviews} onReply={handleReply} />
      </div>
      <div className="lg:col-span-4">
        <ReviewsSidebar unrepliedCount={unrepliedCount} />
      </div>
    </div>
  );
}
