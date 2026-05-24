import type { AxiosResponse } from "axios";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: unknown;
}

export function unwrapApi<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  return response.data.data;
}
