export type SubscriptionTier = "STANDARD" | "PREMIUM" | "PRO";

export const COMMISSION_RATES: Record<SubscriptionTier, number> = {
  STANDARD: 0.15,
  PREMIUM: 0.1,
  PRO: 0.07,
};

export const PAYOUT_DELAY_LABEL: Record<SubscriptionTier, string> = {
  STANDARD: "72h ouvrées",
  PREMIUM: "24h",
  PRO: "24h",
};

export const SUBSCRIPTION_PLANS: Array<{
  tier: SubscriptionTier;
  label: string;
  priceMad: number;
  commissionPct: number;
  payoutDelay: string;
  perks: string[];
}> = [
  {
    tier: "STANDARD",
    label: "Standard",
    priceMad: 0,
    commissionPct: 15,
    payoutDelay: "72h",
    perks: ["Commission 15%", "Virement sous 72h"],
  },
  {
    tier: "PREMIUM",
    label: "Premium",
    priceMad: 199,
    commissionPct: 10,
    payoutDelay: "24h",
    perks: ["Commission 10%", "Virement sous 24h", "Priorité missions"],
  },
  {
    tier: "PRO",
    label: "Pro",
    priceMad: 399,
    commissionPct: 7,
    payoutDelay: "24h",
    perks: ["Commission 7%", "Virement sous 24h", "Support prioritaire"],
  },
];

export function estimatedMonthlySavings(
  tier: SubscriptionTier,
  monthlyGrossMad: number,
): number {
  const standard = monthlyGrossMad * COMMISSION_RATES.STANDARD;
  const target = monthlyGrossMad * COMMISSION_RATES[tier];
  return Math.max(0, Math.round(standard - target));
}
