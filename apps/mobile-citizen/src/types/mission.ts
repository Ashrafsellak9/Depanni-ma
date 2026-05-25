import type { CitizenOffer } from "@/src/types/job";

export interface TrackingPosition {
  missionId: string;
  artisanId: string;
  lat: number;
  lng: number;
  bearing?: number;
  speed?: number;
  updatedAt: string;
  eta?: { durationMinutes: number; distanceKm: number } | null;
}

export interface TrackingView {
  missionId: string;
  position: TrackingPosition | null;
  eta: { durationMinutes: number; distanceKm: number } | null;
  arrived: boolean;
  started: boolean;
}

export interface CitizenMission {
  id: string;
  jobId: string;
  status: string;
  offerId: string;
  artisanId: string;
  totalAmount?: number;
  artisan?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    rating?: number;
    user?: { phone?: string };
  };
  offer?: CitizenOffer;
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

export interface ReviewCriteria {
  punctuality: number;
  quality: number;
  cleanliness: number;
  communication: number;
  price: number;
}
