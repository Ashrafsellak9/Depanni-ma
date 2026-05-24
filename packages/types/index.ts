// =============================================================================
// DEPANNI.ma — Types TypeScript partagés
// =============================================================================

// --- Enums & unions ---

export type UserRole = "CITIZEN" | "ARTISAN" | "ADMIN";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";

export type ArtisanVerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export type JobStatus =
  | "DRAFT"
  | "OPEN"
  | "MATCHING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type JobUrgency = "LOW" | "NORMAL" | "HIGH" | "EMERGENCY";

export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "WITHDRAWN";

export type MissionStatus =
  | "SCHEDULED"
  | "EN_ROUTE"
  | "ON_SITE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "DISPUTED";

export type PaymentMethod = "CMI" | "WALLET" | "CASH" | "MIXED";

export type NotificationType =
  | "JOB_NEW"
  | "OFFER_RECEIVED"
  | "OFFER_ACCEPTED"
  | "MISSION_UPDATE"
  | "PAYMENT"
  | "CHAT_MESSAGE"
  | "SYSTEM"
  | "PROMO";

export type ChatMessageType = "TEXT" | "IMAGE" | "LOCATION" | "SYSTEM";

// --- Geo ---

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface GeoAddress {
  street?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  formatted: string;
  coordinates: GeoPoint;
}

// --- User ---

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  locale: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  rating?: number;
  reviewCount?: number;
}

// --- Artisan ---

export interface ArtisanCategory {
  id: string;
  slug: string;
  nameFr: string;
  nameAr?: string;
  icon?: string;
}

export interface Artisan {
  id: string;
  userId: string;
  user?: UserProfile;
  categories: ArtisanCategory[];
  verificationStatus: ArtisanVerificationStatus;
  cinNumber?: string;
  tradeLicenseUrl?: string;
  serviceRadiusKm: number;
  baseLocation: GeoPoint;
  isAvailable: boolean;
  rating: number;
  completedJobs: number;
  createdAt: string;
  updatedAt: string;
}

// --- Job ---

export interface Job {
  id: string;
  citizenId: string;
  citizen?: UserProfile;
  categoryId: string;
  category?: ArtisanCategory;
  title: string;
  description: string;
  status: JobStatus;
  urgency: JobUrgency;
  location: GeoAddress;
  scheduledAt?: string;
  budgetMin?: number;
  budgetMax?: number;
  currency: string;
  images?: string[];
  assignedArtisanId?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Offer ---

export interface Offer {
  id: string;
  jobId: string;
  job?: Job;
  artisanId: string;
  artisan?: Artisan;
  amount: number;
  currency: string;
  message?: string;
  estimatedDurationMinutes?: number;
  status: OfferStatus;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Mission ---

export interface Mission {
  id: string;
  jobId: string;
  job?: Job;
  offerId: string;
  offer?: Offer;
  artisanId: string;
  artisan?: Artisan;
  citizenId: string;
  status: MissionStatus;
  startedAt?: string;
  completedAt?: string;
  checkInAt?: string;
  checkOutAt?: string;
  routePolyline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Payment ---

export interface Payment {
  id: string;
  missionId: string;
  mission?: Mission;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  cmiTransactionId?: string;
  walletTransactionId?: string;
  commissionAmount: number;
  metadata?: Record<string, unknown>;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

// --- Chat ---

export interface ChatRoom {
  id: string;
  missionId: string;
  participantIds: string[];
  lastMessageAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  sender?: UserProfile;
  type: ChatMessageType;
  content: string;
  metadata?: Record<string, unknown>;
  readBy: string[];
  createdAt: string;
}

// --- Notification ---

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  sentAt: string;
  readAt?: string;
}

// --- API ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// --- Auth tokens ---

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  iat: number;
  exp: number;
}
