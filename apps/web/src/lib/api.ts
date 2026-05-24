import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import type { ApiErrorBody, AuthSession } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

import { getAccessToken, setAccessToken } from "@/lib/token";

export { getAccessToken, setAccessToken };

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post<{ data: AuthSession }>(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const session = data.data ?? (data as unknown as AuthSession);
    const token = session.accessToken;
    setAccessToken(token);
    return token;
  } catch {
    setAccessToken(null);
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken && original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data?.error?.message ??
      error.response?.data?.message ??
      error.message ??
      "Une erreur est survenue"
    );
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue";
}

export { API_URL };
