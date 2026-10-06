import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';

const emptySnapshot = { generatedAt: new Date().toISOString(), articles: [], sources: [{ id: 'techcrunch', status: 'ok', fetchedAt: new Date().toISOString() }] };
const article = (title = 'Recent test article', url = 'https://www.nasa.gov/') => ({ title, url, description: 'A fixture for offline browser testing.', urlToImage: '', publishedAt: new Date().toISOString(), source: { id: 'techcrunch', name: 'TechCrunch' }, category: 'tech' });
const snapshot = (articles = [article()]) => ({ ...emptySnapshot, articles });

test.beforeEach(async ({ page }) => {
  // No real email or third-party feed requests during tests.
  await page.route('**/news.json', route => route.fulfill({ json: { ...emptySnapshot, sources: [] } }));
  await page.route('https://api.allorigins.win/**', route => route.abort());
  await page.route('https://api.emailjs.com/**', route => route.abort());
});

test('export has working images, links, metadata and honest project statuses', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('#home a').first().locator('..')).toHaveCSS('opacity', '1');
  await page.locator('#home').screenshot({ path: test.info().outputPath('hero.png'), style: '.skip-link { visibility: hidden !important; }' });
  await expect(page.getByRole('heading', { name: 'Personal Projects' })).toBeVisible();
  await expect(page.locator('#projects article')).toHaveCount(5);
  await expect(page.locator('#project-3d-portfolio')).toHaveText('3D Portfolio');
  await expect(page.locator('#project-portfolio')).toHaveText('Portfolio V2');
  await expect(page.getByRole('link', { name: 'Explore in 3D for 3D Portfolio (opens in a new tab)' })).toHaveAttribute('href', 'https://engineering-3d-portfolio.storres788559.chatgpt.site');
  await expect(page).toHaveTitle('Portfolio V2 | Sebastian Torres');
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', 'Portfolio V2');
  await expect(page.locator('#projects')).toContainText('Early prototype');
  await expect(page.locator('#projects')).toContainText('Not an app screenshot');
  await expect(page.locator('#projects button[disabled]')).toHaveCount(0);
  await expect(page.locator('#projects')).not.toContainText('Caverna D Sebas');
  await expect(page.locator('#projects')).not.toContainText('STRATUM');
  await expect(page.locator('#projects')).not.toContainText('Earlier development build');
  await expect(page.getByRole('link', { name: 'View 3D Portfolio screenshot (opens in a new tab)' })).toHaveAttribute('href', /3d-portfolio-scene\.png$/);
  await expect(page.getByRole('link', { name: 'View Stack Inventory logo (opens in a new tab)' })).toHaveAttribute('href', /stack-inventory-logo\.png$/);
  await expect(page.getByRole('img', { name: 'Stack Inventory project logo', exact: true })).toHaveAttribute('src', /stack-inventory-logo\.png$/);

  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  }
  const resume = page.getByRole('link', { name: 'Resume', exact: true }).first();
  const response = await request.get((await resume.getAttribute('href'))!);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
  expect(createHash('sha256').update(await response.body()).digest('hex')).toBe('5708d87f4107469af7f7ddd8e6bbbf9dd96df5bcbdf968062f77ba261f487d6f');
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toMatch(/^https:\/\//);
  expect(errors).toEqual([]);
  for (const card of await page.locator('#projects article').all()) {
    await card.scrollIntoViewIfNeeded();
    await expect(card).toHaveCSS('opacity', '1');
  }
  await page.locator('#projects').screenshot({ path: test.info().outputPath('project-showcase.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });
  const sceneCard = page.locator('article[aria-labelledby="project-3d-portfolio"]');
  await sceneCard.scrollIntoViewIfNeeded();
  await expect(sceneCard).toHaveCSS('opacity', '1');
  const sceneImage = sceneCard.locator('img');
  await expect(sceneImage).toHaveAttribute('src', /3d-portfolio-scene\.png$/);
  await expect(sceneImage).toHaveCSS('object-fit', 'contain');
  const sceneFraming = await sceneImage.evaluate((image: HTMLImageElement) => ({
    naturalRatio: image.naturalWidth / image.naturalHeight,
    renderedRatio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
  }));
  expect(sceneFraming.naturalRatio).toBeCloseTo(1973 / 908, 3);
  expect(sceneFraming.renderedRatio).toBeCloseTo(sceneFraming.naturalRatio, 3);
  await sceneCard.screenshot({ path: test.info().outputPath('3d-scene-card.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });

  // Inspect the final card itself, not only its raw source image.
  const portfolioCard = page.locator('article[aria-labelledby="project-portfolio"]');
  await portfolioCard.scrollIntoViewIfNeeded();
  await expect(portfolioCard).toHaveCSS('opacity', '1');
  const portfolioImage = portfolioCard.locator('img');
  await expect(portfolioImage).toHaveAttribute('src', /portfolio-v2-hero-card\.png$/);
  await expect(portfolioImage).toHaveCSS('object-fit', 'contain');
  const framing = await portfolioImage.evaluate((image: HTMLImageElement) => ({
    naturalRatio: image.naturalWidth / image.naturalHeight,
    renderedRatio: image.getBoundingClientRect().width / image.getBoundingClientRect().height,
  }));
  expect(framing.naturalRatio).toBeCloseTo(16 / 10, 3);
  expect(framing.renderedRatio).toBeCloseTo(framing.naturalRatio, 3);
  await portfolioCard.screenshot({ path: test.info().outputPath('portfolio-card.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });

  if (test.info().project.name === 'desktop') {
    // Take a padded 16:10 detail of the actual hero card, inside its section.
    // This avoids adjacent headings, floating controls, and tiny text in the card.
    await page.setViewportSize({ width: 1280, height: 941 });
    await page.goto('./');
    await expect(page.locator('#home a').first().locator('..')).toHaveCSS('opacity', '1');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    const heroBounds = await page.locator('#home').boundingBox();
    const cardBounds = await page.locator('#home .rounded-2xl').boundingBox();
    expect(heroBounds).not.toBeNull();
    expect(cardBounds).not.toBeNull();
    const clip = {
      x: Math.round(cardBounds!.x + cardBounds!.width / 2 - 500),
      y: Math.round(cardBounds!.y + cardBounds!.height / 2 - 312.5),
      width: 1000,
      height: 625,
    };
    expect(clip.x).toBeGreaterThanOrEqual(heroBounds!.x);
    expect(clip.y).toBeGreaterThanOrEqual(heroBounds!.y);
    expect(clip.x + clip.width).toBeLessThanOrEqual(heroBounds!.x + heroBounds!.width);
    expect(clip.y + clip.height).toBeLessThanOrEqual(heroBounds!.y + heroBounds!.height);
    expect(cardBounds!.x - clip.x).toBeGreaterThan(40);
    expect(cardBounds!.y - clip.y).toBeGreaterThan(40);
    expect(clip.x + clip.width - cardBounds!.x - cardBounds!.width).toBeGreaterThan(40);
    expect(clip.y + clip.height - cardBounds!.y - cardBounds!.height).toBeGreaterThan(40);
    const thumbnail = await page.screenshot({
      path: test.info().outputPath('portfolio-thumbnail.png'),
      clip,
      scale: 'css',
      style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }',
    });
    expect(thumbnail.readUInt32BE(16)).toBe(1000);
    expect(thumbnail.readUInt32BE(20)).toBe(625);
  }

});

test('drawer supports dismissal, focus return, navigation and repeated opening', async ({ page }) => {
  await page.goto('./');
  const open = page.getByRole('button', { name: 'Open navigation menu', includeHidden: true });
  const dialog = page.getByRole('dialog', { name: 'Navigation menu' });
  await expect(dialog).not.toBeVisible();
  await open.click();
  await expect(dialog).toBeVisible();
  await expect(open).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
  await open.click();
  await expect(dialog.getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute('aria-current', 'location');
  await dialog.getByRole('button', { name: 'Close navigation menu' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Resume' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.getByRole('button', { name: 'Close navigation menu' })).toBeFocused();
  await dialog.getByRole('button', { name: 'Close navigation menu' }).click();
  await expect(dialog).not.toBeVisible();
  await page.reload();
  await expect(dialog).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});

test('narrow viewport does not overflow before or after menu use', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('./');
  const shortBio = page.locator('#about > div > p');
  await expect(shortBio).toHaveCSS('font-size', '18px');
  await expect(shortBio).toHaveCSS('overflow', 'visible');
  const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  await test.info().attach('viewport-diagnostics', {
    body: JSON.stringify(await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflowing: Array.from(document.querySelectorAll('*')).map(element => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName, className: element.className?.toString(), width: rect.width, right: rect.right };
      }).filter(rect => rect.right > document.documentElement.clientWidth + 1).slice(0, 20),
    }))), contentType: 'application/json',
  });
  await expect.poll(fits).toBe(true);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect.poll(fits).toBe(true);
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect.poll(fits).toBe(true);
  await page.locator('#contact form').scrollIntoViewIfNeeded();
  await expect.poll(fits).toBe(true);
  for (const field of await page.locator('#contact form, #contact input, #contact textarea').all()) {
    await expect.poll(() => field.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      return bounds.left >= 0 && bounds.right <= document.documentElement.clientWidth;
    })).toBe(true);
  }
});

test('unconfigured email and unavailable feeds have useful fallback states', async ({ page }) => {
  await page.goto('./');
  if (!process.env.TEST_EMAIL_CONFIG || process.env.TEST_EMAIL_CONFIG === 'none') {
    await expect(page.getByRole('button', { name: 'Form unavailable' })).toBeDisabled();
    await expect(page.getByText('email me directly', { exact: true })).toHaveAttribute('href', /^mailto:/);
  }
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toBeVisible();
  await expect(page.getByText('No articles are currently available for this category.')).toHaveCount(0);
});

test('a valid empty snapshot is distinct from a feed failure', async ({ page }) => {
  await page.route('**/news.json', route => route.fulfill({ json: emptySnapshot }));
  await page.goto('./');
  await expect(page.getByText('No articles are currently available for this category.')).toBeVisible();
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toHaveCount(0);
});

test('saved feed items load and unsafe article links are excluded', async ({ page }) => {
  await page.route('**/news.json', route => route.fulfill({ json: snapshot([article(), article('Unsafe article', 'javascript:alert(1)')]) }));
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Recent test article' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unsafe article' })).toHaveCount(0);
});

