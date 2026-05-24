"use client";

import { useCallback, useEffect, useState } from "react";

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(watch = false) {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    loading: true,
    error: null,
  });

  const onSuccess = useCallback((pos: GeolocationPosition) => {
    setState({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      loading: false,
      error: null,
    });
  }, []);

  const onError = useCallback((err: GeolocationPositionError) => {
    setState((s) => ({
      ...s,
      loading: false,
      error: err.message,
    }));
  }, []);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: "Géolocalisation non supportée" }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 15000,
    });
  }, [onSuccess, onError]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: false, error: "Géolocalisation non supportée" }));
      return;
    }

    if (watch) {
      const id = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
      });
      return () => navigator.geolocation.clearWatch(id);
    }

    refresh();
  }, [watch, onSuccess, onError, refresh]);

  return { ...state, refresh };
}
