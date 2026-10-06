// Plain asset URLs and native anchors do not inherit Next.js's basePath.
// This value is injected by next.config.ts for both server and client builds.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const assetPath = (filename: string) => `${basePath}/assets/${filename}`;
// Content version avoids serving the previously cached résumé after publication.
export const resumeUrl = `${assetPath('resume.pdf')}?v=5708d87f`;

// Override only when the canonical public deployment changes.
export const siteUrl = new URL(
  process.env.SITE_URL ?? 'https://sebas-d-dev.github.io/portfolio-v2/'
);
