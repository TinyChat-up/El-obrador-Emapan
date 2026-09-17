import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF y WebP según lo que admita cada navegador.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
