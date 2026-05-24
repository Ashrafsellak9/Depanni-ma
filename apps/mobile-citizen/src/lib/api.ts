import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_URL } from "./config";
import type { ApiErrorBody, AuthSession } from "./api-types";
import { unwrapApi } from "./api-types";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokens";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    return null;
  }

  try {
    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
    const session = unwrapApi<AuthSession>({ data });
    await setTokens(session.accessToken, session.refreshToken);
    return session.accessToken;
  } catch {
    await clearTokens();
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

export { API_URL, unwrapApi };
