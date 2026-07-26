import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: { unoptimized: true },
  serverExternalPackages: [
    "pg",
    "@prisma/adapter-pg",
    "@prisma/client",
    "bcryptjs",
    "jsonwebtoken",
  ],
};

export default nextConfig;
