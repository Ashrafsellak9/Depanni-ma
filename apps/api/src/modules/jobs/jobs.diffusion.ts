import { prisma } from "../../config/db.js";
import { enqueueSms } from "../../jobs/smsQueue.js";
import { logger } from "../../utils/logger.js";
import {
  citizenUserRoom,
  jobCategoryRoom,
  jobCityRoom,
  publishJobEvent,
} from "./jobs.events.js";

const EXPAND_5_MIN_MS = 5 * 60 * 1000;
const EXPAND_10_MIN_MS = 10 * 60 * 1000;
const EXPIRE_MS = 30 * 60 * 1000;

export interface DiffusionJobPayload {
  jobId: string;
  action: "expand" | "expire";
  targetRadiusKm?: number;
}

export async function syncJobLocation(jobId: string, lat: number, lng: number): Promise<void> {
  await prisma.$executeRaw`
    UPDATE jobs
    SET
      "locationLat" = ${lat},
      "locationLng" = ${lng},
      location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    WHERE id = ${jobId}
  `;
}

export async function broadcastNewJob(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      citizen: { select: { firstName: true, lastName: true } },
      category: { select: { id: true, slug: true, nameFr: true } },
    },
  });
  if (!job || job.status !== "PENDING") return;

  const payload = {
    id: job.id,
    title: job.title,
    description: job.description,
    urgency: job.urgency,
    city: job.city,
    categoryId: job.categoryId,
    subcategory: job.subcategory,
    locationLat: job.locationLat,
    locationLng: job.locationLng,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    diffusionRadiusKm: job.diffusionRadiusKm,
    photos: job.photos,
    offerCount: job.offerCount,
    expiresAt: job.expiresAt?.toISOString(),
    createdAt: job.createdAt.toISOString(),
    category: job.category,
  };

  await publishJobEvent({
    event: "job:new",
    rooms: [jobCityRoom(job.city), jobCategoryRoom(job.categoryId)],
    data: payload,
  });

  logger.info("Job diffusion broadcast", {
    jobId,
    radiusKm: job.diffusionRadiusKm,
    city: job.city,
  });
}

export async function expandDiffusionRadius(
  jobId: string,
  targetRadiusKm: number,
): Promise<void> {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return;
  if (job.status !== "PENDING" || !job.acceptsOffers) return;
  if (job.offerCount >= 3) return;
  if (job.diffusionRadiusKm >= targetRadiusKm) return;

  await prisma.job.update({
    where: { id: jobId },
    data: { diffusionRadiusKm: targetRadiusKm },
  });

  await broadcastNewJob(jobId);
  logger.info("Job diffusion radius expanded", { jobId, targetRadiusKm });
}

export async function expireJobIfNeeded(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { citizen: { select: { id: true, phone: true, locale: true } } },
  });
  if (!job) return;
  if (job.status !== "PENDING") return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "EXPIRED", acceptsOffers: false },
  });

  await publishJobEvent({
    event: "job:expired",
    rooms: [citizenUserRoom(job.citizenId), jobCityRoom(job.city)],
    data: { jobId: job.id, status: "EXPIRED" },
  });

  const smsBody =
    job.citizen.locale === "ar"
      ? "Depanni: ma tl9a hta 3arif 3la talab dyalek. 3awed jarrab."
      : "Depanni: aucun artisan disponible pour votre demande. Veuillez réessayer.";

  await enqueueSms({ to: job.citizen.phone, body: smsBody });
  logger.info("Job expired — citizen notified", { jobId });
}

export async function scheduleDiffusion(jobId: string): Promise<void> {
  const { jobDiffusionQueue } = await import("../../jobs/jobDiffusionQueue.js");

  await jobDiffusionQueue.add(
    "diffusion",
    { jobId, action: "expand", targetRadiusKm: 5 } satisfies DiffusionJobPayload,
    { delay: EXPAND_5_MIN_MS, jobId: `${jobId}:expand:5` },
  );
  await jobDiffusionQueue.add(
    "diffusion",
    { jobId, action: "expand", targetRadiusKm: 10 } satisfies DiffusionJobPayload,
    { delay: EXPAND_10_MIN_MS, jobId: `${jobId}:expand:10` },
  );
  await jobDiffusionQueue.add(
    "diffusion",
    { jobId, action: "expire" } satisfies DiffusionJobPayload,
    { delay: EXPIRE_MS, jobId: `${jobId}:expire` },
  );
}

export async function closeOffersIfMaxReached(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return;
  if (job.offerCount >= job.maxOffers) {
    await prisma.job.update({
      where: { id: jobId },
      data: { acceptsOffers: false },
    });
  }
}
