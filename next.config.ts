import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // The OG image reads its font from assets/ at render time. That directory is
  // outside public/, so it has to be traced explicitly or it will be missing
  // from the deployed bundle.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./assets/fonts/**"],
  },
};

export default nextConfig;
