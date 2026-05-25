import type { AvailabilityStatus, MissionStatus, Prisma } from "@prisma/client";

import { extractS3Key, getSignedPrivateUrl } from "../../config/s3.js";
import { prisma } from "../../config/db.js";
import { uploadPrivateFile } from "../../middleware/upload.js";
import { ForbiddenError, NotFoundError } from "../../utils/errors.js";
import { findNearbyArtisans, syncArtisanGeo, syncBaseLocationGeo } from "./artisans.geo.js";
import { refreshArtisanMetrics } from "./artisans.score.js";
import { walletService } from "../payments/payments.wallet.js";
import { getCommissionRate } from "../payments/payments.commission.js";
import {
  availabilitySchema,
  earningsQuerySchema,
  locationSchema,
  missionsQuerySchema,
  nearbyQuerySchema,
  payoutRequestSchema,
  subscriptionUpgradeSchema,
  updateArtisanMeSchema,
  type NearbyQueryInput,
  type UpdateArtisanMeInput,
} from "./artisans.schemas.js";

const SUBSCRIPTION_MONTHLY_MAD: Record<"PREMIUM" | "PRO", number> = {
  PREMIUM: 199,
  PRO: 399,
};

const PAYOUT_DELAY_HOURS: Record<string, number> = {
  STANDARD: 72,
  PREMIUM: 24,
  PRO: 24,
};

export class ArtisansService {
  async getArtisanByUserId(userId: string) {
    const artisan = await prisma.artisan.findUnique({ where: { userId } });
    if (!artisan) throw new NotFoundError("Profil artisan");
    return artisan;
  }

