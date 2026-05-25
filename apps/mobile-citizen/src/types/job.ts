export type JobStatus =
  | "PENDING"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type JobUrgency = "NOW" | "IN2H" | "SCHEDULED";

export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

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
    userId?: string;
  };
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
  offers?: CitizenOffer[];
  mission?: unknown | null;
}

export interface OfferSocketPayload {
  jobId: string;
  offer: {
    id: string;
    price: number;
    etaMinutes?: number;
    message?: string | null;
    artisan?: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string | null;
    };
    createdAt: string;
  };
}
