/* Service Worker — file d'attente positions artisan (sync en arrière-plan) */
const QUEUE_DB = "depanni-artisan-loc";
let authToken = "";
let apiBase = "http://localhost:4000/api";

self.addEventListener("message", (event) => {
  const { type, token, coords, apiUrl } = event.data ?? {};
  if (type === "SET_TOKEN" && token) {
    authToken = token;
    if (apiUrl) apiBase = apiUrl;
  }
  if (type === "QUEUE_LOCATION" && coords) {
    if (token) authToken = token;
    void pushQueue(coords);
  }
});

async function pushQueue(coords) {
  const cache = await caches.open(QUEUE_DB);
  const res = await cache.match("queue");
  const list = res ? await res.json() : [];
  list.push({ ...coords, at: Date.now() });
  await cache.put("queue", new Response(JSON.stringify(list.slice(-20))));
}

async function readQueue() {
  const cache = await caches.open(QUEUE_DB);
  const res = await cache.match("queue");
  if (!res) return [];
  return res.json();
}

async function clearQueue() {
  const cache = await caches.open(QUEUE_DB);
  await cache.delete("queue");
}

async function flushQueue() {
  if (!authToken) return;
  const list = await readQueue();
  if (!list.length) return;
  const last = list[list.length - 1];
  try {
    await fetch(`${apiBase}/artisans/me/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ lat: last.lat, lng: last.lng }),
      credentials: "include",
    });
    await clearQueue();
  } catch {
    /* retry on next sync */
  }
}

self.addEventListener("sync", (event) => {
  if (event.tag === "artisan-location-sync") {
    event.waitUntil(flushQueue());
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "artisan-location") {
    event.waitUntil(flushQueue());
  }
});
