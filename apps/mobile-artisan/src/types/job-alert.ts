/** Urgence job API (Prisma). */
export type ApiJobUrgency = "NOW" | "IN2H" | "SCHEDULED";

/** Payload Socket `job:new` (aligné diffusion API). */
export interface IncomingJobPayload {
  id: string;
  title: string;
  description?: string;
  urgency: ApiJobUrgency;
  city: string;
  category: string;
  subcategory?: string | null;
  lat: number;
  lng: number;
  budgetMin: number | null;
  budgetMax: number | null;
  diffusionRadiusKm?: number;
  offerCount?: number;
  expiresAt?: string | null;
  createdAt: string;
  /** Distance calculée côté client (km). */
  distanceKm?: number;
}

export interface OfferAcceptedPayload {
  jobId: string;
  missionId: string;
  offerId: string;
  artisanNet: number;
  totalAmount: number;
}
