import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      new URL(
        "https://wvuqhyuqzznhoiznaaub.supabase.co/storage/v1/object/public/images/**"
      ),
    ],
  },
};

export default nextConfig;
