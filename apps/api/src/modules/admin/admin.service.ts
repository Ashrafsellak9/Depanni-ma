import { prisma } from "../../config/db.js";
import { extractS3Key, getSignedPrivateUrl } from "../../config/s3.js";
import { NotFoundError } from "../../utils/errors.js";
import { refreshArtisanMetrics } from "../artisans/artisans.score.js";
import { rejectKycSchema } from "../artisans/artisans.schemas.js";

export class AdminService {
  async getDashboardStats() {
    return this.getOverview();
  }

  async getOverview() {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const chartStart = new Date(now);
    chartStart.setDate(chartStart.getDate() - 13);
    chartStart.setHours(0, 0, 0, 0);

    const [
      missionsToday,
      gmvTodayAgg,
      activeArtisans,
      ratingAgg,
      kycPendingCount,
      disputesOpen,
      inProgressMissions,
      recentMissions,
      kycPendingItems,
      topArtisans,
      heatmapJobs,
      missionsWeek,
      missionsPrevWeek,
    ] = await Promise.all([
      prisma.mission.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.mission.aggregate({
        where: { createdAt: { gte: startOfDay } },
        _sum: { totalAmount: true },
      }),
      prisma.artisan.count({ where: { availabilityStatus: "ONLINE" } }),
      prisma.artisan.aggregate({ _avg: { rating: true } }),
      prisma.artisan.count({ where: { kycStatus: "PENDING" } }),
      prisma.payment.count({ where: { status: "DISPUTED" } }),
      prisma.mission.findMany({
        where: { status: "IN_PROGRESS" },
        take: 10,
        orderBy: { updatedAt: "desc" },
        include: {
          job: { select: { id: true, title: true, city: true, status: true } },
          artisan: { select: { id: true, firstName: true, lastName: true } },
          citizen: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.mission.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        include: {
          job: { select: { id: true, title: true, city: true, status: true, urgency: true } },
          artisan: { select: { id: true, firstName: true, lastName: true } },
          citizen: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.artisan.findMany({
        where: { kycStatus: "PENDING" },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { user: { select: { email: true, phone: true } } },
      }),
      prisma.artisan.findMany({
        where: { kycStatus: "APPROVED" },
        orderBy: { totalMissions: "desc" },
        take: 8,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rating: true,
          totalMissions: true,
          availabilityStatus: true,
        },
      }),
      prisma.job.findMany({
        where: {
          createdAt: { gte: startOfMonth },
          lat: { not: 0 },
        },
        select: { lat: true, lng: true, offerCount: true },
        take: 500,
      }),
      prisma.mission.findMany({
        where: { createdAt: { gte: chartStart }, status: "COMPLETED" },
        select: { createdAt: true, artisanNet: true, totalAmount: true },
      }),
      prisma.mission.findMany({
        where: {
          createdAt: {
            gte: new Date(chartStart.getTime() - 7 * 86400000),
            lt: chartStart,
          },
          status: "COMPLETED",
        },
        select: { createdAt: true, artisanNet: true, totalAmount: true },
      }),
    ]);

    const revenueChart = this.buildRevenueComparison(missionsWeek, missionsPrevWeek, 7);

    const activityFeed = [
      ...recentMissions.slice(0, 5).map((m) => ({
        id: `mission-${m.id}`,
        type: "mission" as const,
        message: `Mission ${m.status} — ${m.job.title}`,
        at: m.createdAt.toISOString(),
      })),
      ...kycPendingItems.slice(0, 3).map((a) => ({
        id: `kyc-${a.id}`,
        type: "kyc" as const,
        message: `KYC en attente — ${a.firstName} ${a.lastName}`,
        at: a.updatedAt.toISOString(),
      })),
    ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    const kycWithDocs = await Promise.all(
      kycPendingItems.map(async (artisan) => ({
        ...artisan,
        kycDocuments: await this.signedKycUrls(artisan.kycDocUrls),
      })),
    );

    return {
      kpis: {
        missionsToday,
        gmvToday: gmvTodayAgg._sum.totalAmount ?? 0,
        activeArtisans,
        satisfaction: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
        kycPending: kycPendingCount,
        disputesOpen,
        missionsInProgress: inProgressMissions.length,
      },
      revenueChart,
      inProgressMissions,
      recentMissions,
      kycPending: kycWithDocs,
      topArtisans,
      heatmapPoints: heatmapJobs.map((j) => ({
        lat: j.lat,
        lng: j.lng,
        weight: Math.max(1, j.offerCount),
      })),
      activityFeed,
    };
  }

  private buildRevenueComparison(
    current: Array<{ createdAt: Date; artisanNet: number; totalAmount: number }>,
    previous: Array<{ createdAt: Date; artisanNet: number; totalAmount: number }>,
    days: number,
  ) {
    const now = new Date();
    const result: Array<{ date: string; amount: number; previousAmount: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const prevD = new Date(d);
      prevD.setDate(prevD.getDate() - 7);
      const prevKey = prevD.toISOString().slice(0, 10);

      const amount = current
        .filter((m) => m.createdAt.toISOString().slice(0, 10) === key)
        .reduce((s, m) => s + (m.totalAmount ?? 0), 0);
      const previousAmount = previous
        .filter((m) => m.createdAt.toISOString().slice(0, 10) === prevKey)
        .reduce((s, m) => s + (m.totalAmount ?? 0), 0);

      result.push({
        date: key,
        amount: Math.round(amount),
        previousAmount: Math.round(previousAmount),
      });
    }
    return result;
  }

  async listMissions(query: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      ...(query.status ? { status: query.status as never } : {}),
      ...(query.search
        ? {
            OR: [
              { job: { title: { contains: query.search, mode: "insensitive" as const } } },
              { job: { city: { contains: query.search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.mission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              status: true,
              city: true,
              urgency: true,
              lat: true,
              lng: true,
            },
          },
          artisan: { select: { id: true, firstName: true, lastName: true } },
          citizen: { select: { id: true, firstName: true, lastName: true } },
          offer: { select: { id: true, price: true, status: true } },
        },
      }),
      prisma.mission.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getMission(id: string) {
    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        job: true,
        artisan: { include: { user: { select: { email: true, phone: true } } } },
        citizen: { include: { user: { select: { email: true, phone: true } } } },
        offer: true,
        payments: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
    if (!mission) throw new NotFoundError("Mission");
    return mission;
  }

  async listArtisans(query: { kyc?: string; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = query.kyc ? { kycStatus: query.kyc as never } : {};

    const [items, total] = await Promise.all([
      prisma.artisan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true, phone: true, isVerified: true } } },
      }),
      prisma.artisan.count({ where }),
    ]);

    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getArtisan(id: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, phone: true, createdAt: true } },
        missions: {
          take: 20,
          orderBy: { createdAt: "desc" },
          include: { job: { select: { title: true, status: true, city: true } } },
        },
      },
    });
    if (!artisan) throw new NotFoundError("Artisan");
    return {
      ...artisan,
      kycDocuments: await this.signedKycUrls(artisan.kycDocUrls),
    };
  }

  async listCitizens(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.citizen.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true, phone: true, isVerified: true, createdAt: true } },
          _count: { select: { jobs: true } },
        },
      }),
      prisma.citizen.count(),
    ]);
    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async listUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  async listKycPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.artisan.findMany({
        where: { kycStatus: "PENDING" },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { id: true, email: true, phone: true } },
        },
      }),
      prisma.artisan.count({ where: { kycStatus: "PENDING" } }),
    ]);

    const withSignedDocs = await Promise.all(
      items.map(async (artisan) => ({
        ...artisan,
        kycDocuments: await this.signedKycUrls(artisan.kycDocUrls),
      })),
    );

    return { items: withSignedDocs, total, page, limit };
  }

  async approveKyc(artisanId: string) {
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    const updated = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "APPROVED",
        badgeVerified: true,
      },
    });

    await refreshArtisanMetrics(artisanId);
    return updated;
  }

  async rejectKyc(artisanId: string, input: unknown) {
    const { reason } = rejectKycSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    return prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "REJECTED",
        badgeVerified: false,
        availabilityStatus: "OFFLINE",
        bio: reason ? `${artisan.bio ?? ""}\n[KYC refusé: ${reason}]`.trim() : artisan.bio,
      },
    });
  }

  private async signedKycUrls(urls: string[]) {
    const docs: Record<string, string> = {};
    for (let i = 0; i < urls.length; i++) {
      const value = urls[i];
      if (!value) continue;
      try {
        docs[`doc_${i + 1}`] = await getSignedPrivateUrl(extractS3Key(value));
      } catch {
        docs[`doc_${i + 1}`] = value;
      }
    }
    return docs;
  }
}

export const adminService = new AdminService();