test('normal-motion navigation and backdrop dismissal stay usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const open = page.getByRole('button', { name: 'Open navigation menu' });
  const dialog = page.getByRole('dialog', { name: 'Navigation menu' });
  await open.click();
  await page.mouse.click(5, 200);
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole('link', { name: 'About & Experience' }).click();
  await expect(page).toHaveURL(/#about$/);
  await open.click();
  await expect(dialog.getByRole('link', { name: 'About & Experience' })).toHaveAttribute('aria-current', 'location');
  await page.keyboard.press('Escape');
  const sceneCard = page.locator('article[aria-labelledby="project-3d-portfolio"]');
  await sceneCard.scrollIntoViewIfNeeded();
  await sceneCard.hover();
  await expect(sceneCard.locator('img')).toHaveCSS('transform', 'none');
});


test('RSS loader, stale cache, refresh failure and category changes remain honest', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const old = new Date(Date.now() - 7 * 86400000).toISOString();
  let releaseSnapshot!: () => void;
  const gate = new Promise<void>(resolve => { releaseSnapshot = resolve; });
  await page.route('**/news.json', async route => {
    await gate;
    await route.fulfill({ json: { ...snapshot(), sources: [{ id: 'techcrunch', status: 'ok', fetchedAt: old }] } });
  });
  await page.goto('./');
  await expect(page.getByText('Loading the latest saved stories…')).toBeVisible();
  await expect(page.locator('.news-loader')).toHaveCSS('animation-name', 'news-spin');
  releaseSnapshot();
  await expect(page.getByRole('heading', { name: 'Recent test article' })).toBeVisible();
  await expect(page.getByText('Includes saved stories older than 24 hours', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Refresh sources', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Refresh sources', exact: true })).toBeEnabled();
  await expect(page.getByRole('heading', { name: 'Recent test article' })).toBeVisible();
  await expect(page.getByText('8 sources could not be updated.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'AI & ML', exact: true }).click();
  await expect(page.getByText('No articles are currently available for this category.')).toBeVisible();
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Recent test article' })).toBeVisible();
});

