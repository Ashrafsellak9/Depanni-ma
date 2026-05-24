"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { ActiveJobFeed } from "@/types/artisan";

export function useActiveJobs(lat: number | null, lng: number | null) {
  return useQuery({
    queryKey: ["active-jobs", lat, lng],
    queryFn: async () => {
      const res = await api.get("/jobs/active", {
        params: { lat, lng, limit: 20 },
      });
      return unwrapApi<ActiveJobFeed[]>(res);
    },
    enabled: lat != null && lng != null,
    staleTime: 20_000,
  });
}
