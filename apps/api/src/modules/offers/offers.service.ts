import { prisma } from "../../config/db.js";
import { getCommissionRate, splitCommission } from "../payments/payments.commission.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { paymentsService } from "../payments/payments.service.js";
import { citizenUserRoom, publishJobEvent } from "../jobs/jobs.events.js";
import { closeOffersIfMaxReached } from "../jobs/jobs.diffusion.js";
import { createOfferSchema, type CreateOfferInput } from "../jobs/jobs.schemas.js";

export class OffersService {
  async create(jobId: string, artisanUserId: string, artisanId: string | undefined, input: unknown) {
    const data: CreateOfferInput = createOfferSchema.parse(input);

    const artisan = await prisma.artisan.findUnique({
      where: artisanId ? { id: artisanId } : { userId: artisanUserId },
    });
    if (!artisan) throw new ForbiddenError("Profil artisan requis");
    if (artisan.kycStatus !== "APPROVED") {
      throw new ForbiddenError("KYC non validé");
    }
    if (artisan.availabilityStatus !== "ONLINE") {
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

    if (!artisan.specialties.includes(job.category)) {
      throw new ForbiddenError("Catégorie non couverte par votre profil");
    }

    const inRadius = await this.isArtisanInJobRadius(artisan.id, job.lat, job.lng);
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
          price: data.price,
          etaMinutes: data.eta_minutes,
          message: data.message,
          status: "PENDING",
        },
        include: {
          artisan: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
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

    const citizen = await prisma.citizen.findUnique({
      where: { id: job.citizenId },
      select: { userId: true },
    });

    await publishJobEvent({
      event: "job:offer:new",
      rooms: citizen ? [citizenUserRoom(citizen.userId)] : [],
      data: {
        jobId,
        offer: {
          id: offer.id,
          price: offer.price,
          etaMinutes: offer.etaMinutes,
          message: offer.message,
          artisan: offer.artisan,
          createdAt: offer.createdAt.toISOString(),
        },
      },
    });

    return offer;
  }

  async listByJob(jobId: string, requesterUserId: string, requesterRole: string) {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { citizen: { select: { userId: true } } },
    });
    if (!job) throw new NotFoundError("Demande");

    const artisan = await prisma.artisan.findUnique({ where: { userId: requesterUserId } });
    const isCitizen = job.citizen.userId === requesterUserId;

    if (!isCitizen && requesterRole !== "ARTISAN" && requesterRole !== "ADMIN") {
      throw new ForbiddenError();
    }

    const offers = await prisma.offer.findMany({
      where: { jobId },
      include: {
        artisan: {
          select: { id: true, firstName: true, lastName: true, avatar: true, userId: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    if (isCitizen || requesterRole === "ADMIN") {
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

    const tier =
      (
        await prisma.artisan.findUnique({
          where: { id: offer.artisanId },
          select: { subscriptionTier: true },
        })
      )?.subscriptionTier ?? "STANDARD";

    const rate = getCommissionRate(tier);
    const { artisanNet, depanniRevenue } = splitCommission(offer.price, rate);

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
          acceptsOffers: false,
        },
      });

      const mission = await tx.mission.create({
        data: {
          jobId,
          offerId,
          citizenId,
          artisanId: offer.artisanId,
          status: "ACCEPTED",
          totalAmount: offer.price,
          commissionAmount: depanniRevenue,
          artisanNet,
        },
      });

      return { accepted, job: updatedJob, mission };
    });

    await paymentsService.onOfferAccepted(result.mission.id, offer.artisanId);

    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
      select: { userId: true },
    });
    const artisan = await prisma.artisan.findUnique({
      where: { id: offer.artisanId },
      select: { userId: true },
    });

    if (citizen) {
      await publishJobEvent({
        event: "job:status",
        rooms: [citizenUserRoom(citizen.userId)],
        data: { jobId, missionId: result.mission.id, status: "ACTIVE" },
      });
    }
    if (artisan) {
      await publishJobEvent({
        event: "job:status",
        rooms: [citizenUserRoom(artisan.userId)],
        data: { jobId, missionId: result.mission.id, status: "ACTIVE" },
      });
      await publishJobEvent({
        event: "job:offer:accepted",
        rooms: [citizenUserRoom(artisan.userId)],
        data: {
          jobId,
          missionId: result.mission.id,
          offerId: result.accepted.id,
          artisanNet: result.mission.artisanNet,
          totalAmount: result.mission.totalAmount,
        },
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
    const mission = await prisma.mission.findUnique({
      where: { jobId },
      include: {
        job: true,
        offer: { include: { artisan: true } },
        citizen: { select: { userId: true } },
      },
    });
    if (!mission) throw new NotFoundError("Mission");

    if (!["ACTIVE", "IN_PROGRESS"].includes(mission.job.status)) {
      throw new ConflictError("La mission ne peut pas être terminée dans cet état");
    }

    if (mission.offerId !== offerId) {
      throw new NotFoundError("Offre acceptée");
    }

    const isCitizen = mission.citizen.userId === userId;
    const isArtisan = mission.offer.artisan.userId === userId;
    if (!isCitizen && !isArtisan && role !== "ADMIN") {
      throw new ForbiddenError();
    }

    const result = await prisma.$transaction(async (tx) => {
      const completedMission = await tx.mission.update({
        where: { id: mission.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      const completedJob = await tx.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" },
      });

      await tx.artisan.update({
        where: { id: mission.artisanId },
        data: { totalMissions: { increment: 1 } },
      });

      return { mission: completedMission, job: completedJob };
    });

    await publishJobEvent({
      event: "job:status",
      rooms: [
        citizenUserRoom(mission.citizen.userId),
        citizenUserRoom(mission.offer.artisan.userId),
      ],
      data: { jobId, missionId: mission.id, status: "COMPLETED" },
    });

    if (isCitizen) {
      await paymentsService.onMissionCompleted(mission.id, mission.citizenId);
    }

    return result;
  }

  private async isArtisanInJobRadius(
    artisanId: string,
    jobLat: number,
    jobLng: number,
  ): Promise<boolean> {
    const radiusMeters = 10 * 1000;
    const rows = await prisma.$queryRaw<{ ok: boolean }[]>`
      SELECT EXISTS (
        SELECT 1
        FROM artisans a
        WHERE a.id = ${artisanId}
          AND a.location IS NOT NULL
          AND ST_DWithin(
            a.location,
            ST_SetSRID(ST_MakePoint(${jobLng}, ${jobLat}), 4326)::geography,
            ${radiusMeters}
          )
      ) AS ok
    `;
    return Boolean(rows[0]?.ok);
  }
}

export const offersService = new OffersService();
