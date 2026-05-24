import { getMapsApiKey, getMapsClient } from "../../config/maps.js";
import { getRedis } from "../../config/redis.js";
import { AppError } from "../../utils/errors.js";

const LOCATION_TTL_SECONDS = 300;

export interface ArtisanLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

export class TrackingService {
  private redisKey(artisanId: string): string {
    return `tracking:artisan:${artisanId}`;
  }

  async updateLocation(artisanId: string, lat: number, lng: number): Promise<ArtisanLocation> {
    const location: ArtisanLocation = { lat, lng, updatedAt: new Date().toISOString() };
    await getRedis().setex(this.redisKey(artisanId), LOCATION_TTL_SECONDS, JSON.stringify(location));
    return location;
  }

  async getLocation(artisanId: string): Promise<ArtisanLocation | null> {
    const raw = await getRedis().get(this.redisKey(artisanId));
    if (!raw) return null;
    return JSON.parse(raw) as ArtisanLocation;
  }

  async getEta(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ): Promise<{ durationMinutes: number; distanceKm: number }> {
    const client = getMapsClient();
    if (!client) {
      throw new AppError(503, "MAPS_UNAVAILABLE", "Service cartographique indisponible");
    }

    const response = await client.distancematrix({
      params: {
        origins: [`${origin.lat},${origin.lng}`],
        destinations: [`${destination.lat},${destination.lng}`],
        key: getMapsApiKey(),
      },
    });

    const element = response.data.rows[0]?.elements[0];
    if (!element || element.status !== "OK") {
      throw new AppError(400, "ROUTE_ERROR", "Impossible de calculer l'itinéraire");
    }

    return {
      durationMinutes: Math.ceil((element.duration?.value ?? 0) / 60),
      distanceKm: (element.distance?.value ?? 0) / 1000,
    };
  }
}

export const trackingService = new TrackingService();
