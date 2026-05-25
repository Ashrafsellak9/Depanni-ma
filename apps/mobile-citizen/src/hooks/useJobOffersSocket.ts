import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getJobsSocket } from "@/src/lib/socket";
import type { CitizenJob, OfferSocketPayload } from "@/src/types/job";

export function useJobOffersSocket(jobId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!jobId) return;

    const socket = getJobsSocket();
    socket.connect();

    const handler = (payload: OfferSocketPayload) => {
      if (payload.jobId !== jobId) return;

      void queryClient.invalidateQueries({ queryKey: ["mission-detail", jobId] });

      queryClient.setQueryData<CitizenJob>(["mission-detail", jobId], (old) => {
        if (!old) return old;
        const exists = old.offers?.some((o) => o.id === payload.offer.id);
        if (exists) return old;
        const newOffer = {
          id: payload.offer.id,
          jobId: payload.jobId,
          artisanId: payload.offer.artisan?.id ?? "",
          price: payload.offer.price,
          etaMinutes: payload.offer.etaMinutes ?? null,
          message: payload.offer.message ?? null,
          status: "PENDING" as const,
          createdAt: payload.offer.createdAt,
          artisan: payload.offer.artisan
            ? {
                id: payload.offer.artisan.id,
                firstName: payload.offer.artisan.firstName,
                lastName: payload.offer.artisan.lastName,
                avatar: payload.offer.artisan.avatar,
              }
            : undefined,
        };
        return {
          ...old,
          offerCount: (old.offerCount ?? 0) + 1,
          offers: [...(old.offers ?? []), newOffer],
        };
      });

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    socket.on("job:offer:new", handler);
    return () => {
      socket.off("job:offer:new", handler);
    };
  }, [jobId, queryClient]);
}
