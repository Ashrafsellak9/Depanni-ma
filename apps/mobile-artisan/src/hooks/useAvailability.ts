import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { getApiErrorMessage } from "@/src/lib/api";
import {
  isTrackingActive,
  startAvailabilityTracking,
  stopAvailabilityTracking,
} from "@/src/services/availability";
import { useJobsFeedStore } from "@/src/store/jobsFeedStore";
import type { ArtisanProfile } from "@/src/types/artisan";

export function useAvailability(profile: ArtisanProfile | undefined) {
  const qc = useQueryClient();
  const incrementNewJob = useJobsFeedStore((s) => s.incrementNewJob);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOnline =
    profile?.availabilityStatus === "ONLINE" || isTrackingActive();

  const toggle = useMutation({
    mutationFn: async (next: boolean) => {
      if (!profile) throw new Error("Profil non chargé");
      if (next && profile.kycStatus !== "APPROVED") {
        throw new Error("KYC requis pour passer en ligne");
      }

      setBusy(true);
      try {
        if (next) {
          await startAvailabilityTracking(
            profile.id,
            profile.zones.length ? profile.zones : ["Casablanca"],
            profile.specialties,
            (job) => incrementNewJob(typeof job.id === "string" ? job.id : undefined),
          );
        } else {
          await stopAvailabilityTracking();
        }
        await qc.invalidateQueries({ queryKey: ["artisan-profile"] });
      } finally {
        setBusy(false);
      }
    },
    onError: (e) => setError(getApiErrorMessage(e)),
  });

  const resumeIfOnline = useCallback(() => {
    if (!profile || profile.availabilityStatus !== "ONLINE" || isTrackingActive()) {
      return;
    }
    void startAvailabilityTracking(
      profile.id,
      profile.zones.length ? profile.zones : ["Casablanca"],
      profile.specialties,
      (job) => incrementNewJob(typeof job.id === "string" ? job.id : undefined),
    ).then(() => qc.invalidateQueries({ queryKey: ["artisan-profile"] }));
  }, [profile, incrementNewJob, qc]);

  return { isOnline, busy, error, toggle, resumeIfOnline, setError };
}
