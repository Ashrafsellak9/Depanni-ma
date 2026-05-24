import { prisma } from "../../config/db.js";

/** Badge Top Artisan: note > 4.7, > 20 missions */
export function qualifiesTopArtisan(artisan: {
  rating: number;
  totalMissions: number;
}): boolean {
  return artisan.rating > 4.7 && artisan.totalMissions > 20;
}

export async function refreshArtisanMetrics(artisanId: string): Promise<void> {
  const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
  if (!artisan) return;

  const reviewAgg = await prisma.review.aggregate({
    where: { targetId: artisanId, targetType: "ARTISAN" },
    _avg: { rating: true },
    _count: true,
  });

  const avgRating = reviewAgg._avg.rating ?? artisan.rating;
  const badgeTop = qualifiesTopArtisan({
    rating: avgRating,
    totalMissions: artisan.totalMissions,
  });

  await prisma.artisan.update({
    where: { id: artisanId },
    data: {
      rating: avgRating,
      badgeTop,
      badgeVerified: artisan.kycStatus === "APPROVED",
    },
  });
}
