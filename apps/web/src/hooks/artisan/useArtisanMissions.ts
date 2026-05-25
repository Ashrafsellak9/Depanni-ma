"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { MissionsListResponse } from "@/types/artisan";
import type { MissionStatus } from "@/types";

export interface ArtisanMissionsFilters {
  status?: MissionStatus;
  search?: string;
  cursor?: string;
  limit?: number;
}

export function useArtisanMissions(filters: ArtisanMissionsFilters = {}) {
  return useQuery({
    queryKey: ["artisan-missions", filters],
    queryFn: async () => {
      const res = await api.get("/artisans/me/missions", {
        params: {
          limit: filters.limit ?? 20,
          ...(filters.cursor ? { cursor: filters.cursor } : {}),
          ...(filters.status ? { status: filters.status } : {}),
          ...(filters.search ? { search: filters.search } : {}),
        },
      });
      return unwrapApi<MissionsListResponse>(res);
    },
  });
}

export function useArtisanMission(missionId: string) {
  return useQuery({
    queryKey: ["artisan-mission", missionId],
    queryFn: async () => {
      const res = await api.get(`/artisans/me/missions/${missionId}`);
      return unwrapApi<import("@/types/artisan").ArtisanMission>(res);
    },
    enabled: !!missionId,
    refetchInterval: (q) => {
      const s = q.state.data?.status;
      return s && ["ACCEPTED", "IN_PROGRESS"].includes(s) ? 10_000 : false;
    },
  });
}
