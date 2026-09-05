import { env } from "./env.js";

/** Mode OTP local : Twilio absent → code exposé uniquement en development/test. */
export function isOtpDevMode(): boolean {
  if (env.NODE_ENV !== "development" && env.NODE_ENV !== "test") {
    return false;
  }
  return !env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_PHONE_NUMBER;
}
