import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { notifySessionExpired } from "./auth-events";
import { API_URL } from "./config";
import type { ApiErrorBody } from "./api-types";
import { getAccessToken } from "./session";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

let refreshFn: (() => Promise<string | null>) | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function bindAuthRefresh(fn: () => Promise<string | null>): void {
  refreshFn = fn;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry && refreshFn) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = refreshFn().finally(() => {
          refreshPromise = null;
        });
      }
      const newToken = await refreshPromise;
      if (newToken && original.headers) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      notifySessionExpired();
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
export { unwrapApi } from "./api-types";
