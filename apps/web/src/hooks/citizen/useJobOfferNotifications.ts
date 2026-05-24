"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import { getJobsSocket } from "@/lib/socket";
import type { CitizenJob } from "@/types/citizen";

interface OfferEventPayload {
  jobId: string;
  offer: {
    id: string;
    price: number;
    etaMinutes?: number;
    artisan?: { firstName: string; lastName: string };
  };
}

function playOfferSound(urgent: boolean) {
  try {
    const audio = new Audio(urgent ? "/sounds/notification-urgent.mp3" : "/sounds/notification.mp3");
    audio.volume = 0.5;
    void audio.play().catch(() => {
      /* fichier absent ou autoplay bloqué */
    });
  } catch {
    /* ignore */
  }
}

export function useJobOfferNotifications(activeJobId?: string) {
  const queryClient = useQueryClient();
  const jobIdRef = useRef(activeJobId);
  jobIdRef.current = activeJobId;

  useEffect(() => {
    const socket = getJobsSocket();
    socket.connect();

    const handler = (payload: OfferEventPayload) => {
      void queryClient.invalidateQueries({ queryKey: ["mission-detail", payload.jobId] });
      void queryClient.invalidateQueries({ queryKey: ["my-missions"] });

      const name = payload.offer.artisan
        ? `${payload.offer.artisan.firstName} ${payload.offer.artisan.lastName}`
        : "Un artisan";

      toast.success(
        `${name} — ${payload.offer.price} MAD${payload.offer.etaMinutes ? ` · ${payload.offer.etaMinutes} min` : ""}`,
        { id: `offer-${payload.offer.id}` },
      );

      const job = queryClient.getQueryData<CitizenJob>(["mission-detail", payload.jobId]);
      const urgent =
        job?.urgency === "NOW" ||
        queryClient
          .getQueryData<{ items: CitizenJob[] }>(["my-missions", {}])
          ?.items.find((j) => j.id === payload.jobId)?.urgency === "NOW";

      if (payload.jobId === jobIdRef.current || urgent) {
        playOfferSound(!!urgent);
      }
    };

    socket.on("job:offer:new", handler);

    return () => {
      socket.off("job:offer:new", handler);
    };
  }, [queryClient]);
}
