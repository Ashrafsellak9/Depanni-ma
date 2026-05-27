/** Clé Google Maps pour le client (injectée via next.config env). */
export function getGoogleMapsApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

export const DEFAULT_MAP_CENTER = { lat: 33.2316, lng: -8.5007 } as const;
