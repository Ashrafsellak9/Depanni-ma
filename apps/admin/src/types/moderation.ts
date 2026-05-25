export interface ArtisanListItem {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  specialties: string[];
  kycStatus: string;
  rating: number;
  totalMissions: number;
  subscriptionTier: string;
  availabilityStatus: string;
  zones: string[];
  monthRevenue: number;
  user: {
    email: string;
    phone: string;
    accountStatus: string;
    createdAt: string;
  };
  createdAt: string;
}

export interface KycStats {
  pending: number;
  avgProcessingHours: number;
  approvalRate: number;
  approved: number;
  rejected: number;
}

export interface KycPendingItem {
  id: string;
  firstName: string;
  lastName: string;
  cinNumber?: string | null;
  specialties: string[];
  createdAt: string;
  user: { email: string; phone: string; createdAt: string };
  kycDocuments: Record<string, string>;
}

export interface DisputeListItem {
  id: string;
  paymentId: string;
  missionId: string;
  amount: number;
  status: string;
  disputeReason: string | null;
  disputeOpenedAt: string;
  ageHours: number;
  priorityScore: number;
  job: { title: string; city: string; photos: string[] };
  citizen: { firstName: string; lastName: string };
  artisan: { firstName: string; lastName: string };
}

export const KYC_REJECT_REASONS = [
  "Document illisible ou expiré",
  "CIN ne correspond pas au profil",
  "Diplôme / certification non valide",
  "Informations incomplètes",
  "Suspicion de fraude",
  "Autre",
] as const;
