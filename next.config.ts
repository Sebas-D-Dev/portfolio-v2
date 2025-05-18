import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // config altered to static export for GitHub Pages deployment
  output: "export",
  // Output directory for static files
  distDir: "dist",
  // Enable React's strict mode for better error detection
  reactStrictMode: true,
};

export default nextConfig;
