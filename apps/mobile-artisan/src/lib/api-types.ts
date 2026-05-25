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

export interface AuthSession {
  user: AuthUserView;
  accessToken: string;
  expiresIn: number;
  refreshToken?: string;
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

export function unwrapApi<T>(response: { data: ApiSuccess<T> | T }): T {
  const body = response.data as ApiSuccess<T> | T;
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as ApiSuccess<T>).data;
  }
  return body as T;
}
