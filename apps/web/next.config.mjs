import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@depanni/types", "@depanni/validators"],
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default withBundleAnalyzer(nextConfig);
