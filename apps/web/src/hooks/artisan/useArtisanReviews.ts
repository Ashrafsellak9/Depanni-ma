"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";

export interface ArtisanReviewApi {
  id: string;
  rating: number;
  comment: string | null;
  criteria: Record<string, number> | null;
  createdAt: string;
  author?: { citizen?: { firstName: string; lastName: string } | null };
  mission?: { totalAmount: number; job: { title: string } };
}

export function useArtisanReviews() {
  return useQuery({
    queryKey: ["artisan-reviews"],
    queryFn: async () => {
      const res = await api.get("/reviews/me");
      return unwrapApi<ArtisanReviewApi[]>(res);
    },
  });
}
