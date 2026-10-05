# Portfolio Website v2

Sebastian Torres’s personal portfolio, built with Next.js, React, TypeScript, and Tailwind CSS.

[Visit the portfolio](https://sebas-d-dev.github.io/portfolio-v2/) · [GitHub](https://github.com/Sebas-D-Dev)

The blue-on-dark single-page design includes a project showcase, experience and education timeline, optional RSS reader, and contact information.

## Project showcase

Personal work appears directly after the hero; professional experience follows it. Each project states its current status and only offers relevant actions:

- **3D Portfolio:** in-progress spatial portfolio, currently presented without a screenshot while a fresh capture of the renamed build is verified
- **portfolio-v2:** ongoing web portfolio, with source and live-site links
- **Stack Inventory:** inventory application shown with its verified project logo, plus source and a sign-in-required app link
- **Nexus:** early desktop-tool prototype, with source and labeled concept artwork
- **Directory Structure Generator:** developer-tool prototype, with source and labeled concept artwork

Project content lives in `app/data/content.ts`. See [image provenance](docs/project-images.md) before replacing or adding screenshots. Project screenshots and the Stack Inventory logo open directly in a new tab. Missing demos are not represented by disabled buttons or placeholder URLs.

## Local development

Use **Node.js 24 LTS** (see `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Development serves at `http://localhost:3000`. Optional configuration is documented in `.env.example`; copy it to `.env.local` only if needed.

## Build and verify

```sh
npm run lint
npm run typecheck
npm run build
npm run check:export
npx playwright install chromium
npm run test:smoke
```

`npm run build` writes a static site to `out/`, with Next.js intermediates in `.next/`. Use `npm run serve:export` to preview the export at `http://127.0.0.1:4173/`; `next start` does not serve a static export.

For GitHub Pages, build and test with the same target:

```sh
GITHUB_PAGES=true npm run build
GITHUB_PAGES=true npm run check:export
GITHUB_PAGES=true npm run test:smoke
```

On PowerShell, set `$env:GITHUB_PAGES="true"` before running those commands. Remove it or set it to `false` when returning to root-domain development. To use a locally installed Chromium for testing, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its executable path; CI downloads Playwright’s Chromium.

The export check verifies local asset URLs, résumé paths, anchors, metadata, project ordering, and absence of placeholder project links. Playwright tests desktop and mobile Chromium, drawer dismissal/focus/navigation, image loading, narrow-screen overflow, and unavailable-service states. They block external email requests and simulate unavailable RSS feeds; they do not send real email.

Pull requests run checks for both `/` and `/portfolio-v2`. The Pages workflow deploys only on `main` pushes or an explicit workflow dispatch. Opening a PR does not deploy it.

## Deployment paths and metadata

`next.config.ts` sets the base path and injects `NEXT_PUBLIC_BASE_PATH`. Use `assetPath()` or `resumeUrl` from `lib/site.ts` for files under `public/assets`; plain image URLs and native anchors do not automatically receive Next.js’s base path.

- GitHub Pages: `GITHUB_PAGES=true` (or `DEPLOY_TARGET=github-pages`) uses `/portfolio-v2`
- Root-domain hosting/local development: omit those flags
- `SITE_URL` sets the canonical public URL for metadata and social images, including a trailing slash; its default is the existing GitHub Pages site

The current résumé PDF and factual employment/education entries are retained. Replace them only with verified updated information.

## Optional contact form

The form uses EmailJS and expects all four build-time public values:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_USER_MESSAGE`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_AUTO_REPLY`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

Without them the form visibly explains that it is unavailable, disables submission, and offers the direct email link. It never reports a successful send when nothing was sent. If the owner notification succeeds but the auto-reply fails, the message is reported as sent so visitors are not encouraged to send duplicates.

No credentials are committed or provisioned by this project. EmailJS public identifiers are exposed in the client bundle by design; private credentials must never be used in `NEXT_PUBLIC_*` variables. The Pages workflow does not currently supply EmailJS values.

## RSS reader

The news section reads the configured RSS sources through AllOrigins, with a per-feed timeout. If all feeds fail, it shows an unavailable state and source links. If feeds load but contain no articles from the last three days, it shows a distinct empty state. Pagination is reader-controlled. No NewsAPI key is used.

## Maintenance

Next.js and its ESLint config are kept together on the 15.5 maintenance release line, currently 15.5.27, rather than introducing a major framework migration. See the [September 2026 security release](https://nextjs.org/blog/september-2026-security-release). CI uses [supported Node.js 24 LTS](https://nodejs.org/en/about/previous-releases). These dependency updates do not constitute a complete security audit.

## License

[MIT](LICENSE)

### Remaining dependency advisories

The October 5, 2026 production-dependency audit still reports three entries (two high, one moderate), arising from Next.js’s pinned transitive PostCSS and optional Sharp dependencies. This static export does not run a production Next.js server or image optimizer, and builds repository-controlled CSS; that narrows exposure but is not a blanket security guarantee. No forced major upgrade or unverified transitive override is included. Reassess these advisories before adding server-side processing or untrusted CSS/image inputs.
