import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        "https://wvuqhyuqzznhoiznaaub.supabase.co/storage/v1/object/public/images/**",
      ),
    ],
  },
};

export default nextConfig;
