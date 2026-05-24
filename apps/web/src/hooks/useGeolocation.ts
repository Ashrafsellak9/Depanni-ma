"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  source: "gps" | "ip" | null;
}

const CASABLANCA = { lat: 33.5731, lng: -7.5898 };
const REFRESH_MS = 10_000;

async function fetchIpGeolocation(): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { latitude?: number; longitude?: number };
    if (data.latitude == null || data.longitude == null) return null;
    return { lat: data.latitude, lng: data.longitude };
  } catch {
    return null;
  }
}

export function useGeolocation(options?: { watch?: boolean; fallbackIp?: boolean }) {
  const watch = options?.watch ?? true;
  const fallbackIp = options?.fallbackIp ?? true;

  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    loading: true,
    error: null,
    source: null,
  });

  const watchIdRef = useRef<number | null>(null);

  const applyPosition = useCallback((pos: GeolocationPosition) => {
    setState({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      loading: false,
      error: null,
      source: "gps",
    });
  }, []);

  const applyIpFallback = useCallback(async () => {
    const ip = await fetchIpGeolocation();
    if (ip) {
      setState({
        lat: ip.lat,
        lng: ip.lng,
        accuracy: null,
        loading: false,
        error: null,
        source: "ip",
      });
      return true;
    }
    setState({
      lat: CASABLANCA.lat,
      lng: CASABLANCA.lng,
      accuracy: null,
      loading: false,
      error: "Position par défaut (Casablanca)",
      source: null,
    });
    return false;
  }, []);

  const onError = useCallback(
    async (err: GeolocationPositionError) => {
      if (fallbackIp) {
        await applyIpFallback();
        return;
      }
      setState((s) => ({
        ...s,
        loading: false,
        error: err.message,
      }));
    },
    [applyIpFallback, fallbackIp],
  );

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      void applyIpFallback();
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (e) => void onError(e),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 5_000 },
    );
  }, [applyPosition, applyIpFallback, onError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      void applyIpFallback();
      return;
    }

    if (watch) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        applyPosition,
        (e) => void onError(e),
        { enableHighAccuracy: true, maximumAge: 5_000, timeout: 15_000 },
      );
    } else {
      refresh();
    }

    const interval = setInterval(refresh, REFRESH_MS);

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      clearInterval(interval);
    };
  }, [watch, applyPosition, applyIpFallback, onError, refresh]);

  return { ...state, refresh };
}
