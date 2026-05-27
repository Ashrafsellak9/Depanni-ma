import path from "node:path";
import { fileURLToPath } from "node:url";

import { getGoogleMapsPublicKey, loadMonorepoEnv } from "../../packages/config/env/load-root-env.mjs";

const appDir = path.dirname(fileURLToPath(import.meta.url));
loadMonorepoEnv(appDir);

const googleMapsApiKey = getGoogleMapsPublicKey();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: googleMapsApiKey,
  },
  transpilePackages: ["@depanni/ui", "@depanni/types"],
  reactStrictMode: true,
};

export default nextConfig;
