/** Fenêtre d'offres : 10 minutes depuis la création du job. */
export const OFFER_WINDOW_MS = 10 * 60 * 1000;

export function offerWindowEndsAt(createdAt: string): number {
  return new Date(createdAt).getTime() + OFFER_WINDOW_MS;
}

export function offerWindowRemainingSeconds(createdAt: string, now = Date.now()): number {
  return Math.max(0, Math.floor((offerWindowEndsAt(createdAt) - now) / 1000));
}

export function isOfferWindowOpen(createdAt: string, now = Date.now()): boolean {
  return offerWindowRemainingSeconds(createdAt, now) > 0;
}

export function computePriceHints(budgetMin: number | null, budgetMax: number | null): {
  min: number;
  recommended: number;
  max: number;
} {
  const min = budgetMin ?? 80;
  const max = budgetMax ?? Math.max(min * 1.5, 400);
  const recommended = Math.round((min + max) / 2);
  return { min, recommended, max };
}

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
