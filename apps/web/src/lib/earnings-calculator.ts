// TODO: remplacer TRADE_STATS, NEIGHBORHOOD_MULTIPLIER et COMMISSION_RATE
// par les moyennes réelles des artisans El Jadida avant mise en production.

export type Trade =
  | "plomberie"
  | "electricite"
  | "serrurerie"
  | "mecanique"
  | "peinture"
  | "menage"
  | "electromenager";

type TradeStats = {
  avgPrice: number;
  avgDurationHours: number;
  demandMultiplier: number;
};

const TRADE_STATS: Record<Trade, TradeStats> = {
  plomberie: { avgPrice: 220, avgDurationHours: 1.5, demandMultiplier: 1.3 },
  electricite: { avgPrice: 195, avgDurationHours: 1.4, demandMultiplier: 1.1 },
  serrurerie: { avgPrice: 280, avgDurationHours: 1.0, demandMultiplier: 0.9 },
  mecanique: { avgPrice: 350, avgDurationHours: 2.0, demandMultiplier: 0.7 },
  peinture: { avgPrice: 850, avgDurationHours: 6.0, demandMultiplier: 0.5 },
  menage: { avgPrice: 180, avgDurationHours: 3.0, demandMultiplier: 1.2 },
  electromenager: { avgPrice: 240, avgDurationHours: 1.8, demandMultiplier: 0.8 },
};

const NEIGHBORHOOD_MULTIPLIER: Record<string, number> = {
  "Centre-ville": 1.15,
  "Hay Salam": 1.05,
  "Hay El Matar": 1.0,
  "Sidi Bouzid": 0.95,
  Plateau: 1.1,
  "El Jadida Beach": 1.2,
  "Sidi Moussa": 0.9,
  "Boulevard Mohammed V": 1.05,
  "Hay Essalam": 0.95,
  "Route de Casablanca": 0.9,
};

const COMMISSION_RATE = 0.15;

export function calculateMonthlyEarnings(
  trade: Trade,
  hoursPerWeek: number,
  neighborhoods: string[],
) {
  const stats = TRADE_STATS[trade];
  const zoneMultiplier =
    neighborhoods.length === 0
      ? 1
      : neighborhoods.reduce((sum, n) => sum + (NEIGHBORHOOD_MULTIPLIER[n] ?? 1), 0) /
        neighborhoods.length;

  const productiveHoursPerMonth = hoursPerWeek * 4.33 * 0.7;

  const missionsPerMonth = Math.round(
    (productiveHoursPerMonth / stats.avgDurationHours) * stats.demandMultiplier * zoneMultiplier,
  );

  const grossRevenue = missionsPerMonth * stats.avgPrice;
  const netRevenue = Math.round(grossRevenue * (1 - COMMISSION_RATE));

  return {
    missionsPerMonth,
    avgPrice: stats.avgPrice,
    grossRevenue,
    commission: Math.round(grossRevenue * COMMISSION_RATE),
    netRevenue,
  };
}
