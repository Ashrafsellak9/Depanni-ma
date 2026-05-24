export type UserRole = "CITIZEN" | "ARTISAN" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  citizenId?: string;
  artisanId?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  expiresIn: number;
}

export type JobStatus =
  | "PENDING"
  | "ACTIVE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

export type JobUrgency = "NOW" | "IN2H" | "SCHEDULED";

export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export type MissionStatus = "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface JobSummary {
  id: string;
  title: string;
  status: JobStatus;
  urgency: JobUrgency;
  category: string;
  city: string;
  lat: number;
  lng: number;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
}

export interface OfferSummary {
  id: string;
  jobId: string;
  price: number;
  etaMinutes?: number;
  message?: string;
  status: OfferStatus;
  artisan?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    rating?: number;
  };
}

export interface MissionSummary {
  id: string;
  jobId: string;
  status: MissionStatus;
  totalAmount: number;
  artisanNet: number;
  startedAt?: string;
  completedAt?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  success?: false;
  error?: { code?: string; message?: string };
  message?: string;
}
