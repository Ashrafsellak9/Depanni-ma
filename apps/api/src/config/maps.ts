import { Client } from "@googlemaps/google-maps-services-js";

import { env } from "./env.js";
import { logger } from "../utils/logger.js";

let mapsClient: Client | null = null;

export function getMapsClient(): Client | null {
  if (!env.GOOGLE_MAPS_API_KEY) {
    logger.warn("GOOGLE_MAPS_API_KEY missing — maps services disabled");
    return null;
  }

  if (!mapsClient) {
    mapsClient = new Client({});
  }
  return mapsClient;
}

export function getMapsApiKey(): string {
  if (!env.GOOGLE_MAPS_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }
  return env.GOOGLE_MAPS_API_KEY;
}
