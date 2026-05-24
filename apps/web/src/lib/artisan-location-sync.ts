import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/token";

const SW_PATH = "/sw-artisan.js";
const QUEUE_KEY = "depanni:location-queue";

export interface GeoCoords {
  lat: number;
  lng: number;
}

function readQueue(): GeoCoords[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as GeoCoords[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(queue: GeoCoords[]): void {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-20)));
}

export async function registerArtisanServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
    const token = getAccessToken();
    if (token && reg.active) {
      reg.active.postMessage({ type: "SET_TOKEN", token });
    } else if (token && reg.installing) {
      reg.installing.addEventListener("statechange", () => {
        if (reg.active) reg.active.postMessage({ type: "SET_TOKEN", token });
      });
    }
    return reg;
  } catch {
    return null;
  }
}

export async function postLocation(coords: GeoCoords): Promise<void> {
  await api.post("/artisans/me/location", coords);
}

export async function flushLocationQueue(): Promise<void> {
  const queue = readQueue();
  if (queue.length === 0) return;
  const last = queue[queue.length - 1];
  if (!last) return;
  try {
    await postLocation(last);
    writeQueue([]);
  } catch {
    /* retry later */
  }
}

export function enqueueLocation(coords: GeoCoords): void {
  const queue = readQueue();
  queue.push(coords);
  writeQueue(queue);

  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "QUEUE_LOCATION",
      coords,
      token: getAccessToken(),
    });
  }
}

export function requestGeolocation(): Promise<GeoCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 },
    );
  });
}

export type LocationTickHandler = (coords: GeoCoords) => void | Promise<void>;

export function startLocationInterval(
  onTick: LocationTickHandler,
  intervalMs = 30_000,
): () => void {
  let active = true;

  const run = async () => {
    if (!active) return;
    try {
      const coords = await requestGeolocation();
      if (document.visibilityState === "hidden") {
        enqueueLocation(coords);
      } else {
        await onTick(coords);
      }
    } catch {
      /* permission denied or timeout */
    }
  };

  void run();
  const id = window.setInterval(() => void run(), intervalMs);

  const onVisible = () => {
    if (document.visibilityState === "visible") {
      void flushLocationQueue();
    }
  };
  document.addEventListener("visibilitychange", onVisible);

  return () => {
    active = false;
    clearInterval(id);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
