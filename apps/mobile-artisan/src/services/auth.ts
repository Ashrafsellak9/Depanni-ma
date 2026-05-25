import { api, unwrapApi } from "@/src/lib/api";
import type { AuthSession } from "@/src/lib/api-types";

export interface LoginPayload {
  email?: string;
  phone?: string;
  password: string;
}

export async function login(payload: LoginPayload): Promise<AuthSession> {
  const res = await api.post("/auth/login", payload);
  return unwrapApi<AuthSession>(res);
}

export async function refreshSession(refreshToken: string): Promise<AuthSession> {
  const res = await api.post("/auth/refresh", { refreshToken });
  return unwrapApi<AuthSession>(res);
}

export async function logoutRemote(refreshToken: string): Promise<void> {
  await api.post("/auth/logout", { refreshToken });
}
