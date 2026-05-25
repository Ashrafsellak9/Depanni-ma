import { api, unwrapApi } from "@/src/lib/api";
import type { ArtisanPayout } from "@/src/types/artisan";

export async function requestWalletPayout(payload: {
  amount: number;
  bankName: string;
  iban: string;
  securityPin?: string;
}): Promise<ArtisanPayout> {
  const res = await api.post("/wallet/payout", payload);
  return unwrapApi<ArtisanPayout>(res);
}

export async function upgradeSubscription(payload: {
  tier: "PREMIUM" | "PRO";
  method: "WALLET" | "CMI";
}): Promise<unknown> {
  const res = await api.post("/artisans/me/subscription/upgrade", payload);
  return unwrapApi(res);
}
