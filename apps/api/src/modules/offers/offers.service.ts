import { prisma } from "../../config/db.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { chatService } from "../chat/chat.service.js";
import { citizenUserRoom, publishJobEvent } from "../jobs/jobs.events.js";
import { closeOffersIfMaxReached } from "../jobs/jobs.diffusion.js";
import { createOfferSchema, type CreateOfferInput } from "../jobs/jobs.schemas.js";

export class OffersService {
  async create(jobId: string, artisanUserId: string, artisanId: string | undefined, input: unknown) {
    const data: CreateOfferInput = createOfferSchema.parse(input);

    const artisan = await prisma.artisan.findUnique({
      where: artisanId ? { id: artisanId } : { userId: artisanUserId },
      include: { categories: true },
    });
    if (!artisan) throw new ForbiddenError("Profil artisan requis");
    if (artisan.verificationStatus !== "APPROVED") {
      throw new ForbiddenError("KYC non validé");
    }
    if (!artisan.isAvailable) {
      throw new ForbiddenError("Activez votre disponibilité pour soumettre une offre");
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Demande");
    if (job.status !== "PENDING") {
      throw new ConflictError("Cette demande n'accepte plus d'offres");
    }
    if (!job.acceptsOffers) {
      throw new ConflictError("Nombre maximum d'offres atteint");
    }

    const inCategory = artisan.categories.some((c) => c.categoryId === job.categoryId);
    if (!inCategory) {
      throw new ForbiddenError("Catégorie non couverte par votre profil");
    }

    const inRadius = await this.isArtisanInJobRadius(artisan.id, job.id, job.diffusionRadiusKm);
    if (!inRadius) {
      throw new ForbiddenError("Hors zone de diffusion de la demande");
    }

    const existing = await prisma.offer.findUnique({
      where: { jobId_artisanId: { jobId, artisanId: artisan.id } },
    });
    if (existing) {
      throw new ConflictError("Vous avez déjà soumis une offre pour cette demande");
    }

    const offer = await prisma.$transaction(async (tx) => {
      const created = await tx.offer.create({
        data: {
          jobId,
          artisanId: artisan.id,
          amount: data.price,
          currency: data.currency,
          etaMinutes: data.eta_minutes,
          message: data.message,
          status: "PENDING",
        },
        include: {
          artisan: {
            include: {
              user: { select: { firstName: true, lastName: true, avatarUrl: true } },
            },
          },
        },
      });

      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: { offerCount: { increment: 1 } },
      });

      if (updatedJob.offerCount >= updatedJob.maxOffers) {
        await tx.job.update({
          where: { id: jobId },
          data: { acceptsOffers: false },
        });
      }

      return created;
    });

    await closeOffersIfMaxReached(jobId);

    await publishJobEvent({
      event: "job:offer:new",
      rooms: [citizenUserRoom(job.citizenId)],
      data: {
        jobId,
        offer: {
          id: offer.id,
          amount: offer.amount,
          etaMinutes: offer.etaMinutes,
          message: offer.message,
          artisan: offer.artisan,
          createdAt: offer.createdAt.toISOString(),
        },
      },
    });

