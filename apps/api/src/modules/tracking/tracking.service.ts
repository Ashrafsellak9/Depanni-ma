import { prisma } from "../../config/db.js";
import { getMapsApiKey, getMapsClient } from "../../config/maps.js";
import { getRedis } from "../../config/redis.js";
import { syncArtisanGeo } from "../artisans/artisans.geo.js";
import { AppError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { trackingUpdateSchema } from "./tracking.schemas.js";

const LOCATION_TTL_SECONDS = 600;
const BROADCAST_INTERVAL_MS = 10_000;
const ARRIVED_THRESHOLD_METERS = 500;

export interface MissionPosition {
  missionId: string;
  artisanId: string;
  lat: number;
  lng: number;
  bearing?: number;
  speed?: number;
  updatedAt: string;
}

export interface MissionTrackingView {
  missionId: string;
  position: MissionPosition | null;
  eta: { durationMinutes: number; distanceKm: number } | null;
  arrived: boolean;
  started: boolean;
}

export class TrackingService {
  private missionKey(missionId: string): string {
    return `tracking:mission:${missionId}`;
  }

  private broadcastKey(missionId: string): string {
    return `tracking:mission:${missionId}:last_broadcast`;
  }

  private arrivedKey(missionId: string): string {
    return `tracking:mission:${missionId}:arrived`;
  }

  private startedKey(missionId: string): string {
    return `tracking:mission:${missionId}:started`;
  }

  async assertMissionTrackingAccess(
    missionId: string,
    userId: string,
    role: string,
  ): Promise<{
    job: {
      id: string;
      citizenId: string;
      locationLat: number;
      locationLng: number;
      status: string;
    };
    artisanId: string | null;
    artisanUserId: string | null;
  }> {
    const job = await prisma.job.findUnique({
      where: { id: missionId },
      include: {
        acceptedOffer: { include: { artisan: { select: { id: true, userId: true } } } },
      },
    });
    if (!job) throw new NotFoundError("Mission");
    if (!job.acceptedOffer) {
      throw new ForbiddenError("Aucun artisan assigné à cette mission");
    }

    const artisanUserId = job.acceptedOffer.artisan.userId;
    const artisanId = job.acceptedOffer.artisan.id;
    const isCitizen = job.citizenId === userId;
    const isArtisan = artisanUserId === userId;

    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError();
    }

    if (!["ACTIVE", "IN_PROGRESS"].includes(job.status) && role !== "ADMIN") {
      throw new ForbiddenError("Suivi GPS indisponible pour ce statut");
    }

    return {
      job: {
        id: job.id,
        citizenId: job.citizenId,
        locationLat: job.locationLat,
        locationLng: job.locationLng,
        status: job.status,
      },
      artisanId,
      artisanUserId,
    };
  }

  haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  async updateMissionPosition(
    artisanUserId: string,
    artisanId: string | undefined,
    input: unknown,
  ): Promise<{ position: MissionPosition; broadcasted: boolean; arrived: boolean }> {
    const data = trackingUpdateSchema.parse(input);

    const access = await this.assertMissionTrackingAccess(
      data.missionId,
      artisanUserId,
      "ARTISAN",
    );
    if (access.artisanUserId !== artisanUserId) {
      throw new ForbiddenError("Seul l'artisan assigné peut envoyer sa position");
    }

    const resolvedArtisanId = artisanId ?? access.artisanId!;
    await syncArtisanGeo(resolvedArtisanId, data.lat, data.lng);

    const position: MissionPosition = {
      missionId: data.missionId,
      artisanId: resolvedArtisanId,
      lat: data.lat,
      lng: data.lng,
      bearing: data.bearing,
      speed: data.speed,
      updatedAt: new Date().toISOString(),
    };

    const redis = getRedis();
    await redis.setex(this.missionKey(data.missionId), LOCATION_TTL_SECONDS, JSON.stringify(position));

    const distanceToClient = this.haversineMeters(
      data.lat,
      data.lng,
      access.job.locationLat,
      access.job.locationLng,
    );

    let arrived = false;
    if (distanceToClient < ARRIVED_THRESHOLD_METERS) {
      const wasSet = await redis.setnx(this.arrivedKey(data.missionId), "1");
      if (wasSet) {
        arrived = true;
        await redis.expire(this.arrivedKey(data.missionId), LOCATION_TTL_SECONDS);
      }
    }

    const lastBroadcast = await redis.get(this.broadcastKey(data.missionId));
    const now = Date.now();
    const shouldBroadcast =
      !lastBroadcast || now - Number(lastBroadcast) >= BROADCAST_INTERVAL_MS;

    if (shouldBroadcast) {
      await redis.set(this.broadcastKey(data.missionId), String(now), "EX", 60);
    }

    return { position, broadcasted: shouldBroadcast, arrived };
  }

  async markTrackingStarted(missionId: string, artisanUserId: string): Promise<void> {
    await this.assertMissionTrackingAccess(missionId, artisanUserId, "ARTISAN");
    await getRedis().setex(this.startedKey(missionId), LOCATION_TTL_SECONDS, "1");

    await prisma.job.update({
      where: { id: missionId },
      data: { status: "IN_PROGRESS" },
    });
  }

  async getMissionPosition(missionId: string): Promise<MissionPosition | null> {
    const raw = await getRedis().get(this.missionKey(missionId));
    if (!raw) return null;
    return JSON.parse(raw) as MissionPosition;
  }

  async getMissionTracking(
    missionId: string,
    userId: string,
    role: string,
  ): Promise<MissionTrackingView> {
    const access = await this.assertMissionTrackingAccess(missionId, userId, role);
    const redis = getRedis();

    const [position, arrived, started] = await Promise.all([
      this.getMissionPosition(missionId),
      redis.get(this.arrivedKey(missionId)),
      redis.get(this.startedKey(missionId)),
    ]);

    let eta: { durationMinutes: number; distanceKm: number } | null = null;
    if (position) {
      try {
        eta = await this.getEta(
          { lat: position.lat, lng: position.lng },
          { lat: access.job.locationLat, lng: access.job.locationLng },
        );
      } catch {
        eta = null;
      }
    }

    return {
      missionId,
      position,
      eta,
      arrived: Boolean(arrived),
      started: Boolean(started),
    };
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
      distanceKm: Math.round(((element.distance?.value ?? 0) / 1000) * 100) / 100,
    };
  }

  // Legacy artisan-level tracking (REST rétrocompat)
  async updateLocation(artisanId: string, lat: number, lng: number): Promise<MissionPosition> {
    await syncArtisanGeo(artisanId, lat, lng);
    return {
      missionId: "",
      artisanId,
      lat,
      lng,
      updatedAt: new Date().toISOString(),
    };
  }

  async getLocation(artisanId: string): Promise<MissionPosition | null> {
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan?.currentLat || !artisan.currentLng) return null;
    return {
      missionId: "",
      artisanId,
      lat: artisan.currentLat,
      lng: artisan.currentLng,
      updatedAt: artisan.updatedAt.toISOString(),
    };
  }
}

export const trackingService = new TrackingService();
