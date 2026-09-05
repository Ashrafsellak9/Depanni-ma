import { createHash, randomInt } from "node:crypto";

import { env } from "../../config/env.js";
import { isOtpDevMode } from "../../config/otpDev.js";
import { getRedis } from "../../config/redis.js";
import { AppError, ValidationError } from "../../utils/errors.js";
import { logger } from "../../utils/logger.js";
import { notificationsService } from "../notifications/notifications.service.js";
import type { OtpPurpose } from "./auth.schemas.js";

export type OtpSendResult = {
  /** Code OTP en clair — uniquement si isOtpDevMode(). */
  devOtp?: string;
};

function otpKey(purpose: OtpPurpose, phone: string): string {
  return `otp:${purpose}:${phone}`;
}

function attemptsKey(purpose: OtpPurpose, phone: string): string {
  return `otp:attempts:${purpose}:${phone}`;
}

function lockKey(phone: string): string {
  return `otp:lock:${phone}`;
}

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function buildSmsBody(code: string, locale: string): string {
  if (locale === "ar") {
    return `DEPANNI: الكود ديالك هو ${code}. صالح 5 دقايق.`;
  }
  return `DEPANNI — Votre code de vérification est ${code}. Valide 5 minutes. Ne le partagez pas.`;
}

export class OtpService {
  private async assertNotLocked(phone: string): Promise<void> {
    const redis = getRedis();
    const locked = await redis.get(lockKey(phone));
    if (locked) {
      throw new AppError(
        429,
        "OTP_LOCKED",
        "Trop de tentatives. Réessayez dans 30 minutes.",
      );
    }
  }

  async send(phone: string, purpose: OtpPurpose, locale = "fr"): Promise<OtpSendResult> {
    await this.assertNotLocked(phone);

    const redis = getRedis();
    const code = randomInt(100_000, 1_000_000).toString();
    const hashed = hashCode(code);

    await redis.setex(otpKey(purpose, phone), env.OTP_TTL_SECONDS, hashed);
    await redis.setex(attemptsKey(purpose, phone), env.OTP_TTL_SECONDS, "0");

    const body = buildSmsBody(code, locale);
    await notificationsService.sendOtpSms(phone, body);

    if (isOtpDevMode()) {
      logger.warn("OTP_DEV_CODE (Twilio absent)", { phone, purpose, code });
      return { devOtp: code };
    }

    return {};
  }

  async verify(phone: string, purpose: OtpPurpose, code: string): Promise<void> {
    await this.assertNotLocked(phone);

    const redis = getRedis();
    const storedHash = await redis.get(otpKey(purpose, phone));

    if (!storedHash) {
      throw new ValidationError({ code: "Code expiré ou invalide" });
    }

    const attemptsRaw = await redis.get(attemptsKey(purpose, phone));
    const attempts = Number(attemptsRaw ?? "0");

    if (attempts >= env.OTP_MAX_ATTEMPTS) {
      await redis.setex(lockKey(phone), env.OTP_LOCK_SECONDS, "1");
      await redis.del(otpKey(purpose, phone));
      throw new AppError(429, "OTP_LOCKED", "Trop de tentatives. Compte verrouillé 30 minutes.");
    }

    const valid = storedHash === hashCode(code);
    if (!valid) {
      const nextAttempts = attempts + 1;
      await redis.setex(
        attemptsKey(purpose, phone),
        env.OTP_TTL_SECONDS,
        String(nextAttempts),
      );
      if (nextAttempts >= env.OTP_MAX_ATTEMPTS) {
        await redis.setex(lockKey(phone), env.OTP_LOCK_SECONDS, "1");
        await redis.del(otpKey(purpose, phone));
        throw new AppError(429, "OTP_LOCKED", "Trop de tentatives. Compte verrouillé 30 minutes.");
      }
      throw new ValidationError({ code: "Code incorrect" });
    }

    await redis.del(otpKey(purpose, phone));
    await redis.del(attemptsKey(purpose, phone));
  }
}

export const otpService = new OtpService();
