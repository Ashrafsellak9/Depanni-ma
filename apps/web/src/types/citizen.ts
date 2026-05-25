import type { JobStatus, JobUrgency, MissionStatus, OfferStatus } from "@/types";

export interface PageInfo {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

/** @deprecated — API uses cursor pagination */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CitizenJob {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  urgency: JobUrgency;
  category: string;
  subcategory?: string | null;
  city: string;
  address: string;
  lat: number;
  lng: number;
  budgetMin?: number | null;
  budgetMax?: number | null;
  photos: string[];
  offerCount: number;
  createdAt: string;
  updatedAt: string;
  citizen?: {
    id: string;
    firstName: string;
    lastName: string;
    userId?: string;
  };
  offers?: CitizenOffer[];
  mission?: CitizenMission | null;
}

export interface CitizenOffer {
  id: string;
  jobId: string;
  artisanId: string;
  price: number;
  etaMinutes?: number | null;
  message?: string | null;
  status: OfferStatus;
  createdAt: string;
  artisan?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    rating?: number;
    badgeVerified?: boolean;
    userId?: string;
  };
}

export interface CitizenMission {
  id: string;
  jobId: string;
  status: MissionStatus;
  totalAmount: number;
  artisanNet: number;
  startedAt?: string | null;
  completedAt?: string | null;
  artisan?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    rating?: number;
    phone?: string;
    userId?: string;
  };
  offer?: CitizenOffer;
}

export interface NearbyArtisan {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  rating: number;
  totalMissions: number;
  badgeVerified: boolean;
  badgeTop: boolean;
  hourlyRate: number | null;
  distanceMeters: number;
  distanceKm: number;
  lat: number;
  lng: number;
  specialties?: string[];
}

export interface TrackingPosition {
  missionId: string;
  artisanId: string;
  lat: number;
  lng: number;
  bearing?: number;
  speed?: number;
  updatedAt: string;
}

export interface TrackingView {
  missionId: string;
  position: TrackingPosition | null;
  eta: { durationMinutes: number; distanceKm: number } | null;
  arrived: boolean;
  started: boolean;
}

export interface ChatMessage {
  id: string;
  missionId: string;
  senderId: string;
  type: string;
  content: string | null;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface CitizenAddress {
  id?: string;
  label?: string;
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  formatted?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

export interface CitizenProfile {
  id: string;
  email: string;
  phone: string;
  role: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  addresses: CitizenAddress[];
  locale?: string;
}
