import { GOOGLE_MAPS_API_KEY } from "@/src/lib/config";

export interface DirectionsEta {
  durationMinutes: number;
  distanceKm: number;
}

/** Décode une polyline encodée Google Directions */
export function decodePolyline(encoded: string): { latitude: number; longitude: number }[] {
  const points: { latitude: number; longitude: number }[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

export async function fetchDrivingRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<{ coordinates: { latitude: number; longitude: number }[]; eta: DirectionsEta | null }> {
  if (!GOOGLE_MAPS_API_KEY) {
    return { coordinates: [origin, destination].map((p) => ({ latitude: p.lat, longitude: p.lng })), eta: null };
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;
  const res = await fetch(url);
  const json = (await res.json()) as {
    routes?: Array<{
      overview_polyline?: { points?: string };
      legs?: Array<{ duration?: { value: number }; distance?: { value: number } }>;
    }>;
  };

  const route = json.routes?.[0];
  const encoded = route?.overview_polyline?.points;
  const leg = route?.legs?.[0];
  const coordinates = encoded
    ? decodePolyline(encoded)
    : [
        { latitude: origin.lat, longitude: origin.lng },
        { latitude: destination.lat, longitude: destination.lng },
      ];

  const eta =
    leg?.duration?.value && leg.distance?.value
      ? {
          durationMinutes: Math.ceil(leg.duration.value / 60),
          distanceKm: Math.round((leg.distance.value / 1000) * 10) / 10,
        }
      : null;

  return { coordinates, eta };
}

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
