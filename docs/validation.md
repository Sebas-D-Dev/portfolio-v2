# Validation notes

## Scope

This update preserves the existing single-page identity while repairing deployment paths, replacing placeholder project entries, and adding accurate screenshot/status presentation. It does not replace the résumé, change employment or graduation claims, publish a new site, or introduce service credentials.

## Local checks

- ESLint and TypeScript checks run against the changed source.
- Static exports are built at both `/` and `/portfolio-v2`.
- `check:export` verifies local asset/résumé URLs, section anchors, absolute social metadata, project ordering, and placeholder removal.
- Original résumé contents are unchanged.

## Browser checks

The Playwright suite covers desktop and mobile Chromium, loaded images and résumé download, drawer focus/keyboard/backdrop/repeated-open behavior, normal and reduced motion, 320px overflow, unavailable contact configuration, failed/empty/valid RSS feeds, and unsafe article link filtering. It also records project-showcase screenshots.

Local Chromium launch was blocked by the execution environment’s local socket restrictions before tests could run. Browser results must therefore come from the PR’s **Portfolio checks** workflow, which tests both export targets. See the workflow status for the exact commit; source inspection or a successful build is not a browser pass.

Tests block real EmailJS calls. No live email was sent, and successful delivery with production credentials remains unverified. A missing EmailJS build configuration intentionally leaves the form unavailable with a direct email link.

## Review

An independent source and screenshot review found an IntersectionObserver margin portability issue; the implementation now uses viewport-height-derived pixel margins and recreates the observer on resize. No material source-review findings remained after this correction. This is a bounded review, not a full accessibility or security audit.

The first CI browser run caught a missing Shift+Tab wrap in the drawer and a horizontal overflow at a 320px desktop viewport. Follow-up fixes explicitly wrap focus at the dialog boundaries and use a one-column, shrinkable contact grid with responsive padding, and clip horizontal entrance effects within the news/contact sections. The same tests remain in place; consult the latest CI run for their result.

## Project visual revision

The follow-up revision renames the featured project to **3D Portfolio**, replaces the portfolio-v2 thumbnail/social image with the current PR-build hero capture, and uses the verified Stack Inventory logo instead of an old application screenshot. The 3D card initially stayed text-only; the October 6 owner-supplied scene image now replaces that temporary state. Static export and browser guards reject the former brand and stale image references; image loading and the logo action remain covered by the browser suite.

## Hero framing revision

The portfolio-v2 image now uses a padded 16:10 detail of the actual hero card. Browser checks verify that the capture rectangle stays inside the hero, leaves at least 40 pixels around all meaningful card content, and produces exactly 1000×625 pixels. Both desktop and mobile checks also verify the installed image path, natural/rendered aspect ratios, and `object-fit: contain`, then save an isolated `portfolio-card.png` for visual inspection. This supplements the complete showcase captures.

## 3D scene integration

The owner-supplied 1973×908 PNG is preserved byte-for-byte. The featured image uses its full native ratio, contain sizing, and no hover zoom. Desktop/mobile checks verify the scene asset, full-size screenshot action, natural/rendered ratio, and no normal-motion hover transform, then save isolated `3d-scene-card.png` captures for pixel inspection. The existing clean portfolio hero image and Stack Inventory logo are unchanged.