    return offer;
  }

  async listByJob(jobId: string, requesterId: string, requesterRole: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Demande");

    const artisan = await prisma.artisan.findUnique({ where: { userId: requesterId } });

    if (job.citizenId !== requesterId && requesterRole !== "ARTISAN" && requesterRole !== "ADMIN") {
      throw new ForbiddenError();
    }

    const offers = await prisma.offer.findMany({
      where: { jobId },
      include: {
        artisan: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarUrl: true, phone: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (requesterRole === "CITIZEN" || job.citizenId === requesterId) {
      return offers;
    }

    if (requesterRole === "ARTISAN" && artisan) {
      return offers.filter((o) => o.artisanId === artisan.id);
    }

    throw new ForbiddenError();
  }

  async accept(jobId: string, offerId: string, citizenId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Demande");
    if (job.citizenId !== citizenId) throw new ForbiddenError();
    if (job.status !== "PENDING") {
      throw new ConflictError("Impossible d'accepter une offre pour ce statut");
    }

    const offer = await prisma.offer.findFirst({
      where: { id: offerId, jobId, status: "PENDING" },
    });
    if (!offer) throw new NotFoundError("Offre");

    const result = await prisma.$transaction(async (tx) => {
      await tx.offer.updateMany({
        where: { jobId, id: { not: offerId }, status: "PENDING" },
        data: { status: "REJECTED" },
      });

      const accepted = await tx.offer.update({
        where: { id: offerId },
        data: { status: "ACCEPTED" },
      });

      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: {
          status: "ACTIVE",
          acceptedOfferId: offerId,
          acceptsOffers: false,
        },
      });

      return { accepted, job: updatedJob };
    });

    await chatService.getOrCreateConversation(jobId);

    await publishJobEvent({
      event: "job:status",
      rooms: [citizenUserRoom(citizenId)],
      data: { jobId, status: "ACTIVE", acceptedOfferId: offerId },
    });

    const artisan = await prisma.artisan.findUnique({
      where: { id: offer.artisanId },
      select: { userId: true },
    });
    if (artisan) {
      await publishJobEvent({
        event: "job:status",
        rooms: [citizenUserRoom(artisan.userId)],
        data: { jobId, status: "ACTIVE", acceptedOfferId: offerId },
      });
    }

    return result;
  }

  async reject(jobId: string, offerId: string, citizenId: string) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Demande");
    if (job.citizenId !== citizenId) throw new ForbiddenError();

    const offer = await prisma.offer.findFirst({
      where: { id: offerId, jobId, status: "PENDING" },
    });
    if (!offer) throw new NotFoundError("Offre");

    return prisma.offer.update({
      where: { id: offerId },
      data: { status: "REJECTED" },
    });
  }

  async complete(jobId: string, offerId: string, userId: string, role: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { acceptedOffer: true },
    });
    if (!job) throw new NotFoundError("Demande");
    if (!["ACTIVE", "IN_PROGRESS"].includes(job.status)) {
      throw new ConflictError("La mission ne peut pas être terminée dans cet état");
    }

    const offer = await prisma.offer.findFirst({
      where: { id: offerId, jobId, status: "ACCEPTED" },
      include: { artisan: true },
    });
    if (!offer) throw new NotFoundError("Offre acceptée");

    const isCitizen = job.citizenId === userId;
    const isArtisan = offer.artisan.userId === userId;
    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError();
    }

    const result = await prisma.$transaction(async (tx) => {
      const completedOffer = await tx.offer.update({
        where: { id: offerId },
        data: { status: "COMPLETED" },
      });

      const completedJob = await tx.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" },
      });

      await tx.artisan.update({
        where: { id: offer.artisanId },
        data: { completedJobs: { increment: 1 } },
      });

      return { offer: completedOffer, job: completedJob };
    });

    await publishJobEvent({
      event: "job:status",
      rooms: [
        citizenUserRoom(job.citizenId),
        citizenUserRoom(offer.artisan.userId),
      ],
      data: { jobId, status: "COMPLETED" },
    });

    return result;
  }

  private async isArtisanInJobRadius(
    artisanId: string,
    jobId: string,
    radiusKm: number,
  ): Promise<boolean> {
    const radiusMeters = radiusKm * 1000;
    const rows = await prisma.$queryRaw<{ ok: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM artisans a
        INNER JOIN jobs j ON j.id = ${jobId}
        WHERE a.id = ${artisanId}
          AND a.location IS NOT NULL
          AND j.location IS NOT NULL
          AND ST_DWithin(
            a.location,
            j.location,
            ${radiusMeters}
          )
      ) AS ok
    `;
    return Boolean(rows[0]?.ok);
  }
}

export const offersService = new OffersService();
