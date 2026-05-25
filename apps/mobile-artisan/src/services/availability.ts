import * as Location from "expo-location";

import { postLocation, setAvailability } from "@/src/services/artisan";
import { connectArtisanJobsSocket, disconnectJobsSocket } from "@/src/lib/socket";

let locationSubscription: Location.LocationSubscription | null = null;

export async function startAvailabilityTracking(
  artisanId: string,
  zones: string[],
  specialties: string[],
  onNewJob?: (job: Record<string, unknown>) => void,
): Promise<void> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permission de localisation refusée");
  }

  await setAvailability(true);

  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
  await postLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });

  locationSubscription?.remove();
  locationSubscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 10_000,
      distanceInterval: 50,
    },
    async (location) => {
      try {
        await postLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch {
        /* retry on next tick */
      }
    },
  );

  connectArtisanJobsSocket(artisanId, zones, specialties, onNewJob ?? undefined);
}

export async function stopAvailabilityTracking(): Promise<void> {
  locationSubscription?.remove();
  locationSubscription = null;
  disconnectJobsSocket();
  await setAvailability(false);
}

export function isTrackingActive(): boolean {
  return locationSubscription != null;
}
