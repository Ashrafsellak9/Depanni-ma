import bundleAnalyzer from "@next/bundle-analyzer";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getCartoBasemapKey,
  getGoogleMapsPublicKey,
  loadMonorepoEnv,
} from "../../packages/config/env/load-root-env.mjs";

const appDir = path.dirname(fileURLToPath(import.meta.url));
loadMonorepoEnv(appDir);

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const googleMapsApiKey = getGoogleMapsPublicKey();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: googleMapsApiKey,
    NEXT_PUBLIC_CARTO_API_KEY: getCartoBasemapKey(),
  },
  transpilePackages: ["@depanni/types", "@depanni/validators"],
  reactStrictMode: true,
  output: "standalone",
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [{ source: "/og-image.png", destination: "/opengraph-image" }];
  },
};

export default withBundleAnalyzer(nextConfig);
