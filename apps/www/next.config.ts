import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ["@plobbo/api", "@plobbo/ui"],
};

export default nextConfig;
