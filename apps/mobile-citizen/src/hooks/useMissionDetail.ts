import { useQuery } from "@tanstack/react-query";

import { fetchJob } from "@/src/services/jobs";
import type { JobStatus } from "@/src/types/job";

const POLL_STATUSES = new Set<JobStatus>(["ACTIVE", "IN_PROGRESS", "PENDING"]);

export function useMissionDetail(jobId: string) {
  return useQuery({
    queryKey: ["mission-detail", jobId],
    queryFn: () => fetchJob(jobId),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const job = query.state.data;
      if (job?.status && POLL_STATUSES.has(job.status)) return 10_000;
      return false;
    },
  });
}
