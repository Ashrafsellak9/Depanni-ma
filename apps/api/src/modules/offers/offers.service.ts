import { OfferCreateSchema } from "@depanni/validators";

import { prisma } from "../../config/db.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";

export class OffersService {
  async create(artisanUserId: string, input: unknown) {
    const data = OfferCreateSchema.parse(input);

    const artisan = await prisma.artisan.findUnique({ where: { userId: artisanUserId } });
    if (!artisan) throw new ForbiddenError("Profil artisan requis");

    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job) throw new NotFoundError("Demande");

    return prisma.offer.create({
      data: {
        jobId: data.jobId,
        artisanId: artisan.id,
        amount: data.amount,
        currency: data.currency,
        status: "PENDING",
      },
    });
  }

  async listByJob(jobId: string) {
    return prisma.offer.findMany({
      where: { jobId },
      include: { artisan: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const offersService = new OffersService();
