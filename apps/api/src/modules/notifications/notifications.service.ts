import twilio from "twilio";

import { env } from "../../config/env.js";
import { getMessaging } from "../../config/firebase.js";
import { logger } from "../../utils/logger.js";
import { AppError } from "../../utils/errors.js";

export class NotificationsService {
  private getTwilio() {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
      return null;
    }
    return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, body: string): Promise<void> {
    const client = this.getTwilio();
    if (!client || !env.TWILIO_PHONE_NUMBER) {
      logger.warn("Twilio not configured — SMS skipped", { to });
      return;
    }
    await client.messages.create({ to, from: env.TWILIO_PHONE_NUMBER, body });
  }

  async sendPush(token: string, title: string, body: string): Promise<void> {
    const messaging = getMessaging();
    if (!messaging) {
      logger.warn("FCM not configured — push skipped");
      return;
    }
    await messaging.send({ token, notification: { title, body } });
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    await this.sendSms(phone, `DEPANNI — Votre code: ${code}. Valide 10 minutes.`);
  }

  assertSmsConfigured(): void {
    if (!env.TWILIO_ACCOUNT_SID) {
      throw new AppError(503, "SMS_UNAVAILABLE", "Service SMS indisponible");
    }
  }
}

export const notificationsService = new NotificationsService();
