import { prisma } from "../../config/db.js";

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12m" | "custom";

const GOALS = {
  gmv: 500_000,
  depanniRevenue: 75_000,
  missionsCompleted: 800,
  completionRate: 85,
  newSignups: 200,
};

export function resolvePeriodRange(
  period: AnalyticsPeriod,
  from?: string,
  to?: string,
): { start: Date; end: Date; previousStart: Date } {
  const end = to ? new Date(to) : new Date();
  end.setHours(23, 59, 59, 999);
  const start = from ? new Date(from) : new Date(end);

  if (!from) {
    start.setHours(0, 0, 0, 0);
    switch (period) {
      case "7d":
        start.setDate(end.getDate() - 6);
        break;
      case "30d":
        start.setDate(end.getDate() - 29);
        break;
      case "90d":
        start.setDate(end.getDate() - 89);
        break;
      case "12m":
        start.setFullYear(end.getFullYear() - 1);
        start.setDate(start.getDate() + 1);
        break;
      default:
        start.setDate(end.getDate() - 29);
    }
  } else {
    start.setHours(0, 0, 0, 0);
  }

  const span = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - span);

  return { start, end, previousStart };
}

export class AdminAnalyticsService {
  async getAnalytics(period: AnalyticsPeriod, from?: string, to?: string) {
    const { start, end, previousStart } = resolvePeriodRange(period, from, to);

    const dateFilter = { gte: start, lte: end };
    const prevFilter = { gte: previousStart, lt: start };

    const [
      missionsPeriod,
      missionsPrev,
      jobsCreated,
      jobsWithOffers,
      paymentsReleased,
      signups,
      jobsForHeatmap,
      categoryJobs,
      topByRevenue,
      topByMissions,
      topByRating,
    ] = await Promise.all([
      prisma.mission.findMany({
        where: { createdAt: dateFilter },
        select: {
          status: true,
          totalAmount: true,
          commissionAmount: true,
          createdAt: true,
          completedAt: true,
        },
      }),
      prisma.mission.aggregate({
        where: { createdAt: prevFilter, status: "COMPLETED" },
        _sum: { totalAmount: true, commissionAmount: true },
        _count: true,
      }),
      prisma.job.count({ where: { createdAt: dateFilter } }),
      prisma.job.count({ where: { createdAt: dateFilter, offerCount: { gt: 0 } } }),
      prisma.payment.findMany({
        where: { releasedAt: dateFilter, status: "RELEASED" },
        select: { amount: true, commissionAmount: true, releasedAt: true },
      }),
      prisma.user.findMany({
        where: { createdAt: dateFilter },
        select: { createdAt: true, role: true },
      }),
      prisma.job.findMany({
        where: { createdAt: dateFilter },
        select: { createdAt: true },
      }),
      prisma.job.groupBy({
        by: ["category"],
        where: { createdAt: dateFilter },
        _count: true,
      }),
      prisma.artisan.findMany({
        where: {
          missions: { some: { completedAt: dateFilter, status: "COMPLETED" } },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          rating: true,
          totalMissions: true,
          missions: {
            where: { completedAt: dateFilter, status: "COMPLETED" },
            select: { artisanNet: true },
          },
        },
        take: 50,
      }),
      prisma.artisan.findMany({
        orderBy: { totalMissions: "desc" },
        take: 10,
        select: { id: true, firstName: true, lastName: true, rating: true, totalMissions: true },
      }),
      prisma.artisan.findMany({
        where: { kycStatus: "APPROVED" },
        orderBy: { rating: "desc" },
        take: 10,
        select: { id: true, firstName: true, lastName: true, rating: true, totalMissions: true },
      }),
    ]);

    const missionsCreated = missionsPeriod.length;
    const missionsCompleted = missionsPeriod.filter((m) => m.status === "COMPLETED").length;
    const missionsCancelled = missionsPeriod.filter((m) => m.status === "CANCELLED").length;
    const missionsAccepted = missionsPeriod.filter((m) =>
      ["ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(m.status),
    ).length;

    const gmvTotal = missionsPeriod
      .filter((m) => m.status === "COMPLETED")
      .reduce((s, m) => s + m.totalAmount, 0);

    const depanniRevenue = missionsPeriod
      .filter((m) => m.status === "COMPLETED")
      .reduce((s, m) => s + m.commissionAmount, 0);

    const completionRate =
      missionsCreated > 0 ? Math.round((missionsCompleted / missionsCreated) * 100) : 0;

    const prevGmv = missionsPrev._sum.totalAmount ?? 0;
    const gmvGrowth =
      prevGmv > 0 ? Math.round(((gmvTotal - prevGmv) / prevGmv) * 100) : gmvTotal > 0 ? 100 : 0;

    const gmvByDay = this.bucketByDay(start, end, missionsPeriod, "gmv");
    const signupsByDay = this.bucketSignupsByDay(start, end, signups);

    const hourlyHeatmap = this.buildHourlyHeatmap(jobsForHeatmap);

    const topRevenue = topByRevenue
      .map((a) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        rating: a.rating,
        totalMissions: a.totalMissions,
        revenue: a.missions.reduce((s, m) => s + m.artisanNet, 0),
      }))
      .sort((x, y) => y.revenue - x.revenue)
      .slice(0, 10);

