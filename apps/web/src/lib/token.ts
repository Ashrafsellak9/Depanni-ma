const STORAGE_KEY = "depanni_access_token";

let accessToken: string | null = null;

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(STORAGE_KEY, token);
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  accessToken = readStored();
  return accessToken;
}
