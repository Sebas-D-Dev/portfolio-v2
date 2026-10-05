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
  await expect(page.getByRole('heading', { name: 'Personal Projects' })).toBeVisible();
  await expect(page.locator('#projects article')).toHaveCount(5);
  await expect(page.locator('#project-caverna')).toHaveText('Caverna D Sebas');
  await expect(page.locator('#projects')).toContainText('Early prototype');
  await expect(page.locator('#projects')).toContainText('Not an app screenshot');
  await expect(page.locator('#projects button[disabled]')).toHaveCount(0);
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
  for (const card of await page.locator('#projects article').all()) await card.scrollIntoViewIfNeeded();
  await page.locator('#projects').screenshot({ path: test.info().outputPath('project-showcase.png') });
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
  const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  await expect.poll(fits).toBe(true);
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect.poll(fits).toBe(true);
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect.poll(fits).toBe(true);
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
});
