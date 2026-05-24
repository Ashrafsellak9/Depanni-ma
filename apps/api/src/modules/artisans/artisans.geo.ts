import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";

const REDIS_GEO_KEY = "depanni:artisans:geo";

export async function syncArtisanGeo(
  artisanId: string,
  lat: number,
  lng: number,
): Promise<void> {
  const redis = getRedis();
  await redis.geoadd(REDIS_GEO_KEY, lng, lat, artisanId);

  await prisma.$executeRaw`
    UPDATE artisans
    SET
      "currentLat" = ${lat},
      "currentLng" = ${lng},
      location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${artisanId}
  `;
}

export interface NearbyArtisanRow {
  id: string;
  userId: string;
  rating: number;
  artisanScore: number;
  isVerified: boolean;
  isTopArtisan: boolean;
  hourlyRate: number | null;
  distanceMeters: number;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export async function findNearbyArtisans(params: {
  lat: number;
  lng: number;
  radiusKm: number;
  categoryId?: string;
  limit?: number;
}): Promise<NearbyArtisanRow[]> {
  const radiusMeters = params.radiusKm * 1000;
  const limit = params.limit ?? 20;

  if (params.categoryId) {
    return prisma.$queryRaw<NearbyArtisanRow[]>`
      SELECT
        a.id,
        a."userId",
        a.rating,
        a."artisanScore",
        a."isVerified",
        a."isTopArtisan",
        a."hourlyRate",
        ST_Distance(
          a.location,
          ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography
        ) AS "distanceMeters",
        u."firstName",
        u."lastName",
        u."avatarUrl"
      FROM artisans a
      INNER JOIN users u ON u.id = a."userId"
      INNER JOIN artisan_categories ac ON ac."artisanId" = a.id
      WHERE a."isAvailable" = true
        AND a."verificationStatus" = 'APPROVED'::"ArtisanVerificationStatus"
        AND a.location IS NOT NULL
        AND ac."categoryId" = ${params.categoryId}
        AND ST_DWithin(
          a.location,
          ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY "distanceMeters" ASC
      LIMIT ${limit}
    `;
  }

  return prisma.$queryRaw<NearbyArtisanRow[]>`
    SELECT
      a.id,
      a."userId",
      a.rating,
      a."artisanScore",
      a."isVerified",
      a."isTopArtisan",
      a."hourlyRate",
      ST_Distance(
        a.location,
        ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography
      ) AS "distanceMeters",
      u."firstName",
      u."lastName",
      u."avatarUrl"
    FROM artisans a
    INNER JOIN users u ON u.id = a."userId"
    WHERE a."isAvailable" = true
      AND a."verificationStatus" = 'APPROVED'::"ArtisanVerificationStatus"
      AND a.location IS NOT NULL
      AND ST_DWithin(
        a.location,
        ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography,
        ${radiusMeters}
      )
    ORDER BY "distanceMeters" ASC
    LIMIT ${limit}
  `;
}

/** Fallback Redis GEORADIUS si PostGIS indisponible. */
export async function findNearbyFromRedis(
  lat: number,
  lng: number,
  radiusKm: number,
  limit = 20,
): Promise<string[]> {
  const redis = getRedis();
  const results = await redis.georadius(
    REDIS_GEO_KEY,
    lng,
    lat,
    radiusKm,
    "km",
    "ASC",
    "COUNT",
    limit,
  );
  return results as string[];
}

export async function syncBaseLocationGeo(
  artisanId: string,
  lat: number,
  lng: number,
): Promise<void> {
  await prisma.$executeRaw`
    UPDATE artisans
    SET
      "baseLat" = ${lat},
      "baseLng" = ${lng},
      location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${artisanId}
  `;
  await syncArtisanGeo(artisanId, lat, lng);
}
