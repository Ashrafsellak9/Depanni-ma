import { create } from "zustand";

import type { IncomingJobPayload } from "@/src/types/job-alert";

interface MissionAlertState {
  activeJob: IncomingJobPayload | null;
  showAlert: boolean;
  openAlert: (job: IncomingJobPayload) => void;
  dismissAlert: () => void;
  clear: () => void;
}

export const useMissionAlertStore = create<MissionAlertState>((set) => ({
  activeJob: null,
  showAlert: false,
  openAlert: (job) => set({ activeJob: job, showAlert: true }),
  dismissAlert: () => set({ showAlert: false }),
  clear: () => set({ activeJob: null, showAlert: false }),
}));
