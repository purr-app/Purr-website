import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage semantics, assets, accessible tabs and local links', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('API work, with lessUI in the way.');
  const graphql = page.locator('#graphql');
  await graphql.getByRole('tab', { name: 'Variables' }).click();
  await expect(graphql.getByRole('tabpanel')).toContainText('Structured variables.');
  await graphql.getByRole('tab', { name: 'Variables' }).press('ArrowRight');
  await expect(graphql.getByRole('tab', { name: 'Schema' })).toBeFocused();
  await expect(graphql.getByRole('tabpanel')).toContainText('Explore the schema');
  await graphql.getByRole('tab', { name: 'Schema' }).press('End');
  await expect(graphql.getByRole('tab', { name: 'Autocomplete' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  for (const group of ['focus', 'layouts']) {
    const section = page.locator(`#${group}`);
    for (const tab of await section.getByRole('tab').all()) {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  }
  const routes = await page
    .locator('a[href^="/"]')
    .evaluateAll((as) =>
      [...new Set(as.map((a) => (a as HTMLAnchorElement).pathname))].filter(
        (p) => !p.startsWith('/_astro/'),
      ),
    );
  for (const route of routes) expect((await request.get(route)).status(), route).toBe(200);
  expect(errors).toEqual([]);
});

test('WCAG AA automated checks on principal routes', async ({ page }) => {
  for (const route of [
    '/',
    '/docs/',
    '/docs/requests/',
    '/changelog/',
    '/privacy/',
    '/download/',
  ]) {
    await page.goto(route);
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      audit.violations,
      `${route}: ${JSON.stringify(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

test('mobile menu, documentation and overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const mobileAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(mobileAudit.violations).toEqual([]);
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await page.locator('#main-nav').getByRole('link', { name: 'Docs', exact: true }).click();
  await page.locator('.docs-mobile-nav summary').click();
  await page
    .locator('.docs-mobile-nav')
    .getByRole('link', { name: 'GraphQL', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('GraphQL');
  await expect(page.locator('.docs-pager .next')).toContainText('Dynamic variables');
  for (const route of ['/', '/docs/', '/changelog/']) {
    await page.goto(route);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route,
    ).toBeTruthy();
  }
});

test('reduced motion prevents video downloads until explicitly played', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const videos: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) videos.push(r.url());
  });
  await page.goto('/');
  await page.locator('#features').scrollIntoViewIfNeeded();
  await expect(page.locator('video[src]')).toHaveCount(0);
  expect(videos).toHaveLength(0);
  await page.locator('.hero-video .video-toggle').click();
  await expect(page.locator('.hero-video video')).toHaveAttribute('src', '/media/hero.mp4');
  await expect(page.locator('.hero-video .video-toggle')).toHaveText('Pause demo Ⅱ');
  await page.locator('.hero-video .video-toggle').click();
  await expect(page.locator('.hero-video .video-toggle')).toHaveText('Play demo ▶');
});

test('docs anchors, structured data, changelog draft exclusion and machine-readable endpoints', async ({
  page,
  request,
}) => {
  await page.goto('/docs/requests/');
  for (const a of await page.locator('.docs-toc a').all()) {
    const href = await a.getAttribute('href');
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await page.goto('/');
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(data['@type']).toBe('SoftwareApplication');
  expect(data.operatingSystem).toBe('macOS');
  await page.goto('/changelog/');
  await expect(page.getByText('Example release')).toHaveCount(0);
  await expect(page.getByText('v0.4.0')).toHaveCount(0);
  for (const path of [
    '/robots.txt',
    '/sitemap-index.xml',
    '/purr.svg',
    '/og.png',
    '/site.webmanifest',
  ])
    expect((await request.get(path)).ok(), path).toBeTruthy();
});
