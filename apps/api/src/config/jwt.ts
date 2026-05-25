import { createPublicKey, generateKeyPairSync } from "node:crypto";

import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";

import type { UserRole } from "@depanni/types";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export interface AccessTokenPayload {
  userId: string;
  role: UserRole;
  artisanId?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  jti: string;
  familyId: string;
}

interface KeyPair {
  privateKey: string;
  publicKey: string;
  /** Previous public key during rotation (verify-only). */
  previousPublicKey?: string;
  keyId: string;
}

let cachedKeys: KeyPair | null = null;

function normalizePem(pem: string): string {
  return pem.replace(/\\n/g, "\n");
}

function loadKeyPair(): KeyPair {
  if (cachedKeys) return cachedKeys;

  if (env.JWT_PRIVATE_KEY && env.JWT_PUBLIC_KEY) {
    cachedKeys = {
      privateKey: normalizePem(env.JWT_PRIVATE_KEY),
      publicKey: normalizePem(env.JWT_PUBLIC_KEY),
      previousPublicKey: env.JWT_PREVIOUS_PUBLIC_KEY
        ? normalizePem(env.JWT_PREVIOUS_PUBLIC_KEY)
        : undefined,
      keyId: env.JWT_KEY_ID ?? "primary",
    };
    return cachedKeys;
  }

  if (env.NODE_ENV === "development" || env.NODE_ENV === "test" || process.env.VITEST === "true") {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    cachedKeys = { privateKey, publicKey, keyId: "dev-ephemeral" };
    logger.warn("JWT: clés éphémères dev — redémarrage invalide les tokens");
    return cachedKeys;
  }

  throw new Error("JWT_PRIVATE_KEY et JWT_PUBLIC_KEY requis en production");
}

const signOptionsBase: SignOptions = {
  algorithm: "RS256",
};

function verifyWithKeys(token: string, publicKeys: string[]): AccessTokenPayload | RefreshTokenPayload {
  let lastError: unknown;
  for (const key of publicKeys) {
    try {
      return jwt.verify(token, key, { algorithms: ["RS256"] }) as AccessTokenPayload;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const keys = loadKeyPair();
  return jwt.sign(payload, keys.privateKey, {
    ...signOptionsBase,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    keyid: keys.keyId,
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const keys = loadKeyPair();
  return jwt.sign(payload, keys.privateKey, {
    ...signOptionsBase,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    keyid: keys.keyId,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const keys = loadKeyPair();
  const verifyKeys = [keys.publicKey, keys.previousPublicKey].filter(Boolean) as string[];
  return verifyWithKeys(token, verifyKeys) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const keys = loadKeyPair();
  const verifyKeys = [keys.publicKey, keys.previousPublicKey].filter(Boolean) as string[];
  return verifyWithKeys(token, verifyKeys) as RefreshTokenPayload;
}

/** Invalide le cache après rotation des clés (redémarrage process recommandé). */
export function reloadJwtKeys(): void {
  cachedKeys = null;
  loadKeyPair();
  logger.info("JWT key cache reloaded");
}

/** Vérifie que la paire de clés est valide au démarrage. */
export function assertJwtKeyPairAtStartup(): void {
  const keys = loadKeyPair();
  createPublicKey(keys.publicKey);
  if (keys.previousPublicKey) {
    createPublicKey(keys.previousPublicKey);
    logger.info("JWT: clé précédente chargée (rotation active)");
  }
}

export function getAccessTokenTtlSeconds(): number {
  return 15 * 60;
}
