import { Prisma, type JobStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { processAndUploadImage } from "../../middleware/upload.js";
import { getCitizenIdByUserId } from "../../utils/profile.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { offersService } from "../offers/offers.service.js";
import { paymentsService } from "../payments/payments.service.js";
import {
  broadcastNewJob,
  scheduleDiffusion,
} from "./jobs.diffusion.js";
import {
  activeJobsQuerySchema,
  createJobSchema,
  myJobsQuerySchema,
  type CreateJobInput,
} from "./jobs.schemas.js";

const CANCELLABLE: JobStatus[] = ["PENDING", "ACTIVE"];

const jobInclude = {
  citizen: {
    select: {
      id: true,
      userId: true,
      firstName: true,
      lastName: true,
      user: { select: { phone: true } },
    },
  },
  offers: {
    include: {
      artisan: {
        select: { id: true, firstName: true, lastName: true, avatar: true },
      },
    },
    orderBy: { createdAt: "asc" as const },
  },
  mission: {
    include: {
      offer: true,
      artisan: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          rating: true,
          user: { select: { phone: true } },
        },
      },
    },
  },
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
        category: category.slug,
        subcategory: data.subcategory,
        title: data.title,
        description: data.description,
        photos: photoUrls,
        urgency: data.urgency,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        city: data.city,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        status: "PENDING",
        expiresAt,
        acceptsOffers: true,
      },
      include: jobInclude,
    });

    await broadcastNewJob(job.id);
    await scheduleDiffusion(job.id);

    return job;
  }

  async getById(id: string, requesterUserId?: string, requesterRole?: string) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: jobInclude,
    });
    if (!job) throw new NotFoundError("Demande");

    if (requesterRole === "ARTISAN" && requesterUserId) {
      const artisan = await prisma.artisan.findUnique({ where: { userId: requesterUserId } });
      if (artisan && requesterUserId !== job.citizen.userId) {
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
          _count: { select: { offers: true } },
          mission: {
            include: {
              artisan: { select: { id: true, firstName: true, lastName: true } },
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

    const cancelled = await prisma.$transaction(async (tx) => {
      await tx.offer.updateMany({
        where: { jobId, status: "PENDING" },
        data: { status: "WITHDRAWN" },
      });
      return tx.job.update({
        where: { id: jobId },
        data: { status: "CANCELLED", acceptsOffers: false },
        include: jobInclude,
      });
    });

    await paymentsService.onJobCancelled(jobId, citizenId);
    return cancelled;
  }

  async listActiveForArtisan(artisanUserId: string, query: unknown) {
    const { lat, lng, limit } = activeJobsQuerySchema.parse(query);

    const artisan = await prisma.artisan.findUnique({
      where: { userId: artisanUserId },
    });
    if (!artisan) throw new ForbiddenError("Profil artisan requis");
    if (artisan.specialties.length === 0) {
      return [];
    }

    const radiusKm = 10;

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        urgency: string;
        city: string;
        category: string;
        lat: number;
        lng: number;
        budgetMin: number | null;
        budgetMax: number | null;
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
        j.category,
        j.lat,
        j.lng,
        j."budgetMin",
        j."budgetMax",
        j."offerCount",
        ST_Distance(
          ST_SetSRID(ST_MakePoint(j.lng, j.lat), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        ) AS "distanceMeters",
        j."createdAt"
      FROM jobs j
      WHERE j.status = 'PENDING'::"JobStatus"
        AND j."acceptsOffers" = true
        AND j.category = ANY(${artisan.specialties}::text[])
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(j.lng, j.lat), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radiusKm * 1000}
        )
      ORDER BY j."createdAt" DESC
      LIMIT ${limit}
    `;

    return rows.map((r) => ({
      ...r,
      distanceKm: Math.round((Number(r.distanceMeters) / 1000) * 100) / 100,
    }));
  }

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

  /** Résout citizenId pour un userId citoyen (utilitaire controllers). */
  resolveCitizenId = (userId: string) => getCitizenIdByUserId(userId);
}

export const jobsService = new JobsService();
