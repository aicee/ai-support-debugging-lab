import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep `next build` from replacing assets used by a running dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
