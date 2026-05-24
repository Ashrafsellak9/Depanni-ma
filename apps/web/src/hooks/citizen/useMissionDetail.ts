"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import type { CitizenJob } from "@/types/citizen";

const POLL_STATUSES = new Set(["ACTIVE", "IN_PROGRESS", "PENDING"]);

export function useMissionDetail(jobId: string) {
  return useQuery({
    queryKey: ["mission-detail", jobId],
    queryFn: async () => {
      const res = await api.get(`/jobs/${jobId}`);
      return unwrapApi<CitizenJob>(res);
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const job = query.state.data;
      const jobActive = job?.status && POLL_STATUSES.has(job.status);
      const missionActive =
        job?.mission?.status &&
        ["ACCEPTED", "IN_PROGRESS"].includes(job.mission.status);
      if (jobActive || missionActive) {
        return 10_000;
      }
      return false;
    },
  });
}
