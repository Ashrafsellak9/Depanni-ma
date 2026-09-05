import { FALLBACK_LOGIN_STATS } from "@/components/auth/authFormStyles";

export type LoginStatItem = { value: string; label: string };

export type LoginStatsApi = {
  activeArtisans: number;
  averageRating: number;
  avgResponseMinutes: number | null;
};

export function formatLoginStats(data: LoginStatsApi): LoginStatItem[] {
  const rating =
    data.averageRating > 0
      ? `${data.averageRating.toFixed(1).replace(".", ",")}★`
      : FALLBACK_LOGIN_STATS[1].value;

  const response =
    data.avgResponseMinutes != null
      ? `< ${data.avgResponseMinutes} min`
      : FALLBACK_LOGIN_STATS[2].value;

  return [
    {
      value: data.activeArtisans > 0 ? `${data.activeArtisans}` : FALLBACK_LOGIN_STATS[0].value,
      label: "Artisans actifs",
    },
    {
      value: rating,
      label: "Note moyenne",
    },
    {
      value: response,
      label: "Temps de réponse",
    },
  ];
}

export function getFallbackLoginStats(): LoginStatItem[] {
  return FALLBACK_LOGIN_STATS.map((s) => ({ value: s.value, label: s.label }));
}
