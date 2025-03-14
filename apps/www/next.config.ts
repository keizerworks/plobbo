import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: [
    "@plobbo/api",
    "@plobbo/ui",
    "@plobbo/db",
    "@plobbo/plate-ui",
  ],
  images: { remotePatterns: [{ hostname: "**" }] },
};

export default nextConfig;
