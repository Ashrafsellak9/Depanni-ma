import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { hapticNewJobAlert, hapticOfferAccepted } from "@/src/lib/mission-haptics";
import { haversineKm } from "@/src/lib/job-offer-window";
import { getJobsSocket } from "@/src/lib/socket";
import * as Location from "expo-location";
import { useJobsFeedStore } from "@/src/store/jobsFeedStore";
import { useMissionAlertStore } from "@/src/store/missionAlertStore";
import type { IncomingJobPayload, OfferAcceptedPayload } from "@/src/types/job-alert";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function parseIncomingJob(raw: Record<string, unknown>): IncomingJobPayload | null {
  if (typeof raw.id !== "string" || typeof raw.createdAt !== "string") return null;
  return raw as unknown as IncomingJobPayload;
}

async function enrichWithDistance(job: IncomingJobPayload): Promise<IncomingJobPayload> {
  try {
    const pos = await Location.getLastKnownPositionAsync();
    if (!pos) return job;
    return {
      ...job,
      distanceKm: haversineKm(
        pos.coords.latitude,
        pos.coords.longitude,
        job.lat,
        job.lng,
      ),
    };
  } catch {
    return job;
  }
}

export function useMissionAlerts(enabled: boolean) {
  const router = useRouter();
  const openAlert = useMissionAlertStore((s) => s.openAlert);
  const notificationSub = useRef<Notifications.Subscription>();

  const handleNewJob = async (raw: Record<string, unknown>) => {
    const job = parseIncomingJob(raw);
    if (!job) return;

    const enriched = await enrichWithDistance(job);
    await hapticNewJobAlert(enriched.urgency);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Nouvelle mission à proximité",
        body: `${enriched.title} · ${enriched.distanceKm?.toFixed(1) ?? "?"} km`,
        data: { type: "job:new", jobId: enriched.id },
        sound: true,
      },
      trigger: null,
    });

    openAlert(enriched);
  };

  const handleOfferAccepted = async (data: OfferAcceptedPayload) => {
    await hapticOfferAccepted();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Offre acceptée !",
        body: "Le client a choisi votre proposition. Démarrez la mission.",
        data: { type: "job:offer:accepted", missionId: data.missionId },
        sound: true,
      },
      trigger: null,
    });

    router.push({
      pathname: "/mission/[id]",
      params: { id: data.missionId },
    } as never);
  };

  useEffect(() => {
    void Notifications.requestPermissionsAsync();

    if (!enabled) return;

    const socket = getJobsSocket();

    const onNew = (payload: Record<string, unknown>) => {
      const job = parseIncomingJob(payload);
      if (job) {
        useJobsFeedStore.getState().incrementNewJob(job.id);
      }
      void handleNewJob(payload);
    };
    const onAccepted = (payload: OfferAcceptedPayload) => {
      void handleOfferAccepted(payload);
    };

    socket.on("job:new", onNew);
    socket.on("job:offer:accepted", onAccepted);

    notificationSub.current = Notifications.addNotificationResponseReceivedListener((res) => {
      const data = res.notification.request.content.data as {
        type?: string;
        jobId?: string;
        missionId?: string;
      };
      if (data.type === "job:new" && data.jobId) {
        router.push({ pathname: "/offer/[jobId]", params: { jobId: data.jobId } } as never);
      }
      if (data.type === "job:offer:accepted" && data.missionId) {
        router.push({ pathname: "/mission/[id]", params: { id: data.missionId } } as never);
      }
    });

    return () => {
      socket.off("job:new", onNew);
      socket.off("job:offer:accepted", onAccepted);
      notificationSub.current?.remove();
    };
  }, [enabled, openAlert, router]);
}
