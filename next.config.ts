import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The desktop build (BUILD_STANDALONE=1) bundles a self-contained server for Electron to run.
  // Web deployments (Vercel) leave this unset and build normally.
  output: process.env.BUILD_STANDALONE ? "standalone" : undefined,
};

export default nextConfig;
