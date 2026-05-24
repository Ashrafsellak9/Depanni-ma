import axios from "axios";

import { API_URL } from "@/src/lib/config";
import { api, unwrapApi } from "@/src/lib/api";
import type { AuthSession } from "@/src/lib/api-types";

export interface RegisterPayload {
  email?: string;
  phone: string;
  password: string;
  firstName: string;
  lastName?: string;
  locale?: "fr" | "ar" | "en";
}

export interface RegisterPending {
  message: string;
  userId: string;
  phone: string;
  otpSent: boolean;
}

export type LoginPayload =
  | { email: string; password: string }
  | { phone: string; password: string };

/** Refresh sans intercepteur Axios (évite boucle 401). */
export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
  return unwrapApi<AuthSession>({ data });
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await api.post("/auth/login", payload);
  return unwrapApi<AuthSession>({ data });
}

export async function registerCitizen(payload: RegisterPayload): Promise<RegisterPending> {
  const { data } = await api.post("/auth/register", {
    ...payload,
    locale: payload.locale ?? "fr",
  });
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

export async function resendOtp(input: {
  phone: string;
  purpose: "REGISTER" | "RESET" | "VERIFY_PHONE";
}): Promise<{ message: string }> {
  const { data } = await api.post("/auth/resend-otp", input);
  return unwrapApi<{ message: string }>({ data });
}

export async function forgotPassword(phone: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { phone });
  return unwrapApi<{ message: string }>({ data });
}

export async function resetPassword(input: {
  phone: string;
  code: string;
  password: string;
}): Promise<{ message: string }> {
  const { data } = await api.post("/auth/reset-password", input);
  return unwrapApi<{ message: string }>({ data });
}

export async function logoutRemote(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}
