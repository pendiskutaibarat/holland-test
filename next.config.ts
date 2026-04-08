import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/holland-test",
  images: { unoptimized: true },
};

export default nextConfig;
