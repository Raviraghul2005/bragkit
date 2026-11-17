import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // `scripts/dev-alt.mjs` sets this so a second dev server can run beside the first.
  distDir: process.env.BK_DIST_DIR || ".next",
};

export default nextConfig;
