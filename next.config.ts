import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Allow unoptimized local images as fallbacks
    unoptimized: false,
  },
};

export default nextConfig;
