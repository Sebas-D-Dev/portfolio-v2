import type { NextConfig } from "next";

// Check if in npm dev or production environment
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Update image config path
  basePath: isProd ? "/portfolio-v2" : "",
  // config altered to static expot for GitHub Pages deployment
  output: "export",
  // Output directory for static files
  distDir: "out",
  // Enable React's strict mode for better error detection
  reactStrictMode: true,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;