import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const basePath = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'github-pages' ? '/portfolio-v2' : '';
const html = await readFile('out/index.html', 'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
let assets = 0;
for (const [, value] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (value.startsWith('#')) {
    assert(ids.has(value.slice(1)), `Missing anchor: ${value}`);
  } else if (value.startsWith('/') && !value.startsWith('//')) {
    assert(!basePath || value.startsWith(`${basePath}/`), `Missing basePath: ${value}`);
    const path = value.slice(basePath.length).split('?')[0];
    await access(resolve('out', `.${path}`));
    assets++;
  }
}
assert(assets > 10, 'Expected generated assets, screenshots, résumé, and social icons');
assert(!html.includes('http://localhost:3000'), 'Localhost metadata leaked into export');
assert(!html.includes('Project Title '), 'Placeholder project remains');
assert(!html.includes('https://example.com'), 'Placeholder link remains');
assert(html.includes('3D Portfolio') && html.includes('Directory Structure Generator'), 'Missing project cards');
assert(html.indexOf('id="projects"') < html.indexOf('id="about"'), 'Personal projects must precede experience');
assert.equal((html.match(/href="[^\"]*assets\/resume.pdf\?v=5708d87f"/g) ?? []).length, 2, 'Both résumé links must use the shared asset path');
assert(/property="og:image" content="https:\/\//.test(html), 'Open Graph image must be absolute');

for (const stale of ['Caverna D Sebas', 'STRATUM', 'caverna-earlier-home.png', 'stack-inventory-posts.jpg', '/assets/home-page.jpg', 'projects/portfolio-v2-home.png']) {
  assert(!html.includes(stale), `Outdated project name or image: ${stale}`);
}
assert(html.includes('assets/projects/portfolio-v2-hero-card.png'), 'Updated portfolio screenshot is missing');
assert(html.includes('assets/projects/stack-inventory-logo.png'), 'Stack Inventory must use its project logo');
assert(html.includes('assets/projects/3d-portfolio-scene.png'), 'The verified 3D scene screenshot is missing');
assert(html.includes('View 3D Portfolio screenshot'), 'The 3D screenshot action is missing');

assert(html.includes('Portfolio V2'), 'Project display name must use Portfolio V2');
assert(!html.includes('Academic recognition'), 'Removed academic recognition section remains');
assert.equal(createHash('sha256').update(await readFile('out/assets/resume.pdf')).digest('hex'), '5708d87f4107469af7f7ddd8e6bbbf9dd96df5bcbdf968062f77ba261f487d6f', 'Exported résumé must be the exact selected 3D Portfolio PDF');

assert(html.includes(`href="${basePath}/favicon.svg"`), 'SVG favicon must use the deployment base path');
assert(html.includes(`href="${basePath}/apple-touch-icon.png"`), 'Apple touch icon must use the deployment base path');
assert(html.includes(`href="${basePath}/site.webmanifest"`), 'Manifest must use the deployment base path');
const manifest = JSON.parse(await readFile('out/site.webmanifest', 'utf8'));
const manifestUrl = new URL(`${basePath}/site.webmanifest`, 'https://portfolio.example');
assert.equal(new URL(manifest.start_url, manifestUrl).pathname, `${basePath}/`);
assert.equal(new URL(manifest.scope, manifestUrl).pathname, `${basePath}/`);
for (const icon of manifest.icons) {
  const url = new URL(icon.src, manifestUrl);
  assert.equal(url.origin, manifestUrl.origin);
  assert(url.pathname.startsWith(`${basePath}/`));
  const file = await readFile(resolve('out', `.${url.pathname.slice(basePath.length)}`));
  assert.equal(`${file.readUInt32BE(16)}x${file.readUInt32BE(20)}`, icon.sizes);
}
const favicon = await readFile('out/favicon.ico');
assert.equal(favicon.readUInt16LE(2), 1, 'Fallback favicon must be an ICO');
assert.equal(favicon.readUInt16LE(4), 3, 'ICO must include the approved 16/32/48 px sizes');
assert.deepEqual([favicon[6], favicon[22], favicon[38]], [16, 32, 48]);

console.log(`Static export checks passed (${basePath || '/'}, ${assets} local URLs)`);
