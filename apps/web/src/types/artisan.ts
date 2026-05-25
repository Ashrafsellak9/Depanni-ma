import type { JobStatus, JobUrgency, MissionStatus, OfferStatus } from "@/types";
import type { PageInfo } from "@/types/citizen";

export interface ArtisanProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  specialties: string[];
  zones: string[];
  hourlyRate: number | null;
  serviceRadiusKm: number;
  kycStatus: string;
  availabilityStatus: "OFFLINE" | "ONLINE" | "BUSY";
  rating: number;
  totalMissions: number;
  badgeVerified: boolean;
  badgeTop: boolean;
  wallet?: {
    balance: number;
    currency: string;
    walletId: string;
  } | null;
  stats: {
    pendingOffers: number;
    totalMissions: number;
    rating: number;
    badgeVerified: boolean;
    badgeTop: boolean;
  };
  user?: {
    email: string;
    phone: string;
    locale: string;
  };
}

export interface ArtisanMission {
  id: string;
  jobId: string;
  status: MissionStatus;
  totalAmount: number;
  commissionAmount: number;
  artisanNet: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  job: {
    id: string;
    title: string;
    status: JobStatus;
    city: string;
    address: string;
    lat: number;
    lng: number;
    urgency: JobUrgency;
    category: string;
    description?: string;
  };
  citizen: {
    id: string;
    firstName: string;
    lastName: string;
  };
  offer: {
    id: string;
    price: number;
    etaMinutes: number | null;
    status: OfferStatus;
  };
}

export interface ArtisanEarnings {
  wallet: { balance: number; currency: string; walletId: string };
  summary: {
    balance: number;
    totalCredited: number;
    totalCommissions: number;
    totalMissions: number;
    revenueToday: number;
    missionsToday: number;
    rating: number;
  };
  chart: { date: string; amount: number }[];
  transactions: WalletTransaction[];
  payouts: ArtisanPayout[];
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string | null;
  reference: string | null;
  createdAt: string;
}

export interface ArtisanPayout {
  id: string;
  amount: number;
  status: string;
  reference: string | null;
  createdAt: string;
  processedAt: string | null;
}

export interface ActiveJobFeed {
  id: string;
  title: string;
  urgency: JobUrgency;
  city: string;
  category: string;
  lat: number;
  lng: number;
  budgetMin: number | null;
  budgetMax: number | null;
  offerCount: number;
  distanceKm: number;
  createdAt: string;
}

export interface MissionsListResponse {
  items: ArtisanMission[];
  pageInfo: PageInfo;
}
