import fs from "node:fs";
import path from "node:path";

const ENV_FILES = [".env", ".env.local", ".env.development", ".env.development.local"];

/**
 * Parse un fichier .env minimal (clés simples, guillemets optionnels).
 * @param {string} filePath
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq <= 0) continue;

    const key = line.slice(0, eq).trim();
    if (key === "NODE_ENV") continue;
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadEnvDir(dir) {
  for (const file of ENV_FILES) {
    loadEnvFile(path.join(dir, file));
  }
}

/**
 * Charge le .env racine du monorepo puis celui de l'app Next.js.
 * @param {string} appDir — répertoire de l'app (ex. apps/web)
 */
export function loadMonorepoEnv(appDir) {
  const rootDir = path.resolve(appDir, "../..");
  loadEnvDir(rootDir);
  loadEnvDir(appDir);
}

/** Clé Maps côté navigateur (NEXT_PUBLIC_* ou repli sur GOOGLE_MAPS_API_KEY). */
export function getGoogleMapsPublicKey() {
  return (
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    ""
  );
}

/** Clé CARTO Basemaps (tuiles Leaflet landing). */
export function getCartoBasemapKey() {
  return process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim() || "";
}
