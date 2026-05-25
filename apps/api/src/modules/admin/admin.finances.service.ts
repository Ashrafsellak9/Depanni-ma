import { prisma } from "../../config/db.js";
import {
  adminAnalyticsService,
  resolvePeriodRange,
  type AnalyticsPeriod,
} from "./admin.analytics.service.js";

export class AdminFinancesService {
  async getRevenueReport(period: AnalyticsPeriod, from?: string, to?: string) {
    const { start, end, previousStart } = resolvePeriodRange(period, from, to);

    const [missions, prevMissions, payments] = await Promise.all([
      prisma.mission.findMany({
        where: { createdAt: { gte: start, lte: end }, status: "COMPLETED" },
        select: {
          totalAmount: true,
          commissionAmount: true,
          createdAt: true,
          job: { select: { category: true } },
        },
      }),
      prisma.mission.aggregate({
        where: {
          createdAt: { gte: previousStart, lt: start },
          status: "COMPLETED",
        },
        _sum: { totalAmount: true, commissionAmount: true },
      }),
      prisma.payment.findMany({
        where: { releasedAt: { gte: start, lte: end }, status: "RELEASED" },
        select: { commissionRate: true, commissionAmount: true },
      }),
    ]);

    const gmv = missions.reduce((s, m) => s + m.totalAmount, 0);
    const depanniRevenue = missions.reduce((s, m) => s + m.commissionAmount, 0);
    const prevGmv = prevMissions._sum.totalAmount ?? 0;
    const prevRevenue = prevMissions._sum.commissionAmount ?? 0;

    const avgCommissionRate =
      payments.length > 0
        ? payments.reduce((s, p) => s + p.commissionRate, 0) / payments.length
        : missions.length > 0
          ? missions.reduce((s, m) => s + m.commissionAmount / Math.max(m.totalAmount, 1), 0) /
            missions.length
          : 0.15;

    const categoryMap = new Map<string, { gmv: number; revenue: number; count: number }>();
    for (const m of missions) {
      const cat = m.job.category;
      const cur = categoryMap.get(cat) ?? { gmv: 0, revenue: 0, count: 0 };
      cur.gmv += m.totalAmount;
      cur.revenue += m.commissionAmount;
      cur.count += 1;
      categoryMap.set(cat, cur);
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());

    const monthMissions = await prisma.mission.aggregate({
      where: { createdAt: { gte: monthStart }, status: "COMPLETED" },
      _sum: { totalAmount: true, commissionAmount: true },
    });

    const monthGmv = monthMissions._sum.totalAmount ?? 0;
    const monthRevenue = monthMissions._sum.commissionAmount ?? 0;

    const periods = this.buildWeeklyPeriods(start, end, missions);

    return {
      summary: {
        gmv: Math.round(gmv),
        depanniRevenue: Math.round(depanniRevenue),
        avgCommissionRate: Math.round(avgCommissionRate * 1000) / 1000,
        gmvGrowth: prevGmv > 0 ? Math.round(((gmv - prevGmv) / prevGmv) * 100) : 0,
        revenueGrowth:
          prevRevenue > 0 ? Math.round(((depanniRevenue - prevRevenue) / prevRevenue) * 100) : 0,
        missionCount: missions.length,
      },
      byCategory: Array.from(categoryMap.entries()).map(([category, v]) => ({
        category,
        gmv: Math.round(v.gmv),
        revenue: Math.round(v.revenue),
        missions: v.count,
      })),
      periods,
      projection: {
        monthGmv: Math.round(monthGmv),
        monthRevenue: Math.round(monthRevenue),
        projectedGmv: Math.round((monthGmv / daysElapsed) * daysInMonth),
        projectedRevenue: Math.round((monthRevenue / daysElapsed) * daysInMonth),
        daysElapsed,
        daysInMonth,
      },
    };
  }

  private buildWeeklyPeriods(
    start: Date,
    end: Date,
    missions: Array<{ totalAmount: number; commissionAmount: number; createdAt: Date }>,
  ) {
    const periods: Array<{
      label: string;
      start: string;
      gmv: number;
      revenue: number;
      avgRate: number;
    }> = [];
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const weekEnd = new Date(cursor);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > end) weekEnd.setTime(end.getTime());

      const slice = missions.filter((m) => m.createdAt >= cursor && m.createdAt <= weekEnd);
      const gmv = slice.reduce((s, m) => s + m.totalAmount, 0);
      const revenue = slice.reduce((s, m) => s + m.commissionAmount, 0);

      periods.push({
        label: `${cursor.toISOString().slice(0, 10)} → ${weekEnd.toISOString().slice(0, 10)}`,
        start: cursor.toISOString().slice(0, 10),
        gmv: Math.round(gmv),
        revenue: Math.round(revenue),
        avgRate: gmv > 0 ? Math.round((revenue / gmv) * 1000) / 1000 : 0,
      });

      cursor.setDate(cursor.getDate() + 7);
    }
    return periods;
  }

  async getTransactionsExport(period: AnalyticsPeriod, from?: string, to?: string) {
    const { start, end } = resolvePeriodRange(period, from, to);

    const [missions, walletTx, payouts] = await Promise.all([
      prisma.mission.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: {
          job: { select: { title: true, category: true, city: true } },
          artisan: { select: { firstName: true, lastName: true } },
          citizen: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.walletTransaction.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { artisan: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payout.findMany({
        where: { createdAt: { gte: start, lte: end } },
        include: { artisan: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      missions: missions.map((m) => ({
        type: "MISSION",
        date: m.createdAt.toISOString(),
        id: m.id,
        status: m.status,
        title: m.job.title,
        category: m.job.category,
        city: m.job.city,
        artisan: `${m.artisan.firstName} ${m.artisan.lastName}`,
        citizen: `${m.citizen.firstName} ${m.citizen.lastName}`,
        total: m.totalAmount,
        commission: m.commissionAmount,
        artisanNet: m.artisanNet,
      })),
      walletTransactions: walletTx.map((t) => ({
        type: "WALLET_TX",
        date: t.createdAt.toISOString(),
        artisan: `${t.artisan.firstName} ${t.artisan.lastName}`,
        txType: t.type,
        amount: t.amount,
        description: t.description,
      })),
      payouts: payouts.map((p) => ({
        type: "PAYOUT",
        date: p.createdAt.toISOString(),
        artisan: `${p.artisan.firstName} ${p.artisan.lastName}`,
        amount: p.amount,
        status: p.status,
        iban: (p.bankDetails as { iban?: string })?.iban ?? p.reference,
      })),
    };
  }

  async getMonthlyReportData() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const periodStart = start.toISOString();
    const periodEnd = end.toISOString();

    const revenue = await this.getRevenueReport("custom", periodStart, periodEnd);
    const analytics = await adminAnalyticsService.getAnalytics("custom", periodStart, periodEnd);

    return {
      month: start.toLocaleString("fr-FR", { month: "long", year: "numeric" }),
      period: { start: periodStart, end: periodEnd },
      revenue,
      analytics: {
        metrics: analytics.metrics,
        topArtisans: analytics.topArtisans.byRevenue.slice(0, 5),
      },
    };
  }
}

export const adminFinancesService = new AdminFinancesService();
