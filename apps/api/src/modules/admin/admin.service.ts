import type { Prisma } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { extractS3Key, getSignedPrivateUrl } from "../../config/s3.js";
import { NotFoundError } from "../../utils/errors.js";
import { enqueueEmail } from "../../jobs/emailQueue.js";
import { refreshArtisanMetrics } from "../artisans/artisans.score.js";
import { getTargetAuditLog, logAdminAction } from "./admin.audit.js";
import type { ArtisansListQuery } from "./admin.schemas.js";
import {
  artisanActionSchema,
  adminMessageSchema,
  rejectKycAdminSchema,
  upgradeSubscriptionAdminSchema,
} from "./admin.schemas.js";

export class AdminService {
  async getDashboardStats() {
    return this.getOverview();
  }

  /**
   * Stats publiques pour le panneau de connexion admin (pas de données sensibles).
   */
  async getLoginStats() {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [activeArtisans, ratingAgg, missions] = await Promise.all([
      prisma.artisan.count({
        where: {
          kycStatus: "APPROVED",
          user: { accountStatus: "ACTIVE" },
        },
      }),
      prisma.artisan.aggregate({
        where: { kycStatus: "APPROVED" },
        _avg: { rating: true },
      }),
      prisma.mission.findMany({
        where: {
          createdAt: { gte: since },
          startedAt: { not: null },
        },
        select: { createdAt: true, startedAt: true },
        take: 500,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    let avgResponseMinutes: number | null = null;
    if (missions.length > 0) {
      const totalMs = missions.reduce((sum, m) => {
        const started = m.startedAt!.getTime();
        const created = m.createdAt.getTime();
        return sum + Math.max(0, started - created);
      }, 0);
      avgResponseMinutes = Math.max(1, Math.round(totalMs / missions.length / 60_000));
    }

    return {
      activeArtisans,
      averageRating: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
      avgResponseMinutes,
    };
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
    cursor?: string;
    limit?: number;
  }) {
    const limit = query.limit ?? 20;
    const { buildCursorPage, cursorWhereDesc } = await import("../../lib/pagination.js");
    const cursorFilter = cursorWhereDesc(query.cursor);

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
      ...(cursorFilter ?? {}),
    };

    const rows = await prisma.mission.findMany({
      where,
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
    });

    return buildCursorPage(rows, limit);
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

  async listArtisans(query: ArtisansListQuery) {
    const { cursor, limit, sortBy, sortOrder } = query;
    const { buildCursorPage, cursorWhereDesc } = await import("../../lib/pagination.js");
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const where: Prisma.ArtisanWhereInput = {};

    if (query.kyc) where.kycStatus = query.kyc;
    if (query.specialty) where.specialties = { has: query.specialty };
    if (query.subscription) where.subscriptionTier = query.subscription;
    if (query.ratingMin != null) where.rating = { gte: query.ratingMin };
    if (query.city) {
      where.OR = [
        { zones: { has: query.city } },
        { missions: { some: { job: { city: { contains: query.city, mode: "insensitive" } } } } },
      ];
    }
    if (query.accountStatus) {
      where.user = { accountStatus: query.accountStatus };
    }
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { user: { email: { contains: q, mode: "insensitive" } } },
            { user: { phone: { contains: q } } },
            { specialties: { hasSome: [q] } },
          ],
        },
      ];
    }

    const include = {
      user: {
        select: {
          email: true,
          phone: true,
          isVerified: true,
          accountStatus: true,
          createdAt: true,
        },
      },
      missions: {
        where: {
          status: "COMPLETED" as const,
          completedAt: { gte: startOfMonth },
        },
        select: { artisanNet: true },
      },
    } satisfies Prisma.ArtisanInclude;

    type ArtisanListRow = Prisma.ArtisanGetPayload<{ include: typeof include }>;

    const mapArtisan = (a: ArtisanListRow) => ({
      id: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      avatar: a.avatar,
      specialties: a.specialties,
      kycStatus: a.kycStatus,
      rating: a.rating,
      totalMissions: a.totalMissions,
      subscriptionTier: a.subscriptionTier,
      availabilityStatus: a.availabilityStatus,
      zones: a.zones,
      monthRevenue: a.missions.reduce((s, m) => s + m.artisanNet, 0),
      user: a.user,
      createdAt: a.createdAt,
    });

    if (sortBy === "monthRevenue") {
      const rawItems = await prisma.artisan.findMany({ where, include });
      let items = rawItems.map(mapArtisan).sort((a, b) =>
        sortOrder === "asc" ? a.monthRevenue - b.monthRevenue : b.monthRevenue - a.monthRevenue,
      );
      if (cursor) {
        const decoded = (await import("../../lib/pagination.js")).decodeCursor(cursor);
        if (decoded) {
          const idx = items.findIndex((i) => i.id === decoded.id);
          if (idx >= 0) items = items.slice(idx + 1);
        }
      }
      const page = buildCursorPage(
        items.slice(0, limit + 1).map((i) => ({ ...i, id: i.id, createdAt: i.createdAt })),
        limit,
      );
      const total = await prisma.artisan.count({ where });
      return { items: page.items, pageInfo: page.pageInfo, total };
    }

