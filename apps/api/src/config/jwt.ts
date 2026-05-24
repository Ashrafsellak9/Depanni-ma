import { generateKeyPairSync } from "node:crypto";

import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";

import type { UserRole } from "@depanni/types";

import { env } from "./env.js";

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
    };
    return cachedKeys;
  }

  if (env.NODE_ENV === "development") {
    const { privateKey, publicKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    cachedKeys = { privateKey, publicKey };
    return cachedKeys;
  }

  throw new Error("JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are required in production");
}

const signOptionsBase: SignOptions = {
  algorithm: "RS256",
};

const verifyOptions: VerifyOptions = {
  algorithms: ["RS256"],
};

export function signAccessToken(payload: AccessTokenPayload): string {
  const keys = loadKeyPair();
  return jwt.sign(payload, keys.privateKey, {
    ...signOptionsBase,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const keys = loadKeyPair();
  return jwt.sign(payload, keys.privateKey, {
    ...signOptionsBase,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const keys = loadKeyPair();
  return jwt.verify(token, keys.publicKey, verifyOptions) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const keys = loadKeyPair();
  return jwt.verify(token, keys.publicKey, verifyOptions) as RefreshTokenPayload;
}

export function getAccessTokenTtlSeconds(): number {
  return 15 * 60;
}
