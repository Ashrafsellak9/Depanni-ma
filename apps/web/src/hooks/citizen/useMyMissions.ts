"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { CitizenJob, Pagination } from "@/types/citizen";
import type { JobStatus } from "@/types";

export interface MyMissionsFilters {
  status?: JobStatus;
  page?: number;
  limit?: number;
}

export function useMyMissions(filters: MyMissionsFilters = {}) {
  return useQuery({
    queryKey: ["my-missions", filters],
    queryFn: async () => {
      const res = await api.get("/jobs/my", {
        params: {
          page: filters.page ?? 1,
          limit: filters.limit ?? 20,
          ...(filters.status ? { status: filters.status } : {}),
        },
      });
      return unwrapApi<{ items: CitizenJob[]; pagination: Pagination }>(res);
    },
  });
}

export function useActiveMission() {
  const query = useMyMissions({ limit: 50 });
  const active = query.data?.items.find((j) =>
    ["ACTIVE", "IN_PROGRESS"].includes(j.status),
  );
  return { ...query, activeMission: active };
}
