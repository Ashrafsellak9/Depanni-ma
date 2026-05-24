import { Prisma, type JobStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { processAndUploadImage } from "../../middleware/upload.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { offersService } from "../offers/offers.service.js";
import {
  broadcastNewJob,
  scheduleDiffusion,
  syncJobLocation,
} from "./jobs.diffusion.js";
import {
  activeJobsQuerySchema,
  createJobSchema,
  myJobsQuerySchema,
  type CreateJobInput,
} from "./jobs.schemas.js";

const CANCELLABLE: JobStatus[] = ["PENDING", "ACTIVE"];

const jobInclude = {
  citizen: { select: { id: true, firstName: true, lastName: true, phone: true } },
  category: { select: { id: true, slug: true, nameFr: true } },
  offers: {
    include: {
      artisan: {
        include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
  acceptedOffer: true,
};

export class JobsService {
  async create(citizenId: string, input: unknown, photoFiles?: Express.Multer.File[]) {
    const data: CreateJobInput = createJobSchema.parse(input);

    const category = await prisma.serviceCategory.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new NotFoundError("Catégorie");

    const photoUrls = [...(data.photos ?? [])];
    if (photoFiles?.length) {
      for (const file of photoFiles) {
        const uploaded = await processAndUploadImage(file.buffer, `jobs/${citizenId}`);
        photoUrls.push(uploaded.url);
      }
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const job = await prisma.job.create({
      data: {
        citizenId,
        categoryId: data.categoryId,
        subcategory: data.subcategory,
        title: data.title,
        description: data.description,
        photos: photoUrls,
        urgency: data.urgency,
        locationLat: data.lat,
        locationLng: data.lng,
        address: data.address,
        city: data.city,
        currency: data.currency,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        status: "PENDING",
        diffusionRadiusKm: 2,
        expiresAt,
        acceptsOffers: true,
      },
      include: jobInclude,
    });

    await syncJobLocation(job.id, data.lat, data.lng);
    await broadcastNewJob(job.id);
    await scheduleDiffusion(job.id);

    return job;
  }

  async getById(id: string, requesterId?: string, requesterRole?: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: jobInclude,
    });
    if (!job) throw new NotFoundError("Demande");

    if (requesterRole === "ARTISAN" && requesterId) {
      const artisan = await prisma.artisan.findUnique({ where: { userId: requesterId } });
      if (artisan && job.citizenId !== requesterId) {
        return {
          ...job,
          offers: job.offers.filter((o) => o.artisanId === artisan.id),
        };
      }
    }

    return job;
  }

  async listMy(citizenId: string, query: unknown) {
    const { page, limit, status } = myJobsQuerySchema.parse(query);
    const skip = (page - 1) * limit;

    const where = {
      citizenId,
      ...(status ? { status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { slug: true, nameFr: true } },
          _count: { select: { offers: true } },
          acceptedOffer: {
            include: {
              artisan: {
                include: { user: { select: { firstName: true, lastName: true } } },
              },
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async cancel(jobId: string, citizenId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Demande");
    if (job.citizenId !== citizenId) throw new ForbiddenError();
    if (!CANCELLABLE.includes(job.status)) {
      throw new ConflictError("Annulation impossible pour ce statut");
    }

    return prisma.$transaction(async (tx) => {
      await tx.offer.updateMany({
        where: { jobId, status: "PENDING" },
        data: { status: "CANCELLED" },
      });
      return tx.job.update({
        where: { id: jobId },
        data: { status: "CANCELLED", acceptsOffers: false },
        include: jobInclude,
      });
    });
  }

  async listActiveForArtisan(artisanUserId: string, query: unknown) {
    const { lat, lng, limit } = activeJobsQuerySchema.parse(query);

    const artisan = await prisma.artisan.findUnique({
      where: { userId: artisanUserId },
      include: { categories: true },
    });
    if (!artisan) throw new ForbiddenError("Profil artisan requis");

    const categoryIds = artisan.categories.map((c) => c.categoryId);
    if (categoryIds.length === 0) {
      return [];
    }

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        urgency: string;
        city: string;
        categoryId: string;
        locationLat: number;
        locationLng: number;
        budgetMin: number | null;
        budgetMax: number | null;
        diffusionRadiusKm: number;
        offerCount: number;
        distanceMeters: number;
        createdAt: Date;
      }>
    >`
      SELECT
        j.id,
        j.title,
        j.urgency,
        j.city,
        j."categoryId",
        j."locationLat",
        j."locationLng",
        j."budgetMin",
        j."budgetMax",
        j."diffusionRadiusKm",
        j."offerCount",
        ST_Distance(j.location, ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography) AS "distanceMeters",
        j."createdAt"
      FROM jobs j
      WHERE j.status = 'PENDING'::"JobStatus"
        AND j."acceptsOffers" = true
        AND j.location IS NOT NULL
        AND j."categoryId" IN (${Prisma.join(categoryIds)})
        AND ST_DWithin(
          j.location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          j."diffusionRadiusKm" * 1000
        )
      ORDER BY j."createdAt" DESC
      LIMIT ${limit}
    `;

    return rows.map((r) => ({
      ...r,
      distanceKm: Math.round((Number(r.distanceMeters) / 1000) * 100) / 100,
    }));
  }

  // Délégation offres
  createOffer = (
    jobId: string,
    userId: string,
    artisanId: string | undefined,
    body: unknown,
  ) => offersService.create(jobId, userId, artisanId, body);

  listOffers = (jobId: string, userId: string, role: string) =>
    offersService.listByJob(jobId, userId, role);

  acceptOffer = (jobId: string, offerId: string, citizenId: string) =>
    offersService.accept(jobId, offerId, citizenId);

  rejectOffer = (jobId: string, offerId: string, citizenId: string) =>
    offersService.reject(jobId, offerId, citizenId);

  completeOffer = (jobId: string, offerId: string, userId: string, role: string) =>
    offersService.complete(jobId, offerId, userId, role);
}

export const jobsService = new JobsService();
