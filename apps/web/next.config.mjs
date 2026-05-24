/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@depanni/ui", "@depanni/types", "@depanni/validators"],
  reactStrictMode: true,
};

export default nextConfig;
