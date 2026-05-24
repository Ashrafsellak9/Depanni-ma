/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@depanni/types", "@depanni/validators"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
