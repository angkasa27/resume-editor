import type { NextConfig } from "next";

export default function createNextConfig(): NextConfig {
  const nextConfig: NextConfig = {
    reactCompiler: true,
    images: {
      qualities: [80, 100],
    },
  };

  return nextConfig;
}
