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

The follow-up revision renames the featured project to **3D Portfolio**, replaces the Portfolio V2 thumbnail/social image with the current PR-build hero capture, and uses the verified Stack Inventory logo instead of an old application screenshot. The 3D card initially stayed text-only; the October 6 owner-supplied scene image now replaces that temporary state. Static export and browser guards reject the former brand and stale image references; image loading and the logo action remain covered by the browser suite.

## Hero framing revision

The Portfolio V2 image now uses a padded 16:10 detail of the actual hero card. Browser checks verify that the capture rectangle stays inside the hero, leaves at least 40 pixels around all meaningful card content, and produces exactly 1000×625 pixels. Both desktop and mobile checks also verify the installed image path, natural/rendered aspect ratios, and `object-fit: contain`, then save an isolated `portfolio-card.png` for visual inspection. This supplements the complete showcase captures.

## 3D scene integration

The owner-supplied 1973×908 PNG is preserved byte-for-byte. The featured image uses its full native ratio, contain sizing, and no hover zoom. Desktop/mobile checks verify the scene asset, full-size screenshot action, natural/rendered ratio, and no normal-motion hover transform, then save isolated `3d-scene-card.png` captures for pixel inspection. The existing clean portfolio hero image and Stack Inventory logo are unchanged.

## October 6 interaction, contact, RSS and About follow-on

- Hover effects use narrow opacity/color/transform transitions; drawer hover no longer animates width and height, and the back-to-top button no longer has two competing transform engines. Footer scroll-time layout reads are removed. Canvas work pauses when the hero is offscreen, the tab is hidden, or the native menu is open; expensive per-particle shadow/gradient work is removed. These are measured behavior/implementation guards, not a claim of a particular FPS on the user's hardware.
- Native details/summary controls consolidate education/recognition and expose role details. Consistent left rails work at desktop and mobile widths. Content sources and the older downloadable résumé limitation are recorded in `content-updates.md`.
- Required EmailJS identifiers are explicitly wired from GitHub repository variables. No configuration values were read, added or changed. Tests use only fake identifiers and intercepted requests, covering no configuration, owner-only delivery, optional auto-reply, failure, and the one-second send interval.
- RSS parser unit tests cover RSS/Atom, plain-text normalization, HTTPS link/date validation, duplicate entries, empty feeds, malformed XML, entity declarations and oversized input. Browser cases cover delayed loader, saved/empty/malformed snapshots, stale results, partial failures, manual refresh, filtering and unsafe URLs. Real build-feed health is reported separately.
- Existing local Chromium restrictions remain. Final desktop/mobile pixels and browser results must be obtained from the new PR's CI artifacts. Both export paths are built locally with `NEWS_FETCH=false`; live source fetching is tested in CI. No recurring deploy is configured.


The first follow-on CI run (`37498784860`, head `2be9212`) fetched 48 real articles from eight original sources. The former AI News URL returned invalid XML/HTML and was removed. The checked-in fallback snapshot records those actual source-check/publication timestamps, not invented sample stories. The final CI assertion also requires an article from a source freshly fetched during that specific build, so cached fallback alone cannot satisfy live-feed verification.


## Owner-selected résumé and final copy refinement

The downloadable résumé now uses the exact current 3D Portfolio PDF selected by the owner on October 6. It is copied unchanged; a SHA-256 guard validates both exported résumé links against the selected bytes. The project display name and social metadata use **Portfolio V2**, while repository URLs, filenames, and the Pages base path remain unchanged. About is reduced to one concise sentence without repeating the owner’s name, and the academic-recognition accordion is removed. Earlier notes about retaining the old PDF and recognition section describe superseded revisions, not the final UI.

## Contact input hardening

The follow-on input checks trim submitted data, enforce 100/254/5,000-character bounds, reject blank name/message and control characters in header-like fields, and retain browser-native email validity. Five unit cases and a configured-browser scenario cover whitespace, oversized/programmatically changed fields, header controls, and legitimate code/angle-bracket messages. The form never renders visitor text as HTML, and no message is pre-escaped or silently stripped. All test sends are intercepted. These are client-side input-hygiene checks, not protection against a caller who bypasses the page and uses EmailJS directly; provider/template protections remain a separate setup review.


## Public 3D link and release audit

The owner approved anyone-with-the-link access for 3D Portfolio. Its public access setting and an anonymous200 response with no login gate were verified before adding the exact public URL. See `link-audit.md` for local/navigation/contact coverage, verified public source repositories, and external-service limitations. The final About copy is the owner's approved two-sentence curiosity-led introduction; browser checks enforce at most two natural desktop lines and preserve readable, unclipped wrapping on smaller screens.