test('manual RSS refresh can recover without the snapshot and never uses unsafe links', async ({ page }) => {
  await page.route('**/news.json', route => route.fulfill({ contentType: 'application/json', body: 'not json' }));
  await page.route('https://api.allorigins.win/**', route => route.fulfill({ contentType: 'application/rss+xml', body: `<rss><channel><item><title>Live fixture story</title><link>https://www.nasa.gov/</link><pubDate>${new Date().toUTCString()}</pubDate></item><item><title>Unsafe fixture</title><link>javascript:alert(1)</link><pubDate>${new Date().toUTCString()}</pubDate></item></channel></rss>` }));
  await page.goto('./');
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Refresh sources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Live fixture story' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unsafe fixture' })).toHaveCount(0);
});

test('education accordions support repeated keyboard use with consistent timeline alignment', async ({ page }) => {
  await page.goto('./');
  const aboutHeading = page.getByRole('heading', { name: 'About Me', exact: true });
  await aboutHeading.scrollIntoViewIfNeeded();
  await expect(aboutHeading.locator('..')).toHaveCSS('opacity', '1');
  await expect(page.locator('#about')).not.toContainText('High School Diploma');
  await expect(page.locator('#about')).not.toContainText('aspiring');
  await expect(page.getByRole('heading', { name: 'Bachelor of Arts in Computer Science' })).toHaveCount(1);
  const details = page.locator('details').filter({ has: page.locator('summary', { hasText: 'Degree & coursework' }) });
  await details.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(details).toHaveAttribute('open', '');
  await expect(details).toContainText('GPA: 3.85');
  await expect(page.locator('#about')).not.toContainText('Academic recognition');
  await expect(page.locator('#about')).not.toContainText('I’m Seb');
  const bio = page.locator('#about > div > p');
  await expect(bio).toHaveText('Curiosity drives what I build, from practical tools to playful 3D experiences. I like turning ‘what if?’ into something you can try.');
  await expect(bio).toHaveCSS('font-size', '18px');
  if (test.info().project.name === 'desktop') expect(await bio.evaluate(node => node.getBoundingClientRect().height <= 2 * parseFloat(getComputedStyle(node).lineHeight) + 1)).toBe(true);
  await expect(bio).toHaveCSS('overflow', 'visible');
  await test.info().attach('about-line-count', { body: JSON.stringify(await bio.evaluate(node => ({ width: node.getBoundingClientRect().width, lines: Math.round(node.getBoundingClientRect().height / parseFloat(getComputedStyle(node).lineHeight)), fontSize: getComputedStyle(node).fontSize }))), contentType: 'application/json' });
  await page.keyboard.press('Space');
  await expect(details).not.toHaveAttribute('open');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open', '');
  for (const item of await page.locator('.timeline-item').all()) {
    const dot = await item.locator('.timeline-dot').boundingBox();
    const rail = await item.locator('..').boundingBox();
    expect(Math.abs(dot!.x + dot!.width / 2 - rail!.x - 1)).toBeLessThan(2);
  }
  await page.getByRole('heading', { name: 'Professional Experience' }).click();
  await page.locator('#about').screenshot({ path: test.info().outputPath('about-expanded.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });
  await details.locator('summary').click();
  await page.locator('#about').screenshot({ path: test.info().outputPath('about-collapsed.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });
});

test('hover effects avoid layout transitions and canvas pauses behind the menu or lower sections', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('data-running', 'true');
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await expect(canvas).toHaveAttribute('data-running', 'false');
  const link = page.getByRole('dialog').getByRole('link', { name: 'Projects', exact: true });
  await link.hover();
  const transition = await link.evaluate(element => getComputedStyle(element, '::before').transitionProperty);
  expect(transition).toBe('opacity');
  await page.keyboard.press('Escape');
  await expect(canvas).toHaveAttribute('data-running', 'true');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute('data-running', 'false');
  await page.locator('footer a').first().hover();
  const up = page.getByRole('button', { name: 'Scroll up' });
  await up.hover();
  await expect(up).toHaveCSS('transition-property', 'transform, background-color');
  const upBounds = await up.boundingBox();
  for (const element of await page.locator('footer a, footer .copyright').all()) {
    const bounds = await element.evaluate(node => {
      if (node.matches('.copyright')) {
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getBoundingClientRect().toJSON();
      }
      return node.getBoundingClientRect().toJSON();
    });
    const overlaps = bounds && upBounds && bounds.x < upBounds.x + upBounds.width && bounds.x + bounds.width > upBounds.x && bounds.y < upBounds.y + upBounds.height && bounds.y + bounds.height > upBounds.y;
    expect(overlaps, `Back-to-top must not cover footer links or text: ${JSON.stringify({ bounds, upBounds })}`).toBe(false);
  }
  await page.locator('footer').screenshot({ path: test.info().outputPath('footer-hover.png') });
  await up.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  await expect(canvas).toHaveAttribute('data-running', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.ScrollButton-button')).toHaveCount(0);
});

test('configured contact reports owner success, failure and optional reply failure without real email', async ({ page }) => {
  test.skip(!process.env.TEST_EMAIL_CONFIG || process.env.TEST_EMAIL_CONFIG === 'none', 'This build intentionally has no EmailJS configuration');
  const calls: { at: number; template: string; message?: string }[] = [];
  let ownerFailure = false;
  let replyFailure = false;
  await page.route('https://api.emailjs.com/**', async route => {
    const data = route.request().postDataJSON();
    calls.push({ at: Date.now(), template: data.template_id, message: data.template_params.message });
    const failure = data.template_id === 'test_owner' ? ownerFailure : replyFailure;
    await route.fulfill({ status: failure ? 500 : 200, contentType: 'text/plain', body: failure ? 'Unavailable' : 'OK' });
  });
  await page.goto('./');
  const submit = page.getByRole('button', { name: 'Send Message', exact: true });
  await expect(submit).toBeEnabled();
  const fill = async () => {
    await page.getByLabel('Name', { exact: true }).fill('Browser test');
    await page.getByLabel('Email', { exact: true }).fill('browser-test@example.invalid');
    await page.getByLabel('Message', { exact: true }).fill('Intercepted fixture. Never sent.');
  };
  await fill();
  await submit.click();
  await expect(page.getByText('Thank you! Your message has been sent successfully.')).toBeVisible();
  const expected = process.env.TEST_EMAIL_CONFIG === 'auto' ? 2 : 1;
  expect(calls).toHaveLength(expected);
  if (expected === 2) expect(calls[1].at - calls[0].at).toBeGreaterThanOrEqual(1000);
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue('');
  ownerFailure = true;
  await fill(); await submit.click();
  await expect(page.getByText('Your message could not be sent.', { exact: false })).toBeVisible();
  expect(calls).toHaveLength(expected + 1);
  await expect(page.getByLabel('Message', { exact: true })).not.toHaveValue('');
  if (expected === 2) {
    ownerFailure = false; replyFailure = true;
    await submit.click();
    await expect(page.getByText('Your message was sent, but the confirmation email could not be delivered.')).toBeVisible();
    expect(calls).toHaveLength(expected + 3);
  }
});


test('build snapshot health is inspectable and news layout is captured', async ({ page, request }) => {
  const response = await request.get('./news.json');
  expect(response.ok()).toBe(true);
  const saved = await response.json();
  expect(Array.isArray(saved.sources)).toBe(true);
  await test.info().attach('built-feed-health', { body: JSON.stringify({ generatedAt: saved.generatedAt, sources: saved.sources, articleCount: saved.articles.length }), contentType: 'application/json' });
  // Browser fixtures above are deterministic; this is the separately identified
  // real build result, so a live-provider outage cannot masquerade as mock success.
  if (process.env.CI) {
    const freshSources = saved.sources.filter((source: { id: string; status: string; fetchedAt: string }) => source.status === 'ok' && source.fetchedAt === saved.generatedAt).map((source: { id: string }) => source.id);
    expect(saved.articles.some((article: { source: { id: string } }) => freshSources.includes(article.source.id)), 'At least one real article must come from a successful source in this CI build').toBe(true);
  }
  await page.route('**/news.json', route => route.fulfill({ json: saved }));
  await page.goto('./');
  await expect(page.getByText('Loading the latest saved stories…')).toHaveCount(0);
  const newsHeading = page.getByRole('heading', { name: 'My Interests & Latest News' });
  await newsHeading.scrollIntoViewIfNeeded();
  await expect(newsHeading.locator('..')).toHaveCSS('opacity', '1');
  await page.locator('#news').screenshot({ path: test.info().outputPath('news-built-snapshot.png'), style: '.nav-toggle-btn, .scroll-button, .skip-link { visibility: hidden !important; }' });
});


test('stalled snapshot times out and manual refresh can parse namespaced feeds', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(AbortSignal, 'any', { value: undefined }); Object.defineProperty(AbortSignal, 'timeout', { value: undefined }); });
  await page.route('**/news.json', () => { /* intentionally never responds */ });
  await page.route('https://api.allorigins.win/**', route => route.fulfill({ contentType: 'application/rss+xml', body: `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/"><item><title>Namespaced RSS story</title><link>https://www.nasa.gov/</link><dc:date>${new Date().toISOString()}</dc:date></item></rdf:RDF>` }));
  await page.goto('./');
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Refresh sources', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Namespaced RSS story' })).toBeVisible();
});

