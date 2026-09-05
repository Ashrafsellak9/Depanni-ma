import path from "node:path";

import { env } from "./env.js";

/**
 * Stockage disque local — UNIQUEMENT development / test.
 * En production, S3/R2 est obligatoire (voir assertStorageConfiguredAtStartup).
 */
export function isLocalStorageEnabled(): boolean {
  return env.NODE_ENV === "development" || env.NODE_ENV === "test";
}

/** Répertoire local pour les uploads quand S3/R2 n'est pas configuré. */
export function getLocalUploadRoot(): string {
  return path.resolve(process.cwd(), ".uploads");
}

export function getLocalPublicUrl(key: string): string {
  const normalized = key.replace(/^\/+/, "");
  return `http://localhost:${env.API_PORT}/uploads/${normalized}`;
}
