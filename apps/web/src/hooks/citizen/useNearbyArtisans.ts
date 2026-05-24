"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { NearbyArtisan } from "@/types/citizen";

export function useNearbyArtisans(
  lat: number | null,
  lng: number | null,
  options?: { radius?: number; category?: string; limit?: number },
) {
  const enabled = lat != null && lng != null;

  return useQuery({
    queryKey: ["nearby-artisans", lat, lng, options],
    queryFn: async () => {
      const res = await api.get("/artisans/nearby", {
        params: {
          lat,
          lng,
          radius: options?.radius ?? 15,
          limit: options?.limit ?? 40,
          ...(options?.category ? { category: options.category } : {}),
        },
      });
      return unwrapApi<NearbyArtisan[]>(res);
    },
    enabled,
    staleTime: 30_000,
  });
}