test('contact rejects invalid fields while preserving code as message data', async ({ page }) => {
  test.skip(!process.env.TEST_EMAIL_CONFIG || process.env.TEST_EMAIL_CONFIG === 'none', 'This build intentionally has no EmailJS configuration');
  const ownerMessages: Record<string, string>[] = [];
  await page.route('https://api.emailjs.com/**', async route => {
    const data = route.request().postDataJSON();
    if (data.template_id === 'test_owner') ownerMessages.push(data.template_params);
    await route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' });
  });
  await page.goto('./');
  await expect(page.getByLabel('Name', { exact: true })).toHaveAttribute('maxlength', '100');
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('maxlength', '254');
  await expect(page.getByLabel('Message', { exact: true })).toHaveAttribute('maxlength', '5000');
  const fill = async (name: string, message: string) => {
    await page.getByLabel('Name', { exact: true }).fill(name);
    await page.getByLabel('Email', { exact: true }).fill('browser-test@example.invalid');
    await page.getByLabel('Message', { exact: true }).fill(message);
  };
  await fill('   ', 'Hello');
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.getByText('Please enter your name.', { exact: true })).toBeVisible();
  await fill('Visitor', 'Hello');
  await page.getByLabel('Message', { exact: true }).evaluate((node: HTMLTextAreaElement) => { node.value = 'x'.repeat(5001); });
  await page.locator('#contact form').dispatchEvent('submit');
  await expect(page.getByText('Keep your message to 5,000 characters or fewer.')).toBeVisible();
  await fill('Visitor', 'Hello');
  await page.getByLabel('Name', { exact: true }).evaluate((node: HTMLInputElement) => { node.value = 'Visitor\u0001Bcc:other@example.invalid'; });
  await page.locator('#contact form').dispatchEvent('submit');
  await expect(page.getByText('Name and email cannot contain line breaks or control characters.')).toBeVisible();
  expect(ownerMessages).toHaveLength(0);
  const code = '<script>window.contactScriptExecuted = true</script>\nconst comparison = a < b;';
  await fill('  Visitor  ', `  ${code}\n`);
  await page.getByRole('button', { name: 'Send Message', exact: true }).click();
  await expect(page.getByText('Thank you! Your message has been sent successfully.')).toBeVisible();
  expect(ownerMessages).toHaveLength(1);
  expect(ownerMessages[0]).toMatchObject({ name: 'Visitor', from_name: 'Visitor', from_email: 'browser-test@example.invalid', message: code });
  expect(await page.evaluate(() => Object.hasOwn(window, 'contactScriptExecuted'))).toBe(false);
});

