import AWS from "aws-sdk";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let s3Client: AWS.S3 | null = null;

export function getS3(): AWS.S3 | null {
  if (!env.S3_BUCKET || !env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) {
    logger.warn("S3 credentials missing — file uploads disabled");
    return null;
  }

  if (!s3Client) {
    s3Client = new AWS.S3({
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      s3ForcePathStyle: Boolean(env.S3_ENDPOINT),
      signatureVersion: "v4",
    });
  }
  return s3Client;
}

export function getS3Bucket(): string {
  if (!env.S3_BUCKET) {
    throw new Error("S3_BUCKET is not configured");
  }
  return env.S3_BUCKET;
}

export function getPublicUrl(key: string): string {
  const base = env.S3_PUBLIC_URL ?? `https://${env.S3_BUCKET}.s3.amazonaws.com`;
  return `${base.replace(/\/$/, "")}/${key}`;
}