  async getMe(userId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, phone: true, locale: true } },
      },
    });
    if (!artisan) throw new NotFoundError("Profil artisan");

    const [pendingOffers, wallet] = await Promise.all([
      prisma.offer.count({ where: { artisanId: artisan.id, status: "PENDING" } }),
      walletService.getBalance(artisan.id).catch(() => null),
    ]);

    const kycDocuments = await this.buildKycSignedUrls(artisan.kycDocUrls);

    return {
      ...artisan,
      kycDocuments,
      wallet,
      stats: {
        pendingOffers,
        totalMissions: artisan.totalMissions,
        rating: artisan.rating,
        badgeVerified: artisan.badgeVerified,
        badgeTop: artisan.badgeTop,
      },
    };
  }

  async updateMe(userId: string, input: unknown) {
    const data: UpdateArtisanMeInput = updateArtisanMeSchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);

    const { categoryIds, baseLocation, ...profileData } = data;

    let specialties = profileData.specialties;
    if (categoryIds?.length) {
      const categories = await prisma.serviceCategory.findMany({
        where: { id: { in: categoryIds } },
        select: { slug: true },
      });
      specialties = categories.map((c) => c.slug);
    }

    await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        ...profileData,
        ...(specialties != null ? { specialties } : {}),
      },
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

    if (isAvailable && artisan.kycStatus !== "APPROVED") {
      throw new ForbiddenError("KYC non validé — disponibilité impossible");
    }

    const availabilityStatus: AvailabilityStatus = isAvailable ? "ONLINE" : "OFFLINE";

    return prisma.artisan.update({
      where: { id: artisan.id },
      data: { availabilityStatus },
      select: { id: true, availabilityStatus: true, kycStatus: true },
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
        lat: true,
        lng: true,
        availabilityStatus: true,
        updatedAt: true,
      },
    });
  }

  async getEarnings(userId: string, query: unknown = {}) {
    const artisan = await this.getArtisanByUserId(userId);
    const { days: chartDays } = earningsQuerySchema.parse(query);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const chartStart = new Date(now);
    chartStart.setDate(chartStart.getDate() - (chartDays - 1));
    chartStart.setHours(0, 0, 0, 0);

    const [transactions, payouts, wallet, todayTx, chartTx, todayMissions, monthMissions, monthTx] =
      await Promise.all([
        prisma.walletTransaction.findMany({
          where: { artisanId: artisan.id },
          orderBy: { createdAt: "desc" },
          take: 50,
        }),
        prisma.payout.findMany({
          where: { artisanId: artisan.id },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
        walletService.getBalance(artisan.id),
        prisma.walletTransaction.findMany({
          where: {
            artisanId: artisan.id,
            createdAt: { gte: startOfDay },
            amount: { gt: 0 },
          },
        }),
        prisma.walletTransaction.findMany({
          where: {
            artisanId: artisan.id,
            createdAt: { gte: chartStart },
            amount: { gt: 0 },
          },
          orderBy: { createdAt: "asc" },
        }),
        prisma.mission.count({
          where: {
            artisanId: artisan.id,
            createdAt: { gte: startOfDay },
          },
        }),
        prisma.mission.count({
          where: {
            artisanId: artisan.id,
            status: "COMPLETED",
            completedAt: { gte: startOfMonth },
          },
        }),
        prisma.walletTransaction.findMany({
          where: { artisanId: artisan.id, createdAt: { gte: startOfMonth } },
        }),
      ]);

    const credits = transactions
      .filter((t) => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0);

    const commissions = transactions
      .filter((t) => t.type === "COMMISSION" || t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);

    const revenueToday = todayTx.reduce((s, t) => s + t.amount, 0);

    const monthGross = monthTx
      .filter((t) => t.amount > 0 && t.type === "CREDIT")
      .reduce((s, t) => s + t.amount, 0);
    const monthCommissions = monthTx
      .filter((t) => t.type === "COMMISSION" || t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const monthNet = Math.round((monthGross - monthCommissions) * 100) / 100;

    const byDay = new Map<string, number>();
    for (let i = 0; i < chartDays; i++) {
      const d = new Date(chartStart);
      d.setDate(d.getDate() + i);
      byDay.set(d.toISOString().slice(0, 10), 0);
    }
    for (const tx of chartTx) {
      const key = tx.createdAt.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + tx.amount);
    }
    const chart = Array.from(byDay.entries()).map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }));

    const tier = artisan.subscriptionTier;
    const commissionRate = getCommissionRate(tier);

    return {
      wallet,
      subscriptionTier: tier,
      payoutDelayHours: PAYOUT_DELAY_HOURS[tier] ?? 72,
      commissionRate,
      monthStats: {
        gross: monthGross,
        commissions: monthCommissions,
        net: monthNet,
        missionsCount: monthMissions,
      },
      summary: {
        balance: wallet.balance,
        totalCredited: credits,
        totalCommissions: commissions,
        totalMissions: artisan.totalMissions,
        revenueToday,
        missionsToday: todayMissions,
        rating: artisan.rating,
      },
      chart,
      chartDays,
      transactions,
      payouts,
    };
  }

  async upgradeSubscription(userId: string, input: unknown) {
    const data = subscriptionUpgradeSchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);
    const tierOrder = ["STANDARD", "PREMIUM", "PRO"] as const;
    if (tierOrder.indexOf(data.tier) <= tierOrder.indexOf(artisan.subscriptionTier)) {
      throw new ForbiddenError("Abonnement déjà actif ou supérieur");
    }

    const price = SUBSCRIPTION_MONTHLY_MAD[data.tier];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    if (data.method === "WALLET") {
      await walletService.debit(artisan.id, price, "DEBIT", {
        description: `Abonnement ${data.tier}`,
      });
    }

    await prisma.$transaction([
      prisma.artisan.update({
        where: { id: artisan.id },
        data: { subscriptionTier: data.tier },
      }),
      prisma.artisanSubscription.create({
        data: {
          artisanId: artisan.id,
          tier: data.tier,
          price,
          expiresAt,
          isActive: true,
        },
      }),
    ]);

    if (data.method === "CMI") {
      return {
        tier: data.tier,
        method: "CMI",
        price,
        message: "Redirection CMI à configurer — utilisez le wallet en attendant",
      };
    }

    return this.getMe(userId);
  }

  async listMissions(userId: string, query: unknown) {
    const artisan = await this.getArtisanByUserId(userId);
    const params = missionsQuerySchema.parse(query);
    const skip = (params.page - 1) * params.limit;

    const where: Prisma.MissionWhereInput = {
      artisanId: artisan.id,
      ...(params.status ? { status: params.status as MissionStatus } : {}),
      ...(params.search
        ? {
            OR: [
              { job: { title: { contains: params.search, mode: "insensitive" } } },
              { job: { city: { contains: params.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
              city: true,
              address: true,
              lat: true,
              lng: true,
              urgency: true,
              category: true,
            },
          },
          citizen: {
            select: { id: true, firstName: true, lastName: true },
          },
          offer: {
            select: { id: true, price: true, etaMinutes: true, status: true },
          },
        },
      }),
      prisma.mission.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getMissionById(userId: string, missionId: string) {
    const artisan = await this.getArtisanByUserId(userId);
    const mission = await prisma.mission.findFirst({
      where: { id: missionId, artisanId: artisan.id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            status: true,
            city: true,
            address: true,
            lat: true,
            lng: true,
            urgency: true,
            category: true,
            description: true,
          },
        },
        citizen: {
          select: { id: true, firstName: true, lastName: true },
        },
        offer: {
          select: { id: true, price: true, etaMinutes: true, status: true },
        },
      },
    });
    if (!mission) throw new NotFoundError("Mission");
    return mission;
  }

  async requestPayout(userId: string, input: unknown) {
    const data = payoutRequestSchema.parse(input);
    const artisan = await this.getArtisanByUserId(userId);
    const wallet = await walletService.getBalance(artisan.id);

    if (data.amount > wallet.balance) {
      throw new ForbiddenError("Montant supérieur au solde disponible");
    }

    const pending = await prisma.payout.count({
      where: { artisanId: artisan.id, status: { in: ["PENDING", "PROCESSING"] } },
    });
    if (pending > 0) {
      throw new ForbiddenError("Une demande de virement est déjà en cours");
    }

    const tier = artisan.subscriptionTier;
    return prisma.payout.create({
      data: {
        artisanId: artisan.id,
        amount: data.amount,
        status: "PENDING",
        reference: data.iban,
        bankDetails: {
          bankName: data.bankName,
          iban: data.iban,
          estimatedHours: PAYOUT_DELAY_HOURS[tier] ?? 72,
          pinVerified: Boolean(data.securityPin),
        },
        initiatedBy: userId,
      },
    });
  }

  async getPublicProfile(artisanId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: {
        user: { select: { id: true } },
      },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const reviews = await prisma.review.findMany({
      where: { targetId: artisanId, targetType: "ARTISAN" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        rating: true,
        comment: true,
        criteria: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            citizen: { select: { firstName: true, lastName: true, avatar: true } },
          },
        },
      },
    });

    return {
      id: artisan.id,
      firstName: artisan.firstName,
      lastName: artisan.lastName,
      avatarUrl: artisan.avatar,
      bio: artisan.bio,
      specialties: artisan.specialties,
      zones: artisan.zones,
      hourlyRate: artisan.hourlyRate,
      rating: artisan.rating,
      totalMissions: artisan.totalMissions,
      badgeVerified: artisan.badgeVerified,
      badgeTop: artisan.badgeTop,
      badges: this.buildBadges(artisan),
      reviews: reviews.map((r) => ({
        ...r,
        authorName: r.author.citizen
          ? `${r.author.citizen.firstName} ${r.author.citizen.lastName}`
          : "Citoyen",
      })),
      realizationsCount: artisan.totalMissions,
    };
  }

  async findNearby(query: unknown) {
    const params: NearbyQueryInput = nearbyQuerySchema.parse(query);

    let categorySlug: string | undefined;
    if (params.category) {
      const cat = await prisma.serviceCategory.findUnique({
        where: { id: params.category },
        select: { slug: true },
      });
      categorySlug = cat?.slug;
    }

    const artisans = await findNearbyArtisans({
      lat: params.lat,
      lng: params.lng,
      radiusKm: params.radius,
      categorySlug,
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
    const newUrls: string[] = [...artisan.kycDocUrls];

    const cinRecto = files.cinRecto?.[0];
    const cinVerso = files.cinVerso?.[0];
    const diploma = files.diploma?.[0];

    if (cinRecto) {
      newUrls.push(await this.uploadKycFile(cinRecto, `kyc/${artisan.id}/cin-recto`));
    }
    if (cinVerso) {
      newUrls.push(await this.uploadKycFile(cinVerso, `kyc/${artisan.id}/cin-verso`));
    }
    if (diploma) {
      newUrls.push(await this.uploadKycFile(diploma, `kyc/${artisan.id}/diploma`));
    }

    const updated = await prisma.artisan.update({
      where: { id: artisan.id },
      data: {
        kycStatus: "PENDING",
        kycDocUrls: newUrls,
      },
    });

    const kycDocuments = await this.buildKycSignedUrls(updated.kycDocUrls);
    return { artisanId: updated.id, kycStatus: updated.kycStatus, kycDocuments };
  }

  private async uploadKycFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = file.mimetype === "application/pdf" ? "pdf" : "jpg";
    const uploaded = await uploadPrivateFile(file.buffer, folder, file.mimetype, ext);
    return uploaded.url;
  }

  private buildBadges(artisan: {
    badgeVerified: boolean;
    badgeTop: boolean;
    rating: number;
  }): string[] {
    const badges: string[] = [];
    if (artisan.badgeVerified) badges.push("VERIFIED");
    if (artisan.badgeTop) badges.push("TOP_ARTISAN");
    if (artisan.rating >= 4.5) badges.push("HIGHLY_RATED");
    return badges;
  }

  private async buildKycSignedUrls(urls: string[]) {
    const result: Record<string, string> = {};
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (!url) continue;
      try {
        result[`doc_${i + 1}`] = await getSignedPrivateUrl(extractS3Key(url));
      } catch {
        result[`doc_${i + 1}`] = url;
      }
    }
    return result;
  }
}

export const artisansService = new ArtisansService();
