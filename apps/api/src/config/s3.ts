import AWS from "aws-sdk";

import { env } from "./env.js";
import { getLocalPublicUrl, isLocalStorageEnabled } from "./localStorage.js";
import { logger } from "../utils/logger.js";

let s3Client: AWS.S3 | null = null;
let s3MissingLogged = false;

export function isS3Configured(): boolean {
  return Boolean(
    env.S3_ENDPOINT &&
      env.S3_BUCKET &&
      env.S3_ACCESS_KEY_ID &&
      env.S3_SECRET_ACCESS_KEY,
  );
}

/**
 * Cloudflare R2 (et la plupart des endpoints S3-compatibles) n'acceptent pas les ACL.
 * L'accès public se fait via S3_PUBLIC_URL (domaine custom).
 */
export function supportsObjectAcl(): boolean {
  return !env.S3_ENDPOINT;
}

export function getS3(): AWS.S3 | null {
  if (!isS3Configured()) {
    if (!s3MissingLogged) {
      if (isLocalStorageEnabled()) {
        logger.warn("S3/R2 credentials missing — local .uploads fallback enabled (dev/test only)");
      } else {
        logger.error("S3/R2 credentials missing — file uploads unavailable");
      }
      s3MissingLogged = true;
    }
    return null;
  }

  if (!s3Client) {
    s3Client = new AWS.S3({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      // Requis pour R2 et MinIO
      s3ForcePathStyle: true,
      signatureVersion: "v4",
    });
    logger.info("S3/R2 storage client ready", {
      bucket: env.S3_BUCKET,
      endpoint: env.S3_ENDPOINT,
    });
  }
  return s3Client;
}

/** Échec rapide au boot si le stockage production n'est pas prêt. */
export function assertStorageConfiguredAtStartup(): void {
  if (env.NODE_ENV === "production" && !isS3Configured()) {
    throw new Error(
      "Production storage misconfigured: set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL",
    );
  }

  if (env.NODE_ENV === "production" && !env.S3_PUBLIC_URL) {
    throw new Error("Production requires S3_PUBLIC_URL (CDN / custom R2 domain)");
  }

  // Initialise le client tôt pour détecter une mauvaise config
  if (isS3Configured()) {
    getS3();
  }
}

export function getS3Bucket(): string {
  if (!env.S3_BUCKET) {
    throw new Error("S3_BUCKET is not configured");
  }
  return env.S3_BUCKET;
}

export function getPublicUrl(key: string): string {
  const normalized = key.replace(/^\/+/, "");
  const base = env.S3_PUBLIC_URL ?? `https://${env.S3_BUCKET}.s3.amazonaws.com`;
  return `${base.replace(/\/$/, "")}/${normalized}`;
}

/** URL signée pour documents KYC privés (CIN, diplôme). */
export async function getSignedPrivateUrl(
  key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const s3 = getS3();
  if (!s3) {
    if (isLocalStorageEnabled()) {
      return getLocalPublicUrl(key);
    }
    throw new Error("S3/R2 is not configured");
  }
  return s3.getSignedUrlPromise("getObject", {
    Bucket: getS3Bucket(),
    Key: key,
    Expires: expiresInSeconds,
  });
}

/** Extrait la clé S3 depuis une URL publique ou retourne la clé telle quelle. */
export function extractS3Key(urlOrKey: string): string {
  if (!urlOrKey.includes("://")) {
    return urlOrKey;
  }
  try {
    const pathname = new URL(urlOrKey).pathname;
    return pathname.startsWith("/") ? pathname.slice(1) : pathname;
  } catch {
    return urlOrKey;
  }
}
