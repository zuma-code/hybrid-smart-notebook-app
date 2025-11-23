import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Permitir imágenes locales desde /uploads
    unoptimized: false,
  },
};

export default nextConfig;
