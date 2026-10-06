import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // No real email or third-party feed requests during tests.
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
  await expect(page.getByRole('button', { name: 'Form unavailable' })).toBeDisabled();
  await expect(page.getByText('email me directly', { exact: true })).toHaveAttribute('href', /^mailto:/);
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toBeVisible();
  await expect(page.getByText('No recent articles found for this category.')).toHaveCount(0);
});

test('a valid empty feed is distinct from a feed failure', async ({ page }) => {
  await page.route('https://api.allorigins.win/**', route => route.fulfill({
    contentType: 'application/rss+xml', body: '<rss version="2.0"><channel><title>Test feed</title></channel></rss>',
  }));
  await page.goto('./');
  await expect(page.getByText('No recent articles found for this category.')).toBeVisible();
  await expect(page.getByText('News feeds are temporarily unavailable.', { exact: false })).toHaveCount(0);
});

test('recent feed items load and unsafe article links are excluded', async ({ page }) => {
  await page.route('https://api.allorigins.win/**', route => route.fulfill({
    contentType: 'application/rss+xml',
    body: `<rss version="2.0"><channel><title>Test feed</title><item><title>Recent test article</title><link>https://www.nasa.gov/</link><pubDate>${new Date().toUTCString()}</pubDate><description>A source-backed test article.</description></item><item><title>Unsafe article</title><link>javascript:alert(1)</link><pubDate>${new Date().toUTCString()}</pubDate></item></channel></rss>`,
  }));
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Recent test article' }).first()).toBeVisible();
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
