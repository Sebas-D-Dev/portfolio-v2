# Portfolio V2

Sebastian Torres’s personal portfolio, built with Next.js, React, TypeScript, and Tailwind CSS.

[Visit the portfolio](https://sebas-d-dev.github.io/portfolio-v2/) · [GitHub](https://github.com/Sebas-D-Dev)

The blue-on-dark single-page design includes a project showcase, expandable experience/education timeline, RSS reader, and contact information.

## Project showcase

Personal work appears directly after the hero; professional experience follows it. Each project states its current status and only offers relevant actions:

- **3D Portfolio:** in-progress spatial portfolio, with an owner-supplied screenshot of the actual 3D facility scene
- **Portfolio V2:** ongoing web portfolio, with source and live-site links
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
npm run test:unit
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

The downloadable résumé is the exact PDF selected by the owner from 3D Portfolio. About is a brief introduction, and the consolidated FAU card retains degree/minor/coursework details. See [content provenance](docs/content-updates.md).

## Contact form configuration

The form uses EmailJS. These **public build-time identifiers** are required:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_USER_MESSAGE`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

`NEXT_PUBLIC_EMAILJS_TEMPLATE_AUTO_REPLY` is optional. A missing confirmation template does not block the owner's message. When configured, the confirmation is sent at least one second later to respect EmailJS's rate limit. A failed confirmation never asks the visitor to duplicate an already-delivered message.

For GitHub Pages, add the public identifiers in **Repository Settings → Secrets and variables → Actions → Variables**. The Pages workflow explicitly passes those repository variables into `next build`. For Vercel, set them for the intended environment in the existing project's environment-variable settings and rebuild. Values configured on Vercel do not automatically reach GitHub Pages. No values, credentials, permissions, or account settings are provisioned by this PR. Never use a private EmailJS key or service password in a `NEXT_PUBLIC_*` field.

Without required identifiers, the UI offers the direct email link and disables submission rather than promising delivery. Production delivery must be checked separately with approval to send a test email. CI uses fake identifiers and intercepts all email requests; no real mail is sent.

See [Next.js build-time public variables](https://nextjs.org/docs/pages/guides/environment-variables) and [EmailJS send requirements/rate limit](https://www.emailjs.com/docs/sdk/send/).

## RSS reader

`npm run build` first runs `news:refresh`: it reads the allowlisted RSS/Atom sources directly with eight-second deadlines, three concurrent requests, and a two-megabyte limit per response. The output is sanitized plain-text JSON at `public/news.json`. The site loads this one same-origin file, avoiding a browser dependency on eight proxy requests. No feed HTML or third-party article images are embedded. Invalid dates, future-dated entries and non-HTTPS/credential-bearing links are excluded. The former AI News endpoint was removed after it returned HTML instead of RSS; the AI category retains Machine Learning Mastery.

The reader shows source-check and publication timestamps, a reduced-motion-aware loader, partial failure/empty states, category filters and manual pagination. The All view balances publishers so a high-volume source cannot fill its entire first page. It shows latest available stories instead of silently hiding everything older than three days. **Refresh sources** attempts the existing AllOrigins proxy only when requested, retaining saved stories if it fails. The checked-in fallback was acquired from eight live RSS sources in CI on October 6, 2026; each regular build regenerates it and retains valid existing entries for individual failed sources.

Snapshots update during builds/deployments. There is **no automatic refresh/deployment schedule**. Old saved results are visibly labeled after 24 hours; a failed refresh never changes their last-success timestamps. Run `npm run news:refresh` to update locally when permitted, or use the existing manual Pages deployment after publication is authorized. For an offline build, use `NEWS_FETCH=false npm run build`.

CI reports real feed health separately from browser fixtures and requires at least one real article in its build. It also tests cached partial/outage states and manual-refresh recovery without contacting the real proxy from browser tests.

## Maintenance

Next.js and its ESLint config are kept together on the 15.5 maintenance release line, currently 15.5.27, rather than introducing a major framework migration. See the [September 2026 security release](https://nextjs.org/blog/september-2026-security-release). CI uses [supported Node.js 24 LTS](https://nodejs.org/en/about/previous-releases). These dependency updates do not constitute a complete security audit.

## License

[MIT](LICENSE)

### Remaining dependency advisories

The October 5, 2026 production-dependency audit still reports three entries (two high, one moderate), arising from Next.js’s pinned transitive PostCSS and optional Sharp dependencies. This static export does not run a production Next.js server or image optimizer, and builds repository-controlled CSS; that narrows exposure but is not a blanket security guarantee. No forced major upgrade or unverified transitive override is included. Reassess these advisories before adding server-side processing or untrusted CSS/image inputs.
