import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "../../config/env.js";
import { AppError } from "../../utils/errors.js";

export interface CmiPaymentForm {
  gatewayUrl: string;
  fields: Record<string, string>;
}

/** Génère le formulaire de redirection CMI 3-D Secure. */
export function buildCmiPaymentForm(params: {
  orderId: string;
  amount: number;
  currency?: string;
  description?: string;
  email?: string;
}): CmiPaymentForm {
  if (!env.CMI_MERCHANT_ID || !env.CMI_STORE_KEY) {
    throw new AppError(503, "CMI_UNAVAILABLE", "Passerelle CMI non configurée");
  }

  const amountStr = params.amount.toFixed(2);
  const fields: Record<string, string> = {
    clientid: env.CMI_MERCHANT_ID,
    amount: amountStr,
    oid: params.orderId,
    okUrl: env.CMI_RETURN_URL,
    failUrl: env.CMI_FAIL_URL,
    callbackUrl: env.CMI_CALLBACK_URL,
    currency: params.currency ?? "504",
    lang: "fr",
    hashAlgorithm: "ver3",
    storetype: "3d_pay_hosting",
    trantype: "PreAuth",
    ...(params.email ? { email: params.email } : {}),
    ...(params.description ? { description: params.description } : {}),
  };

  fields.HASH = computeCmiHash(fields, env.CMI_STORE_KEY);

  return { gatewayUrl: env.CMI_GATEWAY_URL, fields };
}

/**
 * Vérification signature CMI (HMAC-SHA256 ver3).
 * Exclut HASH / encoding et trie les paramètres par clé.
 */
export function verifyCmiCallback(params: Record<string, string>): boolean {
  if (!env.CMI_STORE_KEY) {
    throw new AppError(503, "CMI_UNAVAILABLE", "CMI non configuré");
  }

  const receivedHash = params.HASH ?? params.hash;
  if (!receivedHash) return false;

  const expected = computeCmiHash(params, env.CMI_STORE_KEY);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(receivedHash));
  } catch {
    return expected === receivedHash;
  }
}

function computeCmiHash(params: Record<string, string>, storeKey: string): string {
  const excluded = new Set(["HASH", "hash", "encoding"]);
  const sortedKeys = Object.keys(params)
    .filter((k) => !excluded.has(k) && params[k] !== "")
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const values = sortedKeys.map((k) => params[k]!.replace(/\\/g, "\\\\").replace(/\|/g, "\\|"));
  const plain = `${values.join("|")}|${storeKey}`;

  return createHmac("sha256", storeKey).update(plain, "utf8").digest("base64");
}
