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
      lat = ${lat},
      lng = ${lng},
      location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${artisanId}
  `;
}

export interface NearbyArtisanRow {
  id: string;
  userId: string;
  rating: number;
  totalMissions: number;
  badgeVerified: boolean;
  badgeTop: boolean;
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
  categorySlug?: string;
  limit?: number;
}): Promise<NearbyArtisanRow[]> {
  const radiusMeters = params.radiusKm * 1000;
  const limit = params.limit ?? 20;

  if (params.categorySlug) {
    return prisma.$queryRaw<NearbyArtisanRow[]>`
      SELECT
        a.id,
        a."userId",
        a.rating,
        a."totalMissions",
        a."badgeVerified",
        a."badgeTop",
        a."hourlyRate",
        ST_Distance(
          a.location,
          ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography
        ) AS "distanceMeters",
        a."firstName",
        a."lastName",
        a.avatar AS "avatarUrl"
      FROM artisans a
      WHERE a."availabilityStatus" = 'ONLINE'::"AvailabilityStatus"
        AND a."kycStatus" = 'APPROVED'::"KycStatus"
        AND a.location IS NOT NULL
        AND ${params.categorySlug} = ANY(a.specialties)
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
      a."totalMissions",
      a."badgeVerified",
      a."badgeTop",
      a."hourlyRate",
      ST_Distance(
        a.location,
        ST_SetSRID(ST_MakePoint(${params.lng}, ${params.lat}), 4326)::geography
      ) AS "distanceMeters",
      a."firstName",
      a."lastName",
      a.avatar AS "avatarUrl"
    FROM artisans a
    WHERE a."availabilityStatus" = 'ONLINE'::"AvailabilityStatus"
      AND a."kycStatus" = 'APPROVED'::"KycStatus"
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
  await syncArtisanGeo(artisanId, lat, lng);
}
