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
  redirects() {
    return [
      {
        source: "/npl/completed",
        destination: "/npl/verified",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