    const orderBy: Prisma.ArtisanOrderByWithRelationInput =
      sortBy === "firstName"
        ? { firstName: sortOrder }
        : sortBy === "rating"
          ? { rating: sortOrder }
          : sortBy === "totalMissions"
            ? { totalMissions: sortOrder }
            : { createdAt: sortOrder };

    const rows = await prisma.artisan.findMany({
      where: { ...where, ...(cursorWhereDesc(cursor) ?? {}) },
      include,
      take: limit + 1,
      orderBy: [orderBy, { id: sortOrder }],
    });

    const page = buildCursorPage(
      rows.map((a) => ({ ...mapArtisan(a), id: a.id, createdAt: a.createdAt })),
      limit,
    );
    const total = await prisma.artisan.count({ where });
    return { items: page.items, pageInfo: page.pageInfo, total };
  }

  async getArtisan(id: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            createdAt: true,
            accountStatus: true,
            isVerified: true,
          },
        },
        wallet: { select: { balance: true } },
        missions: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: {
            job: { select: { title: true, status: true, city: true, photos: true } },
            payments: { select: { id: true, amount: true, status: true } },
          },
        },
        walletTx: { orderBy: { createdAt: "desc" }, take: 30 },
        payments: {
          where: { status: { in: ["DISPUTED", "FROZEN"] } },
          take: 10,
        },
      },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const monthRevenue = await prisma.mission.aggregate({
      where: {
        artisanId: id,
        status: "COMPLETED",
        completedAt: { gte: startOfMonth },
      },
      _sum: { artisanNet: true },
    });

    const auditLog = await getTargetAuditLog("ARTISAN", id, 80);
    const adminMessages = auditLog.filter((l) => l.action === "ADMIN_MESSAGE");

    return {
      ...artisan,
      monthRevenue: monthRevenue._sum.artisanNet ?? 0,
      kycDocuments: await this.signedKycUrls(artisan.kycDocUrls),
      auditLog,
      adminMessages,
    };
  }

  async getKycStats() {
    const [pending, reviewed, approved, rejected] = await Promise.all([
      prisma.artisan.count({ where: { kycStatus: "PENDING" } }),
      prisma.artisan.findMany({
        where: { kycReviewedAt: { not: null } },
        select: { kycStatus: true, createdAt: true, kycReviewedAt: true },
      }),
      prisma.artisan.count({ where: { kycStatus: "APPROVED", kycReviewedAt: { not: null } } }),
      prisma.artisan.count({ where: { kycStatus: "REJECTED", kycReviewedAt: { not: null } } }),
    ]);

    const processingHours = reviewed
      .filter((r) => r.kycReviewedAt)
      .map((r) => (r.kycReviewedAt!.getTime() - r.createdAt.getTime()) / 3_600_000);
    const avgProcessingHours =
      processingHours.length > 0
        ? Math.round(processingHours.reduce((a, b) => a + b, 0) / processingHours.length)
        : 0;

    const totalReviewed = approved + rejected;
    const approvalRate = totalReviewed > 0 ? Math.round((approved / totalReviewed) * 100) : 0;

    return {
      pending,
      avgProcessingHours,
      approvalRate,
      approved,
      rejected,
    };
  }

  async suspendArtisan(artisanId: string, adminId: string, input: unknown) {
    artisanActionSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: true },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    await prisma.$transaction([
      prisma.user.update({
        where: { id: artisan.userId },
        data: { accountStatus: "SUSPENDED" },
      }),
      prisma.artisan.update({
        where: { id: artisanId },
        data: { availabilityStatus: "OFFLINE" },
      }),
    ]);

    await logAdminAction(adminId, "ARTISAN", artisanId, "SUSPEND", { note: (input as { note?: string }).note });
    return { ok: true };
  }

  async banArtisan(artisanId: string, adminId: string, input: unknown) {
    artisanActionSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    await prisma.$transaction([
      prisma.user.update({
        where: { id: artisan.userId },
        data: { accountStatus: "BANNED" },
      }),
      prisma.artisan.update({
        where: { id: artisanId },
        data: { availabilityStatus: "OFFLINE", kycStatus: "REJECTED" },
      }),
    ]);

    await logAdminAction(adminId, "ARTISAN", artisanId, "BAN", { note: (input as { note?: string }).note });
    return { ok: true };
  }

  async reactivateArtisan(artisanId: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    await prisma.user.update({
      where: { id: artisan.userId },
      data: { accountStatus: "ACTIVE" },
    });
    await logAdminAction(adminId, "ARTISAN", artisanId, "REACTIVATE", {});
    return { ok: true };
  }

  async upgradeArtisanSubscription(artisanId: string, adminId: string, input: unknown) {
    const { tier } = upgradeSubscriptionAdminSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    const updated = await prisma.artisan.update({
      where: { id: artisanId },
      data: { subscriptionTier: tier },
    });

    await logAdminAction(adminId, "ARTISAN", artisanId, "SUBSCRIPTION_UPGRADE", { tier });
    return updated;
  }

  async resetArtisanRating(artisanId: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({ where: { id: artisanId } });
    if (!artisan) throw new NotFoundError("Artisan");

    await prisma.artisan.update({
      where: { id: artisanId },
      data: { rating: 0, badgeTop: false },
    });
    await refreshArtisanMetrics(artisanId);
    await logAdminAction(adminId, "ARTISAN", artisanId, "RATING_RESET", {});
    return { ok: true };
  }

  async sendArtisanMessage(artisanId: string, adminId: string, input: unknown) {
    const { content } = adminMessageSchema.parse(input);
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: true },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    await logAdminAction(adminId, "ARTISAN", artisanId, "ADMIN_MESSAGE", { content });

    await enqueueEmail({
      to: artisan.user.email,
      subject: "Message de l'équipe DEPANNI",
      html: `<p>Bonjour ${artisan.firstName},</p><p>${content}</p><p>— Équipe DEPANNI</p>`,
    });

    return { ok: true, deliveredVia: ["audit", "email"] };
  }

  async listCitizens(cursor?: string, limit = 20) {
    const { buildCursorPage, cursorWhereDesc } = await import("../../lib/pagination.js");
    const rows = await prisma.citizen.findMany({
      where: cursorWhereDesc(cursor) ?? {},
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      include: {
        user: { select: { email: true, phone: true, isVerified: true, createdAt: true } },
        _count: { select: { jobs: true } },
      },
    });
    const page = buildCursorPage(rows, limit);
    const total = await prisma.citizen.count();
    return { items: page.items, pageInfo: page.pageInfo, total };
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
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, email: true, phone: true, createdAt: true } },
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

    const stats = await this.getKycStats();
    return { items: withSignedDocs, total, page, limit, stats };
  }

  async approveKyc(artisanId: string, adminId: string) {
    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: true },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const updated = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "APPROVED",
        badgeVerified: true,
        kycReviewedAt: new Date(),
        kycRejectReason: null,
      },
    });

    await refreshArtisanMetrics(artisanId);
    await logAdminAction(adminId, "ARTISAN", artisanId, "KYC_APPROVED", {});

    await enqueueEmail({
      to: artisan.user.email,
      subject: "DEPANNI — KYC approuvé",
      html: `<p>Bonjour ${artisan.firstName},</p><p>Votre dossier KYC a été <strong>approuvé</strong>. Vous pouvez recevoir des missions.</p>`,
    });

    return updated;
  }

  async rejectKyc(artisanId: string, adminId: string, input: unknown) {
    const data = rejectKycAdminSchema.parse(input);
    const fullReason = data.predefinedReason
      ? `${data.predefinedReason}${data.reason ? ` — ${data.reason}` : ""}`
      : data.reason;

    const artisan = await prisma.artisan.findUnique({
      where: { id: artisanId },
      include: { user: true },
    });
    if (!artisan) throw new NotFoundError("Artisan");

    const updated = await prisma.artisan.update({
      where: { id: artisanId },
      data: {
        kycStatus: "REJECTED",
        badgeVerified: false,
        availabilityStatus: "OFFLINE",
        kycReviewedAt: new Date(),
        kycRejectReason: fullReason,
      },
    });

    await logAdminAction(adminId, "ARTISAN", artisanId, "KYC_REJECTED", {
      reason: fullReason,
      predefinedReason: data.predefinedReason,
    });

    if (data.sendEmail) {
      await enqueueEmail({
        to: artisan.user.email,
        subject: "DEPANNI — Dossier KYC refusé",
        html: `<p>Bonjour ${artisan.firstName},</p><p>Votre dossier KYC a été refusé.</p><p><strong>Motif :</strong> ${fullReason}</p><p>Vous pouvez soumettre un nouveau dossier depuis l'application.</p>`,
      });
    }

    return updated;
  }

  private async signedKycUrls(urls: string[]) {
    const labels = ["cin", "diploma", "doc_3", "doc_4"];
    const docs: Record<string, string> = {};
    for (let i = 0; i < urls.length; i++) {
      const value = urls[i];
      if (!value) continue;
      const key = labels[i] ?? `doc_${i + 1}`;
      try {
        docs[key] = await getSignedPrivateUrl(extractS3Key(value));
      } catch {
        docs[key] = value;
      }
    }
    return docs;
  }
}

export const adminService = new AdminService();
