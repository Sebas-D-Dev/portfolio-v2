import { readFile } from 'node:fs/promises';

// Inspect only the rendered public UI, never configuration values. This allows
// hosting build logs to confirm that the intended environment reached Next.js.
const html = await readFile('out/index.html', 'utf8');
const start = html.indexOf('<section id="contact"');
const section = html.slice(start, html.indexOf('</section>', start));
if (start < 0) throw new Error('Rendered contact section is missing');
if (section.includes('Form unavailable')) {
  console.log('Contact UI: unavailable (required public build identifiers are missing).');
} else if (section.includes('Send Message')) {
  console.log('Contact UI: configured (required public build identifiers present; email delivery unverified).');
} else {
  throw new Error('Rendered contact form state is unknown');
}
