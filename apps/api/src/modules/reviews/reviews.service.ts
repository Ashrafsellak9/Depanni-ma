import { z } from "zod";

import { getRedis } from "../../config/redis.js";

const reviewSchema = z.object({
  missionId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type CreateReviewDto = z.infer<typeof reviewSchema>;

export class ReviewsService {
  async create(reviewerId: string, input: unknown): Promise<CreateReviewDto & { reviewerId: string }> {
    const data = reviewSchema.parse(input);
    const key = `reviews:mission:${data.missionId}`;
    const review = { ...data, reviewerId, createdAt: new Date().toISOString() };
    await getRedis().set(key, JSON.stringify(review));
    return { ...data, reviewerId };
  }
}

export const reviewsService = new ReviewsService();
