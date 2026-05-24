import type { Artisan } from "@prisma/client";

import { prisma } from "../../config/db.js";

const MAX_RESPONSE_SEC = 3600;
const MISSIONS_CAP = 50;

/** Score: 0.4×note + 0.3×completion + 0.2×response + 0.1×missions */
export function computeArtisanScore(artisan: {
  rating: number;
  completionRate: number;
  avgResponseTimeSec: number;
  completedJobs: number;
}): number {
  const ratingNorm = Math.min(Math.max(artisan.rating / 5, 0), 1);
  const completionNorm = Math.min(Math.max(artisan.completionRate, 0), 1);
  const responseNorm =
    artisan.avgResponseTimeSec <= 0
      ? 1
      : 1 - Math.min(artisan.avgResponseTimeSec / MAX_RESPONSE_SEC, 1);
  const missionsNorm = Math.min(artisan.completedJobs / MISSIONS_CAP, 1);

  const score =
    0.4 * ratingNorm +
    0.3 * completionNorm +
    0.2 * responseNorm +
    0.1 * missionsNorm;

  return Math.round(score * 1000) / 1000;
}

/** Badge Top Artisan: note > 4.7, > 20 missions, annulation < 2% */
export function qualifiesTopArtisan(artisan: {
  rating: number;
  completedJobs: number;
  cancellationRate: number;
}): boolean {
  return (
    artisan.rating > 4.7 && artisan.completedJobs > 20 && artisan.cancellationRate < 0.02
  );
}

export async function refreshArtisanMetrics(artisanId: string): Promise<void> {
  const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
  if (!artisan) return;

  const [reviewAgg, offerStats] = await Promise.all([
    prisma.review.aggregate({
      where: { artisanId },
      _avg: { rating: true },
      _count: true,
    }),
    prisma.offer.groupBy({
      by: ["status"],
      where: { artisanId },
      _count: true,
    }),
  ]);

  const avgRating = reviewAgg._avg.rating ?? artisan.rating;
  const totalOffers = offerStats.reduce((s, o) => s + o._count, 0);
  const accepted = offerStats.find((o) => o.status === "ACCEPTED")?._count ?? 0;
  const cancelled = offerStats.find((o) => o.status === "CANCELLED")?._count ?? 0;

  const completionRate = totalOffers > 0 ? accepted / totalOffers : 0;
  const cancellationRate = totalOffers > 0 ? cancelled / totalOffers : 0;

  const metrics = {
    rating: avgRating,
    completionRate,
    cancellationRate,
    avgResponseTimeSec: artisan.avgResponseTimeSec,
    completedJobs: artisan.completedJobs,
  };

  const artisanScore = computeArtisanScore(metrics);
  const isTopArtisan = qualifiesTopArtisan({
    rating: avgRating,
    completedJobs: artisan.completedJobs,
    cancellationRate,
  });

  await prisma.artisan.update({
    where: { id: artisanId },
    data: {
      rating: avgRating,
      completionRate,
      cancellationRate,
      artisanScore,
      isTopArtisan,
    },
  });
}
