export type AnalyticsPeriod = "7d" | "30d" | "90d" | "12m" | "custom";

export interface AnalyticsMetrics {
  gmvTotal: number;
  depanniRevenue: number;
  gmvGrowth: number;
  missionsCreated: number;
  missionsCompleted: number;
  missionsCancelled: number;
  missionsAccepted: number;
  completionRate: number;
  jobsCreated: number;
  newSignups: number;
}

export interface AnalyticsDashboard {
  period: { start: string; end: string; label: string };
  metrics: AnalyticsMetrics;
  gmvByDay: Array<{ date: string; gmv: number; revenue: number }>;
  missionsByCategory: Array<{ category: string; count: number }>;
  signupsByDay: Array<{ date: string; citizens: number; artisans: number; total: number }>;
  hourlyHeatmap: {
    grid: number[][];
    max: number;
    labels: { days: string[]; hours: string[] };
  };
  funnel: {
    jobsCreated: number;
    jobsWithOffers: number;
    missionsAccepted: number;
    missionsCompleted: number;
  };
  topArtisans: {
    byRevenue: Array<{
      id: string;
      firstName: string;
      lastName: string;
      rating: number;
      totalMissions: number;
      revenue: number;
    }>;
    byMissions: Array<{
      id: string;
      firstName: string;
      lastName: string;
      rating: number;
      totalMissions: number;
    }>;
    byRating: Array<{
      id: string;
      firstName: string;
      lastName: string;
      rating: number;
      totalMissions: number;
    }>;
  };
  goals: Array<{ key: string; label: string; current: number; target: number }>;
}

export interface RevenueReport {
  summary: {
    gmv: number;
    depanniRevenue: number;
    avgCommissionRate: number;
    gmvGrowth: number;
    revenueGrowth: number;
    missionCount: number;
  };
  byCategory: Array<{ category: string; gmv: number; revenue: number; missions: number }>;
  periods: Array<{ label: string; start: string; gmv: number; revenue: number; avgRate: number }>;
  projection: {
    monthGmv: number;
    monthRevenue: number;
    projectedGmv: number;
    projectedRevenue: number;
    daysElapsed: number;
    daysInMonth: number;
  };
}

export interface PayoutRow {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  iban: string | null;
  bankName: string | null;
  artisan: { id: string; firstName: string; lastName: string };
}
