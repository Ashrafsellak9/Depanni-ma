import { createHash, randomUUID } from "node:crypto";

import type { UserRole } from "@depanni/types";

import {
  getAccessTokenTtlSeconds,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../config/jwt.js";
import { prisma } from "../../config/db.js";
import { getRedis } from "../../config/redis.js";
import { UnauthorizedError } from "../../utils/errors.js";

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function blacklistKey(jti: string): string {
  return `auth:blacklist:${jti}`;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class TokenService {
  async issueTokens(
    userId: string,
    role: UserRole,
    artisanId?: string,
    existingFamilyId?: string,
  ): Promise<IssuedTokens> {
    const familyId = existingFamilyId ?? randomUUID();
    const jti = randomUUID();

    const accessToken = signAccessToken({ userId, role, artisanId });
    const refreshToken = signRefreshToken({ userId, jti, familyId });
    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date(Date.now() + REFRESH_TTL_SECONDS * 1000);

    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        jti,
        familyId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: getAccessTokenTtlSeconds(),
    };
  }

  async rotateRefreshToken(oldRefreshToken: string): Promise<IssuedTokens> {
    let payload;
    try {
      payload = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new UnauthorizedError("Refresh token invalide");
    }

    const isBlacklisted = await getRedis().exists(blacklistKey(payload.jti));
    if (isBlacklisted) {
      throw new UnauthorizedError("Refresh token révoqué");
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
      include: { user: { include: { artisan: true } } },
    });

    if (!stored || stored.tokenHash !== hashToken(oldRefreshToken)) {
      throw new UnauthorizedError("Refresh token invalide");
    }

    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedError("Refresh token expiré");
    }

    await this.revokeRefreshToken(payload.jti, oldRefreshToken);

    const artisanId = stored.user.artisan?.id;
    return this.issueTokens(
      stored.userId,
      stored.user.role as UserRole,
      artisanId,
      payload.familyId,
    );
  }

  async revokeRefreshToken(jti: string, token?: string): Promise<void> {
    const redis = getRedis();
    const stored = await prisma.refreshToken.findUnique({ where: { jti } });

    if (stored) {
      const ttlMs = stored.expiresAt.getTime() - Date.now();
      if (ttlMs > 0) {
        await redis.setex(blacklistKey(jti), Math.ceil(ttlMs / 1000), "1");
      }
      await prisma.refreshToken.delete({ where: { jti } });
    } else if (token) {
      await redis.setex(blacklistKey(jti), REFRESH_TTL_SECONDS, "1");
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    const tokens = await prisma.refreshToken.findMany({ where: { userId } });
    await Promise.all(tokens.map((t) => this.revokeRefreshToken(t.jti)));
  }
}

export const tokenService = new TokenService();
