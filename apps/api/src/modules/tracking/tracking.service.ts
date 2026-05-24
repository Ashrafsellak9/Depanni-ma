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

  async resolveMissionId(missionOrJobId: string): Promise<string> {
    const byId = await prisma.mission.findUnique({ where: { id: missionOrJobId } });
    if (byId) return byId.id;
    const byJob = await prisma.mission.findUnique({ where: { jobId: missionOrJobId } });
    if (byJob) return byJob.id;
    throw new NotFoundError("Mission");
  }

  async assertMissionTrackingAccess(
    missionOrJobId: string,
    userId: string,
    role: string,
  ): Promise<{
    missionId: string;
    job: { id: string; lat: number; lng: number; status: string };
    artisanId: string;
    artisanUserId: string;
    citizenUserId: string;
  }> {
    const missionId = await this.resolveMissionId(missionOrJobId);

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        job: { select: { id: true, lat: true, lng: true, status: true } },
        citizen: { select: { userId: true } },
        artisan: { select: { id: true, userId: true } },
      },
    });
    if (!mission) throw new NotFoundError("Mission");

    const isCitizen = mission.citizen.userId === userId;
    const isArtisan = mission.artisan.userId === userId;

    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError();
    }

    if (!["ACTIVE", "IN_PROGRESS"].includes(mission.job.status) && role !== "ADMIN") {
      throw new ForbiddenError("Suivi GPS indisponible pour ce statut");
    }

    return {
      missionId,
      job: mission.job,
      artisanId: mission.artisan.id,
      artisanUserId: mission.artisan.userId,
      citizenUserId: mission.citizen.userId,
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

    const resolvedArtisanId = artisanId ?? access.artisanId;
    await syncArtisanGeo(resolvedArtisanId, data.lat, data.lng);

    const position: MissionPosition = {
      missionId: access.missionId,
      artisanId: resolvedArtisanId,
      lat: data.lat,
      lng: data.lng,
      bearing: data.bearing,
      speed: data.speed,
      updatedAt: new Date().toISOString(),
    };

    const redis = getRedis();
    await redis.setex(
      this.missionKey(access.missionId),
      LOCATION_TTL_SECONDS,
      JSON.stringify(position),
    );

    const distanceToClient = this.haversineMeters(
      data.lat,
      data.lng,
      access.job.lat,
      access.job.lng,
    );

    let arrived = false;
    if (distanceToClient < ARRIVED_THRESHOLD_METERS) {
      const wasSet = await redis.setnx(this.arrivedKey(access.missionId), "1");
      if (wasSet) {
        arrived = true;
        await redis.expire(this.arrivedKey(access.missionId), LOCATION_TTL_SECONDS);
      }
    }

    const lastBroadcast = await redis.get(this.broadcastKey(access.missionId));
    const now = Date.now();
    const shouldBroadcast =
      !lastBroadcast || now - Number(lastBroadcast) >= BROADCAST_INTERVAL_MS;

    if (shouldBroadcast) {
      await redis.set(this.broadcastKey(access.missionId), String(now), "EX", 60);
    }

    return { position, broadcasted: shouldBroadcast, arrived };
  }

  async markTrackingStarted(missionOrJobId: string, artisanUserId: string): Promise<void> {
    const access = await this.assertMissionTrackingAccess(missionOrJobId, artisanUserId, "ARTISAN");
    await getRedis().setex(this.startedKey(access.missionId), LOCATION_TTL_SECONDS, "1");

    await prisma.$transaction([
      prisma.mission.update({
        where: { id: access.missionId },
        data: { status: "IN_PROGRESS", startedAt: new Date() },
      }),
      prisma.job.update({
        where: { id: access.job.id },
        data: { status: "IN_PROGRESS" },
      }),
    ]);
  }

  async getMissionPosition(missionId: string): Promise<MissionPosition | null> {
    const resolved = await this.resolveMissionId(missionId);
    const raw = await getRedis().get(this.missionKey(resolved));
    if (!raw) return null;
    return JSON.parse(raw) as MissionPosition;
  }

  async getMissionTracking(
    missionOrJobId: string,
    userId: string,
    role: string,
  ): Promise<MissionTrackingView> {
    const access = await this.assertMissionTrackingAccess(missionOrJobId, userId, role);
    const redis = getRedis();

    const [position, arrived, started] = await Promise.all([
      this.getMissionPosition(access.missionId),
      redis.get(this.arrivedKey(access.missionId)),
      redis.get(this.startedKey(access.missionId)),
    ]);

    let eta: { durationMinutes: number; distanceKm: number } | null = null;
    if (position) {
      try {
        eta = await this.getEta(
          { lat: position.lat, lng: position.lng },
          { lat: access.job.lat, lng: access.job.lng },
        );
      } catch {
        eta = null;
      }
    }

    return {
      missionId: access.missionId,
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
    if (!artisan?.lat || !artisan?.lng) return null;
    return {
      missionId: "",
      artisanId,
      lat: artisan.lat,
      lng: artisan.lng,
      updatedAt: artisan.updatedAt.toISOString(),
    };
  }
}

export const trackingService = new TrackingService();
