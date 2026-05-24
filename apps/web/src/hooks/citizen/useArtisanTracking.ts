"use client";

import { useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import { unwrapApi } from "@/lib/api-types";
import { getTrackingSocket } from "@/lib/socket";
import type { TrackingPosition, TrackingView } from "@/types/citizen";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function useArtisanTracking(missionId: string | undefined, enabled: boolean) {
  const [position, setPosition] = useState<TrackingPosition | null>(null);
  const [tracking, setTracking] = useState<TrackingView | null>(null);
  const targetRef = useRef<TrackingPosition | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!missionId || !enabled) return;

    void api.get(`/tracking/missions/${missionId}`).then((res) => {
      const data = unwrapApi<TrackingView>(res);
      setTracking(data);
      if (data.position) setPosition(data.position);
    });
  }, [missionId, enabled]);

  useEffect(() => {
    if (!missionId || !enabled) return;

    const socket = getTrackingSocket();
    socket.connect();
    socket.emit("tracking:join", { missionId });

    const onPosition = (payload: TrackingPosition) => {
      if (payload.missionId !== missionId && payload.missionId) return;
      targetRef.current = payload;
    };

    socket.on("tracking:position", onPosition);

    const animate = () => {
      const target = targetRef.current;
      if (target) {
        setPosition((prev) => {
          if (!prev) return target;
          return {
            ...target,
            lat: lerp(prev.lat, target.lat, 0.15),
            lng: lerp(prev.lng, target.lng, 0.15),
          };
        });
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      socket.off("tracking:position", onPosition);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [missionId, enabled]);

  return { position, tracking, eta: tracking?.eta ?? null, arrived: tracking?.arrived ?? false };
}
