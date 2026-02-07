import type { NextConfig } from "next";

// Determine if deploying to GitHub Pages (not Vercel)
// GitHub Pages needs basePath, Vercel does not
const isGitHubPages = process.env.GITHUB_PAGES === "true" || process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  // Only use basePath for GitHub Pages deployment
  // Vercel deployments should NOT have basePath (served at root domain)
  basePath: isGitHubPages ? "/portfolio-v2" : "",
  // Static export for GitHub Pages deployment
  output: "export",
  // Output directory for static files
  distDir: "out",
  // Enable React's strict mode for better error detection
  reactStrictMode: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;