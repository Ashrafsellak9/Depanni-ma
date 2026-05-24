import type { UserRole } from "@depanni/types";

export interface AuthUserView {
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

export interface RegisterPendingResponse {
  message: string;
  userId: string;
  phone: string;
  otpSent: boolean;
}

export interface AuthSessionResponse {
  user: AuthUserView;
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
}