    return {
      period: { start: start.toISOString(), end: end.toISOString(), label: period },
      metrics: {
        gmvTotal: Math.round(gmvTotal),
        depanniRevenue: Math.round(depanniRevenue),
        gmvGrowth,
        missionsCreated,
        missionsCompleted,
        missionsCancelled,
        missionsAccepted,
        completionRate,
        jobsCreated,
        newSignups: signups.length,
      },
      gmvByDay,
      missionsByCategory: categoryJobs.map((c) => ({
        category: c.category,
        count: c._count,
      })),
      signupsByDay,
      hourlyHeatmap,
      funnel: {
        jobsCreated,
        jobsWithOffers,
        missionsAccepted,
        missionsCompleted,
      },
      topArtisans: {
        byRevenue: topRevenue,
        byMissions: topByMissions,
        byRating: topByRating,
      },
      goals: [
        { key: "gmv", label: "GMV", current: Math.round(gmvTotal), target: GOALS.gmv },
        {
          key: "revenue",
          label: "Revenus DEPANNI",
          current: Math.round(depanniRevenue),
          target: GOALS.depanniRevenue,
        },
        {
          key: "missions",
          label: "Missions complétées",
          current: missionsCompleted,
          target: GOALS.missionsCompleted,
        },
        {
          key: "completion",
          label: "Taux complétion %",
          current: completionRate,
          target: GOALS.completionRate,
        },
        {
          key: "signups",
          label: "Inscriptions",
          current: signups.length,
          target: GOALS.newSignups,
        },
      ],
    };
  }

  private bucketByDay(
    start: Date,
    end: Date,
    missions: Array<{ status: string; totalAmount: number; commissionAmount: number; createdAt: Date }>,
    mode: "gmv",
  ) {
    const days: Array<{ date: string; gmv: number; revenue: number }> = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const dayMissions = missions.filter(
        (m) =>
          m.status === "COMPLETED" &&
          m.createdAt.toISOString().slice(0, 10) === key,
      );
      days.push({
        date: key,
        gmv: Math.round(dayMissions.reduce((s, m) => s + m.totalAmount, 0)),
        revenue: Math.round(dayMissions.reduce((s, m) => s + m.commissionAmount, 0)),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  private bucketSignupsByDay(
    start: Date,
    end: Date,
    users: Array<{ createdAt: Date; role: string }>,
  ) {
    const days: Array<{ date: string; citizens: number; artisans: number; total: number }> = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const dayUsers = users.filter((u) => u.createdAt.toISOString().slice(0, 10) === key);
      days.push({
        date: key,
        citizens: dayUsers.filter((u) => u.role === "CITIZEN").length,
        artisans: dayUsers.filter((u) => u.role === "ARTISAN").length,
        total: dayUsers.length,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  private buildHourlyHeatmap(jobs: Array<{ createdAt: Date }>) {
    const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const job of jobs) {
      const d = job.createdAt;
      const dow = d.getDay();
      const hour = d.getHours();
      grid[dow]![hour]! += 1;
    }
    const max = Math.max(1, ...grid.flat());
    return {
      grid,
      max,
      labels: {
        days: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        hours: Array.from({ length: 24 }, (_, i) => `${i}h`),
      },
    };
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
