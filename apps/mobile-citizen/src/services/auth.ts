import { api, unwrapApi } from "@/src/lib/api";
import type { AuthSession } from "@/src/lib/api-types";

export interface RegisterPayload {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  locale?: "fr" | "ar" | "en";
}

export interface RegisterPending {
  message: string;
  userId: string;
  phone: string;
  otpSent: boolean;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const { data } = await api.post("/auth/login", { email, password });
  return unwrapApi<AuthSession>({ data });
}

export async function registerCitizen(payload: RegisterPayload): Promise<RegisterPending> {
  const { data } = await api.post("/auth/register", payload);
  return unwrapApi<RegisterPending>({ data });
}

export async function verifyOtp(input: {
  phone: string;
  code: string;
  purpose: "REGISTER" | "RESET" | "VERIFY_PHONE";
}): Promise<AuthSession> {
  const { data } = await api.post("/auth/verify-otp", input);
  return unwrapApi<AuthSession>({ data });
}

export async function refresh(refreshToken: string): Promise<AuthSession> {
  const { data } = await api.post("/auth/refresh", { refreshToken });
  return unwrapApi<AuthSession>({ data });
}
