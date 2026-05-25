import { z } from "zod";

import { prisma } from "../../config/db.js";
import { getCitizenIdByUserId } from "../../utils/profile.js";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "../../utils/errors.js";
import { paymentsService } from "../payments/payments.service.js";

const criteriaSchema = z.object({
  punctuality: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  price: z.number().int().min(1).max(5),
});

const reviewSchema = z
  .object({
    missionId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),
    criteria: criteriaSchema.optional(),
  })
  .refine((d) => d.rating >= 3 || (d.comment && d.comment.trim().length >= 10), {
    message: "Commentaire obligatoire pour une note inférieure à 3",
    path: ["comment"],
  });

export type CreateReviewDto = z.infer<typeof reviewSchema>;

export class ReviewsService {
  async create(reviewerUserId: string, input: unknown) {
    const data = reviewSchema.parse(input);

    const mission = await prisma.mission.findUnique({
      where: { id: data.missionId },
      include: {
        citizen: { select: { id: true, userId: true } },
        artisan: { select: { id: true, userId: true } },
        job: { select: { status: true } },
      },
    });
    if (!mission) throw new NotFoundError("Mission");
    if (mission.citizen.userId !== reviewerUserId) {
      throw new ForbiddenError("Seul le citoyen peut noter l'artisan");
    }
    if (mission.status !== "COMPLETED" && mission.job.status !== "COMPLETED") {
      throw new ConflictError("La mission doit être terminée avant de laisser un avis");
    }

    const existing = await prisma.review.findFirst({
      where: { missionId: data.missionId, authorId: reviewerUserId },
    });
    if (existing) throw new ConflictError("Avis déjà soumis pour cette mission");

    const review = await prisma.review.create({
      data: {
        missionId: data.missionId,
        authorId: reviewerUserId,
        targetId: mission.artisan.id,
        targetType: "ARTISAN",
        rating: data.rating,
        comment: data.comment,
        criteria: data.criteria ?? undefined,
      },
    });

    const avgRating = await prisma.review.aggregate({
      where: { targetId: mission.artisan.id, targetType: "ARTISAN" },
      _avg: { rating: true },
    });
    if (avgRating._avg.rating != null) {
      await prisma.artisan.update({
        where: { id: mission.artisan.id },
        data: { rating: avgRating._avg.rating },
      });
    }

    try {
      await paymentsService.onMissionCompleted(data.missionId, mission.citizen.id);
    } catch {
      /* paiement déjà libéré à la complétion */
    }

    return review;
  }
}

export const reviewsService = new ReviewsService();
