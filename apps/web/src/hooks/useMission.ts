"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { JobSummary, MissionSummary, OfferSummary } from "@/types";

interface MissionDetail {
  job: JobSummary & { description?: string; address?: string };
  mission?: MissionSummary;
  offers?: OfferSummary[];
}

export function useMission(jobId: string) {
  return useQuery({
    queryKey: ["mission", jobId],
    queryFn: async () => {
      const { data } = await api.get<{ data: MissionDetail }>(`/jobs/${jobId}`);
      return data.data;
    },
    enabled: !!jobId,
  });
}

export function useCitizenJobs(status?: string) {
  return useQuery({
    queryKey: ["citizen-jobs", status],
    queryFn: async () => {
      const { data } = await api.get<{
        data: { items: JobSummary[]; pagination: unknown };
      }>("/jobs/my", { params: status ? { status } : {} });
      return data.data;
    },
  });
}
