import type { Artisan, Prisma } from "@prisma/client";

import { extractS3Key, getSignedPrivateUrl } from "../../config/s3.js";
import { prisma } from "../../config/db.js";
import { uploadPrivateFile } from "../../middleware/upload.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { findNearbyArtisans, syncArtisanGeo, syncBaseLocationGeo } from "./artisans.geo.js";
import { refreshArtisanMetrics } from "./artisans.score.js";
import {
  availabilitySchema,
  locationSchema,
  nearbyQuerySchema,
  updateArtisanMeSchema,
  type NearbyQueryInput,
  type UpdateArtisanMeInput,
} from "./artisans.schemas.js";

const COMMISSION_RATE = 0.1;

const artisanMeInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatarUrl: true,
      locale: true,
    },
  },
  categories: { include: { category: true } },
  reviews: {
    take: 5,
    orderBy: { createdAt: "desc" as const },
    select: { id: true, rating: true, comment: true, createdAt: true },
  },
} satisfies Prisma.ArtisanInclude;

export class ArtisansService {
  async getArtisanByUserId(userId: string): Promise<Artisan> {
    const artisan = await prisma.artisan.findUnique({ where: { userId } });
    if (!artisan) throw new NotFoundError("Profil artisan");
    return artisan;
  }

  async getMe(userId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { userId },
      include: artisanMeInclude,
    });
    if (!artisan) throw new NotFoundError("Profil artisan");

    const [pendingOffers, earningsSum] = await Promise.all([
      prisma.offer.count({ where: { artisanId: artisan.id, status: "PENDING" } }),
      prisma.artisanEarning.aggregate({
        where: { artisanId: artisan.id, status: "PAID" },
        _sum: { netAmount: true },
      }),
    ]);

    const kycDocuments = await this.buildKycSignedUrls(artisan);

    return {
      ...artisan,
      kycDocuments,
      stats: {
        pendingOffers,
        totalPaidEarnings: earningsSum._sum.netAmount ?? 0,
        artisanScore: artisan.artisanScore,
        isTopArtisan: artisan.isTopArtisan,
        isVerified: artisan.isVerified,
      },
    };
  }

  async updateMe(userId: string, input: unknown) {
    const data: UpdateArtisanMeInput = updateArtisanMeSchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);

    const { categoryIds, baseLocation, ...profileData } = data;

    await prisma.$transaction(async (tx) => {
      await tx.artisan.update({
        where: { id: artisan.id },
        data: profileData,
      });

      if (categoryIds?.length) {
        await tx.artisanCategory.deleteMany({ where: { artisanId: artisan.id } });
        await tx.artisanCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            artisanId: artisan.id,
            categoryId,
          })),
        });
      }
    });

    if (baseLocation) {
      await syncBaseLocationGeo(artisan.id, baseLocation.lat, baseLocation.lng);
    }

    await refreshArtisanMetrics(artisan.id);

    return this.getMe(userId);
  }

  async setAvailability(userId: string, input: unknown) {
    const { isAvailable } = availabilitySchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);

    if (isAvailable && artisan.verificationStatus !== "APPROVED") {
      throw new ForbiddenError("KYC non validé — disponibilité impossible");
    }

    return prisma.artisan.update({
      where: { id: artisan.id },
      data: { isAvailable },
      select: { id: true, isAvailable: true, verificationStatus: true },
    });
  }

  async updateLocation(userId: string, input: unknown) {
    const { lat, lng } = locationSchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);

    await syncArtisanGeo(artisan.id, lat, lng);

    return prisma.artisan.findUnique({
      where: { id: artisan.id },
      select: {
        id: true,
        currentLat: true,
        currentLng: true,
        isAvailable: true,
        updatedAt: true,
      },
    });
  }

  async getEarnings(userId: string) {
    const artisan = await this.getArtisanByUserId(userId);

    const [earnings, payouts, summary] = await Promise.all([
      prisma.artisanEarning.findMany({
        where: { artisanId: artisan.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.payout.findMany({
        where: { artisanId: artisan.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.artisanEarning.aggregate({
        where: { artisanId: artisan.id },
        _sum: { grossAmount: true, commission: true, netAmount: true },
      }),
    ]);

    return {
      commissionRate: COMMISSION_RATE,
      summary: {
        grossTotal: summary._sum.grossAmount ?? 0,
        commissionTotal: summary._sum.commission ?? 0,
        netTotal: summary._sum.netAmount ?? 0,
        totalEarnings: artisan.totalEarnings,
      },
      earnings,
      payouts,
    };
  }

  async getPublicProfile(artisanId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        categories: { include: { category: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            citizen: {
              select: { firstName: true, lastName: true, avatarUrl: true },
            },
          },
        },
      },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const completedJobs = await prisma.offer.count({
      where: { artisanId, status: "ACCEPTED" },
    });

    return {
      id: artisan.id,
      bio: artisan.bio,
      specialties: artisan.specialties,
      zones: artisan.zones,
      hourlyRate: artisan.hourlyRate,
      rating: artisan.rating,
      artisanScore: artisan.artisanScore,
      completedJobs: artisan.completedJobs,
      isVerified: artisan.isVerified,
      isTopArtisan: artisan.isTopArtisan,
      badges: this.buildBadges(artisan),
      categories: artisan.categories.map((c) => c.category),
      reviews: artisan.reviews,
      user: artisan.user,
      realizationsCount: completedJobs,
    };
  }

  async findNearby(query: unknown) {
    const params: NearbyQueryInput = nearbyQuerySchema.parse(query);
    const artisans = await findNearbyArtisans({
      lat: params.lat,
      lng: params.lng,
      radiusKm: params.radius,
      categoryId: params.category,
      limit: params.limit,
    });

    return artisans.map((a) => ({
      ...a,
      distanceKm: Math.round((Number(a.distanceMeters) / 1000) * 100) / 100,
    }));
  }

  async uploadKyc(
    userId: string,
    files: {
      cinRecto?: Express.Multer.File[];
      cinVerso?: Express.Multer.File[];
      diploma?: Express.Multer.File[];
    },
  ) {
    const artisan = await this.getArtisanByUserId(userId);
    const updates: Prisma.ArtisanUpdateInput = {
      verificationStatus: "PENDING",
    };

    const cinRecto = files.cinRecto?.[0];
    const cinVerso = files.cinVerso?.[0];
    const diploma = files.diploma?.[0];

    if (cinRecto) {
      const ext = cinRecto.mimetype === "application/pdf" ? "pdf" : "jpg";
      const uploaded = await uploadPrivateFile(
        cinRecto.buffer,
        `kyc/${artisan.id}/cin-recto`,
        cinRecto.mimetype,
        ext,
      );
      updates.cinRectoUrl = uploaded.key;
      updates.cinDocumentUrl = uploaded.key;
    }

    if (cinVerso) {
      const ext = cinVerso.mimetype === "application/pdf" ? "pdf" : "jpg";
      const uploaded = await uploadPrivateFile(
        cinVerso.buffer,
        `kyc/${artisan.id}/cin-verso`,
        cinVerso.mimetype,
        ext,
      );
      updates.cinVersoUrl = uploaded.key;
    }

    if (diploma) {
      const ext = diploma.mimetype === "application/pdf" ? "pdf" : "jpg";
      const uploaded = await uploadPrivateFile(
        diploma.buffer,
        `kyc/${artisan.id}/diploma`,
        diploma.mimetype,
        ext,
      );
      updates.diplomaUrl = uploaded.key;
      updates.tradeLicenseUrl = uploaded.key;
    }

    const updated = await prisma.artisan.update({
      where: { id: artisan.id },
      data: updates,
    });

    const kycDocuments = await this.buildKycSignedUrls(updated);
    return { artisanId: updated.id, verificationStatus: updated.verificationStatus, kycDocuments };
  }

  private buildBadges(artisan: {
    isVerified: boolean;
    isTopArtisan: boolean;
    rating: number;
  }): string[] {
    const badges: string[] = [];
    if (artisan.isVerified) badges.push("VERIFIED");
    if (artisan.isTopArtisan) badges.push("TOP_ARTISAN");
    if (artisan.rating >= 4.5) badges.push("HIGHLY_RATED");
    return badges;
  }

  private async buildKycSignedUrls(artisan: {
    cinDocumentUrl: string | null;
    cinRectoUrl: string | null;
    cinVersoUrl: string | null;
    tradeLicenseUrl: string | null;
    diplomaUrl: string | null;
  }) {
    const entries: { field: string; url: string | null }[] = [
      { field: "cinRecto", url: artisan.cinRectoUrl ?? artisan.cinDocumentUrl },
      { field: "cinVerso", url: artisan.cinVersoUrl },
      { field: "diploma", url: artisan.diplomaUrl ?? artisan.tradeLicenseUrl },
    ];

    const result: Record<string, string> = {};
    for (const { field, url } of entries) {
      if (!url) continue;
      try {
        result[field] = await getSignedPrivateUrl(extractS3Key(url));
      } catch {
        result[field] = url;
      }
    }
    return result;
  }
}

export const artisansService = new ArtisansService();
