import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
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

function diffusionRadiusKey(jobId: string): string {
  return `job:diffusion:radius:${jobId}`;
}

export interface DiffusionJobPayload {
  jobId: string;
  action: "expand" | "expire";
  targetRadiusKm?: number;
}

export async function getDiffusionRadiusKm(jobId: string): Promise<number> {
  const raw = await getRedis().get(diffusionRadiusKey(jobId));
  return raw ? Number(raw) : 2;
}

export async function setDiffusionRadiusKm(jobId: string, km: number): Promise<void> {
  await getRedis().setex(diffusionRadiusKey(jobId), 60 * 60, String(km));
}

export async function broadcastNewJob(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      citizen: {
        select: { firstName: true, lastName: true, userId: true },
      },
    },
  });
  if (!job || job.status !== "PENDING") return;

  const radiusKm = await getDiffusionRadiusKm(jobId);

  const payload = {
    id: job.id,
    title: job.title,
    description: job.description,
    urgency: job.urgency,
    city: job.city,
    category: job.category,
    subcategory: job.subcategory,
    lat: job.lat,
    lng: job.lng,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    diffusionRadiusKm: radiusKm,
    photos: job.photos,
    offerCount: job.offerCount,
    expiresAt: job.expiresAt?.toISOString(),
    createdAt: job.createdAt.toISOString(),
  };

  await publishJobEvent({
    event: "job:new",
    rooms: [jobCityRoom(job.city), jobCategoryRoom(job.category)],
    data: payload,
  });

  logger.info("Job diffusion broadcast", { jobId, radiusKm, city: job.city });
}

export async function expandDiffusionRadius(
  jobId: string,
  targetRadiusKm: number,
): Promise<void> {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return;
  if (job.status !== "PENDING" || !job.acceptsOffers) return;
  if (job.offerCount >= 3) return;

  const current = await getDiffusionRadiusKm(jobId);
  if (current >= targetRadiusKm) return;

  await setDiffusionRadiusKm(jobId, targetRadiusKm);
  await broadcastNewJob(jobId);
  logger.info("Job diffusion radius expanded", { jobId, targetRadiusKm });
}

export async function expireJobIfNeeded(jobId: string): Promise<void> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      citizen: {
        select: { userId: true, user: { select: { phone: true, locale: true } } },
      },
    },
  });
  if (!job) return;
  if (job.status !== "PENDING") return;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "EXPIRED", acceptsOffers: false },
  });

  await publishJobEvent({
    event: "job:expired",
    rooms: [citizenUserRoom(job.citizen.userId), jobCityRoom(job.city)],
    data: { jobId: job.id, status: "EXPIRED" },
  });

  const locale = job.citizen.user.locale;
  const smsBody =
    locale === "ar"
      ? "Depanni: ma tl9a hta 3arif 3la talab dyalek. 3awed jarrab."
      : "Depanni: aucun artisan disponible pour votre demande. Veuillez réessayer.";

  await enqueueSms({ to: job.citizen.user.phone, body: smsBody });
  logger.info("Job expired — citizen notified", { jobId });
}

export async function scheduleDiffusion(jobId: string): Promise<void> {
  await setDiffusionRadiusKm(jobId, 2);

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