test('navigation, card actions, social and contact links have valid destinations', async ({ page, request }) => {
  await page.goto('./');
  const localLinks = new Set<string>();
  for (const link of await page.locator('a[href]').all()) {
    const href = (await link.getAttribute('href'))!;
    if (href.startsWith('#')) {
      await expect(page.locator(`[id="${href.slice(1)}"]`)).toHaveCount(1);
    } else if (href.startsWith('/')) {
      localLinks.add(href);
    } else if (href.startsWith('mailto:')) {
      expect(href).toBe('mailto:sebas.t.nait@gmail.com');
    } else if (href.startsWith('tel:')) {
      expect(href).toBe('tel:+19543047962');
    } else {
      const url = new URL(href);
      expect(url.protocol).toBe('https:');
      expect(url.username + url.password).toBe('');
    }
    if (await link.getAttribute('target') === '_blank') {
      expect(await link.getAttribute('rel')).toContain('noopener');
      expect(await link.getAttribute('rel')).toContain('noreferrer');
    }
  }
  for (const href of localLinks) expect((await request.get(href)).ok(), href).toBe(true);
  for (const action of await page.locator('#projects a').all()) await expect(action).toHaveAccessibleName(/.+/);
  await expect(page.locator('#contact a[href^="tel:"]')).toHaveText('+1 (954) 304-7962');
  const social = { GitHub: 'https://github.com/Sebas-D-Dev', LinkedIn: 'https://www.linkedin.com/in/sebastian-torres-cs/', Discord: 'https://discord.com/users/1373891287392194620/', Instagram: 'https://www.instagram.com/xsea_bassx/' };
  for (const [label, href] of Object.entries(social)) await expect(page.locator('footer').getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  for (const [label, id] of [['Home', 'home'], ['Projects', 'projects'], ['About & Experience', 'about'], ['News', 'news'], ['Contact', 'contact']]) {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});


test('RSS numeric entities display as text without creating executable elements', async ({ page }) => {
  const encoded = article('India&#8217;s code &amp; news');
  encoded.description = 'Please don&#39;t name it ParaMax.';
  const markup = article('Code: &#60;img src=x onerror=window.rssEntityExecuted=true&#62;', 'https://www.nasa.gov/entity-test/');
  await page.route('**/news.json', route => route.fulfill({ json: snapshot([encoded, markup]) }));
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'India’s code & news', exact: true })).toBeVisible();
  await expect(page.getByText("Please don't name it ParaMax.", { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Code: <img src=x onerror=window.rssEntityExecuted=true>', exact: true })).toBeVisible();
  await expect(page.locator('#news img')).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, 'rssEntityExecuted'))).toBe(false);
});
