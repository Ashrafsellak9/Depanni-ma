import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { getAccessToken, setAccessToken } from "./token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

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
    const { data } = await axios.post<{ data: { accessToken: string } }>(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const token = data.data?.accessToken ?? (data as { accessToken?: string }).accessToken;
    if (token) {
      setAccessToken(token);
      return token;
    }
    return null;
  } catch {
    setAccessToken(null);
    return null;
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;
    if (!refreshPromise) refreshPromise = refreshAccessToken();
    const token = await refreshPromise;
    refreshPromise = null;
    if (!token) return Promise.reject(error);
    if (original.headers) original.headers.Authorization = `Bearer ${token}`;
    return api(original);
  },
);

export function unwrap<T>(res: { data: { data: T } }): T {
  return res.data.data;
}
