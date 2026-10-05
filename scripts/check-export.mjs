import assert from 'node:assert/strict';
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
assert(html.includes('Caverna D Sebas') && html.includes('Directory Structure Generator'), 'Missing project cards');
assert(html.indexOf('id="projects"') < html.indexOf('id="about"'), 'Personal projects must precede experience');
assert.equal((html.match(/href="[^\"]*assets\/resume.pdf"/g) ?? []).length, 2, 'Both résumé links must use the shared asset path');
assert(/property="og:image" content="https:\/\//.test(html), 'Open Graph image must be absolute');
console.log(`Static export checks passed (${basePath || '/'}, ${assets} local URLs)`);
