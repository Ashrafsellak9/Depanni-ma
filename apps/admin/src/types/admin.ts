export interface AdminKpis {
  missionsToday: number;
  gmvToday: number;
  activeArtisans: number;
  satisfaction: number;
  kycPending: number;
  disputesOpen: number;
  missionsInProgress: number;
}

export interface RevenueChartPoint {
  date: string;
  amount: number;
  previousAmount: number;
}

export interface AdminMissionRow {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  job: {
    id: string;
    title: string;
    city: string;
    status: string;
    urgency?: string;
  };
  artisan: { id: string; firstName: string; lastName: string };
  citizen: { firstName: string; lastName: string };
}

export interface KycPendingItem {
  id: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
  updatedAt: string;
  user: { email: string; phone: string };
  kycDocuments: Record<string, string>;
}

export interface TopArtisan {
  id: string;
  firstName: string;
  lastName: string;
  rating: number;
  totalMissions: number;
  availabilityStatus: string;
}

export interface ActivityItem {
  id: string;
  type: "mission" | "kyc";
  message: string;
  at: string;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export interface AdminOverview {
  kpis: AdminKpis;
  revenueChart: RevenueChartPoint[];
  inProgressMissions: AdminMissionRow[];
  recentMissions: AdminMissionRow[];
  kycPending: KycPendingItem[];
  topArtisans: TopArtisan[];
  heatmapPoints: HeatmapPoint[];
  activityFeed: ActivityItem[];
}

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}
