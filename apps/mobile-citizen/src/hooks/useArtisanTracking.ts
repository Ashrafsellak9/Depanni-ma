import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

import { fetchDrivingRoute, haversineMeters } from "@/src/lib/directions";
import { getTrackingSocket } from "@/src/lib/socket";
import { fetchMissionTracking } from "@/src/services/tracking";
import type { TrackingPosition, TrackingView } from "@/src/types/mission";

const ARRIVAL_THRESHOLD_M = 500;

export function useArtisanTracking(
  missionId: string | undefined,
  jobLat: number,
  jobLng: number,
  enabled: boolean,
  onArrived?: () => void,
) {
  const [tracking, setTracking] = useState<TrackingView | null>(null);
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const nearAlertSentRef = useRef(false);

  const artisanLat = useRef(new Animated.Value(jobLat)).current;
  const artisanLng = useRef(new Animated.Value(jobLng)).current;
  const [displayPos, setDisplayPos] = useState({ lat: jobLat, lng: jobLng });

  useEffect(() => {
    if (!missionId || !enabled) return;
    void fetchMissionTracking(missionId).then((data) => {
      setTracking(data);
      if (data.position) {
        artisanLat.setValue(data.position.lat);
        artisanLng.setValue(data.position.lng);
        setDisplayPos({ lat: data.position.lat, lng: data.position.lng });
        void fetchDrivingRoute(
          { lat: data.position.lat, lng: data.position.lng },
          { lat: jobLat, lng: jobLng },
        ).then(({ coordinates }) => setRouteCoords(coordinates));
      }
    });
  }, [missionId, enabled, artisanLat, artisanLng, jobLat, jobLng]);

  useEffect(() => {
    if (!missionId || !enabled) return;

    const socket = getTrackingSocket();
    socket.connect();
    socket.emit("tracking:join", { missionId });

    const animateTo = (target: TrackingPosition) => {
      Animated.parallel([
        Animated.timing(artisanLat, {
          toValue: target.lat,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(artisanLng, {
          toValue: target.lng,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();

      void fetchDrivingRoute(
        { lat: target.lat, lng: target.lng },
        { lat: jobLat, lng: jobLng },
      ).then(({ coordinates }) => setRouteCoords(coordinates));
    };

    const onPosition = (payload: TrackingPosition & { eta?: TrackingView["eta"] }) => {
      if (payload.missionId && payload.missionId !== missionId) return;
      animateTo(payload);

      const dist = haversineMeters(payload.lat, payload.lng, jobLat, jobLng);
      if (!nearAlertSentRef.current && dist < ARRIVAL_THRESHOLD_M) {
        nearAlertSentRef.current = true;
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        void Notifications.scheduleNotificationAsync({
          content: {
            title: "Artisan proche",
            body: "Votre artisan est à moins de 500 m",
          },
          trigger: null,
        });
      }

      setTracking((prev) =>
        prev
          ? {
              ...prev,
              position: payload,
              eta: payload.eta ?? prev.eta,
            }
          : prev,
      );
    };

    const onArrivedEvent = (payload: { missionId: string }) => {
      if (payload.missionId === missionId) onArrived?.();
    };

    socket.on("tracking:position", onPosition);
    socket.on("tracking:arrived", onArrivedEvent);

    const latListener = artisanLat.addListener(({ value }) =>
      setDisplayPos((p) => ({ ...p, lat: value })),
    );
    const lngListener = artisanLng.addListener(({ value }) =>
      setDisplayPos((p) => ({ ...p, lng: value })),
    );

    return () => {
      socket.off("tracking:position", onPosition);
      socket.off("tracking:arrived", onArrivedEvent);
      artisanLat.removeListener(latListener);
      artisanLng.removeListener(lngListener);
    };
  }, [missionId, enabled, jobLat, jobLng, artisanLat, artisanLng, onArrived]);

  return {
    tracking,
    displayPos,
    routeCoords,
    eta: tracking?.eta ?? null,
    arrived: tracking?.arrived ?? false,
  };
}
