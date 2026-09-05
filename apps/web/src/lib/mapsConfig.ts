/** Clé Google Maps pour le client (injectée via next.config env). */
export function getGoogleMapsApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
}

/** Clé CARTO Basemaps pour les tuiles Leaflet (injectée via next.config env). */
export function getCartoBasemapKey(): string {
  return process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim() ?? "";
}

export function getCartoVoyagerTileUrl(): string {
  const key = getCartoBasemapKey();
  const base = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  return key ? `${base}?key=${encodeURIComponent(key)}` : base;
}

export const DEFAULT_MAP_CENTER = { lat: 33.2316, lng: -8.5007 } as const;
