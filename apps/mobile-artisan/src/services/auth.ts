import { api, unwrapApi } from "@/src/lib/api";
import type { AuthSession } from "@/src/lib/api-types";

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterPending {
  message: string;
  userId: string;
  phone: string;
  otpSent: boolean;
}

export interface RegisterArtisanPayload {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  locale?: "fr" | "ar" | "en";
  cinNumber?: string;
  serviceRadiusKm?: number;
  cinDocument?: { uri: string; name: string; type: string };
  tradeLicense?: { uri: string; name: string; type: string };
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const res = await api.post("/auth/login", payload);
  return unwrapApi<AuthSession>(res);
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const res = await api.post("/auth/refresh", { refreshToken });
  return unwrapApi<AuthSession>(res);
}

export async function registerArtisan(
  payload: RegisterArtisanPayload,
): Promise<RegisterPending> {
  const form = new FormData();
  form.append("email", payload.email);
  form.append("phone", payload.phone);
  form.append("password", payload.password);
  form.append("firstName", payload.firstName);
  form.append("lastName", payload.lastName);
  form.append("locale", payload.locale ?? "fr");
  if (payload.cinNumber) form.append("cinNumber", payload.cinNumber);
  if (payload.serviceRadiusKm != null) {
    form.append("serviceRadiusKm", String(payload.serviceRadiusKm));
  }
  if (payload.cinDocument) {
    form.append("cinDocument", payload.cinDocument as unknown as Blob);
  }
  if (payload.tradeLicense) {
    form.append("tradeLicense", payload.tradeLicense as unknown as Blob);
  }

  const { data } = await api.post("/auth/register/artisan", form, {
    headers: { "Content-Type": "multipart/form-data" },
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

export async function logoutRemote(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}
