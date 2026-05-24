"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MapPin, Pause, Radio } from "lucide-react";
import toast from "react-hot-toast";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSetAvailability } from "@/hooks/artisan/useArtisanProfile";
import { getApiErrorMessage } from "@/lib/api";
import {
  flushLocationQueue,
  postLocation,
  registerArtisanServiceWorker,
  requestGeolocation,
  startLocationInterval,
} from "@/lib/artisan-location-sync";
import { API_URL } from "@/lib/api";
import { getAccessToken } from "@/lib/token";

interface AvailabilityToggleProps {
  isOnline: boolean;
  kycApproved: boolean;
  isLoading?: boolean;
}

export function AvailabilityToggle({
  isOnline,
  kycApproved,
  isLoading,
}: AvailabilityToggleProps) {
  const [online, setOnline] = useState(isOnline);
  const [busy, setBusy] = useState(false);
  const stopIntervalRef = useRef<(() => void) | null>(null);
  const setAvailability = useSetAvailability();

  useEffect(() => {
    setOnline(isOnline);
  }, [isOnline]);

  const stopTracking = useCallback(() => {
    stopIntervalRef.current?.();
    stopIntervalRef.current = null;
  }, []);

  const startTracking = useCallback(async () => {
    const reg = await registerArtisanServiceWorker();
    const token = getAccessToken();
    if (reg?.active && token) {
      reg.active.postMessage({
        type: "SET_TOKEN",
        token,
        apiUrl: `${API_URL}/api`,
      });
    }

    if (reg && "sync" in reg) {
      try {
        await (
          reg as ServiceWorkerRegistration & {
            sync: { register: (tag: string) => Promise<void> };
          }
        ).sync.register("artisan-location-sync");
      } catch {
        /* Background Sync non supporté */
      }
    }

    const coords = await requestGeolocation();
    await postLocation(coords);

    stopIntervalRef.current = startLocationInterval(async (c) => {
      await postLocation(c);
    }, 30_000);
  }, []);

  const handleToggle = async (checked: boolean) => {
    if (!kycApproved) {
      toast.error("KYC requis pour passer en ligne");
      return;
    }

    setBusy(true);
    try {
      if (checked) {
        await setAvailability.mutateAsync(true);
        setOnline(true);
        await startTracking();
        toast.success("Vous êtes disponible");
      } else {
        stopTracking();
        await setAvailability.mutateAsync(false);
        setOnline(false);
        await flushLocationQueue();
        toast("Mode pause activé", { icon: <Pause className="h-4 w-4" /> });
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setOnline(isOnline);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (online && kycApproved) {
      void startTracking().catch(() => undefined);
    }
    return () => stopTracking();
    // Reprendre le tracking au chargement si déjà en ligne
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-xl" />;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
      <div className="flex gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {online ? <Radio className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
        </div>
        <div>
          <p className="font-semibold text-navy">
            {online ? "Disponible" : "En pause"}
          </p>
          <p className="text-sm text-muted-foreground">
            {online
              ? "Position mise à jour toutes les 30 s"
              : "Activez pour recevoir des demandes"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="availability" className="sr-only">
          Disponibilité
        </Label>
        <Switch
          id="availability"
          checked={online}
          disabled={busy || !kycApproved}
          onCheckedChange={(v) => void handleToggle(v)}
        />
      </div>
    </div>
  );
}
