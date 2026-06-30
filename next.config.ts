import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product images are uploaded to and served from ImageKit.
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
