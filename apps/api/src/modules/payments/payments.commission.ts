import type { ArtisanSubscriptionTier } from "@prisma/client";

import { env } from "../../config/env.js";

const TIER_RATES: Record<ArtisanSubscriptionTier, number> = {
  STANDARD: env.WALLET_COMMISSION_RATE_STANDARD,
  PREMIUM: env.WALLET_COMMISSION_RATE_PREMIUM,
  PRO: env.WALLET_COMMISSION_RATE_PRO,
};

export function getCommissionRate(tier: ArtisanSubscriptionTier): number {
  return TIER_RATES[tier];
}

export function splitCommission(
  jobAmount: number,
  commissionRate: number,
): { artisanNet: number; depanniRevenue: number; commissionRate: number } {
  const depanniRevenue = Math.round(jobAmount * commissionRate * 100) / 100;
  const artisanNet = Math.round((jobAmount - depanniRevenue) * 100) / 100;
  return { artisanNet, depanniRevenue, commissionRate };
}
