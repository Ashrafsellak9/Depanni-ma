import type { UserRole } from "@depanni/types";

export interface AuthUserView {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  status: string;
  phoneVerified: boolean;
  emailVerified: boolean;
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
  /** Présent côté serveur pour cookie httpOnly — non exposé au client dans le JSON login */
  refreshToken?: string;
}
