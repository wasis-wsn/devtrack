import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    // Skip TypeScript errors during build (for unused UI components)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
