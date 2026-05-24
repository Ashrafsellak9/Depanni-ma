import type { AuthTokens, UserRole } from "@depanni/types";

export interface RegisterDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Extract<UserRole, "CITIZEN" | "ARTISAN">;
  locale?: string;
}

export interface LoginDto {
  identifier: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  tokens: AuthTokens;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
