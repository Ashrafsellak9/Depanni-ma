import { create } from "zustand";

export const useJobsFeedStore = create<{
  newJobsCount: number;
  lastJobId: string | null;
  incrementNewJob: (jobId?: string) => void;
  clearNewJobs: () => void;
}>((set) => ({
  newJobsCount: 0,
  lastJobId: null,
  incrementNewJob: (jobId) =>
    set((s) => ({
      newJobsCount: s.newJobsCount + 1,
      lastJobId: jobId ?? s.lastJobId,
    })),
  clearNewJobs: () => set({ newJobsCount: 0, lastJobId: null }),
}));
