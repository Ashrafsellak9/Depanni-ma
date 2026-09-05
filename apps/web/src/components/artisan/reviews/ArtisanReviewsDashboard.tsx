"use client";

import { useMemo, useState } from "react";

import { ReviewsList } from "@/components/artisan/reviews/ReviewsList";
import { ReviewsSidebar } from "@/components/artisan/reviews/ReviewsSidebar";
import type { ArtisanReview } from "@/components/artisan/reviews/artisanReviewsMock";
import { useArtisanReviews } from "@/hooks/artisan/useArtisanReviews";

const COLORS = ["#1E3A5F", "#7C3AED", "#059669", "#DC2626", "#B45309"];

function mapReview(
  row: {
    id: string;
    rating: number;
    comment: string | null;
    criteria: Record<string, number> | null;
    createdAt: string;
    author?: { citizen?: { firstName: string; lastName: string } | null };
    mission?: { totalAmount: number; job: { title: string } };
  },
  index: number,
): ArtisanReview {
  const first = row.author?.citizen?.firstName ?? "Client";
  const last = row.author?.citizen?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  const criteria = {
    quality: row.criteria?.quality ?? row.rating,
    punctuality: row.criteria?.punctuality ?? row.rating,
    communication: row.criteria?.communication ?? row.rating,
    price: row.criteria?.price ?? row.rating,
    cleanliness: row.criteria?.cleanliness ?? row.rating,
  };
  return {
    id: index + 1,
    client: {
      name,
      initials: `${first[0] ?? "C"}${last[0] ?? ""}`.toUpperCase(),
      color: COLORS[index % COLORS.length]!,
    },
    rating: row.rating,
    comment: row.comment ?? "",
    date: new Date(row.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    }),
    mission: row.mission?.job.title ?? "Mission",
    criteria,
    reply: null,
    missionPrice: row.mission?.totalAmount ?? 0,
  };
}

export function ArtisanReviewsDashboard() {
  const { data } = useArtisanReviews();
  const mapped = useMemo(() => (data ?? []).map(mapReview), [data]);
  const [localReplies, setLocalReplies] = useState<Record<number, string>>({});

  const reviews = mapped.map((r) =>
    localReplies[r.id] ? { ...r, reply: localReplies[r.id]! } : r,
  );
  const unrepliedCount = reviews.filter((r) => !r.reply).length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <ReviewsList
          reviews={reviews}
          onReply={(id, text) => setLocalReplies((prev) => ({ ...prev, [id]: text }))}
        />
      </div>
      <div className="lg:col-span-4">
        <ReviewsSidebar unrepliedCount={unrepliedCount} />
      </div>
    </div>
  );
}
