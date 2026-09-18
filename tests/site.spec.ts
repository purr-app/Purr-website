import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage semantics, assets, accessible tabs and local links', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('API work, with lessUI in the way.');
  await expect(page.locator('img:not([alt])')).toHaveCount(0);
  await expect(page.locator('img[alt=""]')).toHaveCount(0);
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
  await expect(page.locator('#focus [role="tab"]')).toHaveCount(3);
  await expect(page.locator('#focus img')).toHaveCount(3);
  await expect(page.locator('#layouts [role="tab"]')).toHaveCount(0);
  await expect(page.locator('#layouts .layout-comparison img')).toHaveCount(3);
  const layoutY = await page
    .locator('.layout-comparison article')
    .evaluateAll((nodes) => nodes.map((n) => Math.round(n.getBoundingClientRect().top)));
  expect(new Set(layoutY).size).toBe(1);
  await expect(page.locator('#main-nav .nav-download')).toHaveText('Download');
  await expect(page.locator('a[href="/github/"]')).toHaveCount(0);
  await expect(page.locator('#main-nav a[href*="github.com/"]')).toHaveCount(1);
  expect(
    await page
      .locator('main > section')
      .evaluateAll(
        (nodes) =>
          nodes.findIndex((n) => n.id === 'graphql') < nodes.findIndex((n) => n.id === 'http'),
      ),
  ).toBe(true);
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
    await expect(page.locator('main')).toHaveCSS('opacity', '1');
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      audit.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
      `${route}: ${JSON.stringify(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
  }
});

test('mobile menu, documentation and overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  const mobileAudit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(
    mobileAudit.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
  ).toEqual([]);
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
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const videos: string[] = [];
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) videos.push(r.url());
  });
  await page.goto('/');
  await page.locator('#features').scrollIntoViewIfNeeded();
  await expect(page.locator('video[src]')).toHaveCount(0);
  expect(videos).toHaveLength(0);
  await page
    .locator('.hero-video')
    .evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
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
  await expect(page.locator('.docs-notice')).toContainText('Still in progress');
  for (const a of await page.locator('.docs-toc a').all()) {
    const href = await a.getAttribute('href');
    await expect(page.locator(href!)).toHaveCount(1);
  }
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://usepurr.com/',
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://usepurr.com/',
  );
  const data = JSON.parse(await page.locator('script[type="application/ld+json"]').innerText());
  expect(data['@type']).toBe('SoftwareApplication');
  expect(data.operatingSystem).toBe('macOS');
  expect(data.url).toBe('https://usepurr.com/');
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap: https://usepurr.com/sitemap-index.xml');
  await page.goto('/download/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.goto('/changelog/');
  await expect(page.getByText('Example release')).toHaveCount(0);
  await expect(page.getByText('v0.4.0')).toHaveCount(0);
  for (const path of [
    '/robots.txt',
    '/sitemap-index.xml',
    '/purr.svg',
    '/og.png',
    '/site.webmanifest',
    '/third-party-licenses.txt',
  ])
    expect((await request.get(path)).ok(), path).toBeTruthy();
});

test('demos play once, hold the final frame, and replay only on request', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  await expect(page.locator('video')).toHaveCount(3);
  await expect(page.locator('video[loop]')).toHaveCount(0);
  for (const selector of ['.hero-video', '#features .video-frame', '#filtering .video-frame']) {
    const frame = page.locator(selector);
    await frame.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const video = frame.locator('video');
    await expect
      .poll(() => video.evaluate((el) => (el as HTMLVideoElement).readyState))
      .toBeGreaterThan(1);
    await video.evaluate((el) => {
      const v = el as HTMLVideoElement;
      v.currentTime = v.duration - 0.1;
    });
    await expect(frame.locator('button')).toHaveText('Replay demo ↻');
    await page.locator('footer').evaluate((el) => el.scrollIntoView({ behavior: 'instant' }));
    await frame.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    expect(await video.evaluate((el) => (el as HTMLVideoElement).ended)).toBe(true);
    await expect(frame.locator('button')).toHaveText('Replay demo ↻');
    await frame.locator('button').click();
    await expect(frame.locator('button')).toHaveText('Pause demo Ⅱ');
    await frame.locator('button').click();
  }
});

test('mobile layout comparison scrolls and reduced motion disables the entrance', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('main').evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
  const comparison = page.locator('.layout-comparison');
  await comparison.scrollIntoViewIfNeeded();
  expect(await comparison.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await comparison.focus();
  await page.keyboard.press('End');
  await comparison.evaluate((el) => (el.scrollLeft = el.scrollWidth));
  expect(await comparison.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  expect((await request.get('/github/')).status()).toBe(404);
  await page.goto('/docs/');
  await expect(page.locator('.docs-notice')).toContainText('Still in progress');
});

test('previews rotate calmly only in view and stop after manual interaction', async ({ page }) => {
  test.setTimeout(45000);
  await page.goto('/');
  for (const id of ['focus', 'graphql']) {
    const group = page.locator(`#${id} [data-showcase]`);
    await group.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(150);
    const tabs = group.getByRole('tab');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.waitForTimeout(4500);
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await page.waitForTimeout(1100);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await page.locator('footer').evaluate((el) => el.scrollIntoView());
    await page.waitForTimeout(150);
    await page.waitForTimeout(5800);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(2).click();
    await page.waitForTimeout(5800);
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(2).press('Home');
    await expect(tabs.nth(0)).toBeFocused();
  }
});

test('video playback requires 80% visibility and pauses below it', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/');
  const video = page.locator('#filtering video');
  const position = async (ratio: number) => {
    await video.evaluate((el, fraction) => {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, scrollY + r.top - (innerHeight - r.height * fraction));
    }, ratio);
  };
  await position(0.75);
  await page.waitForTimeout(250);
  await expect(video).not.toHaveAttribute('src');
  await position(0.85);
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(false);
  await position(0.75);
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(true);
  await position(0.85);
  await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).paused)).toBe(false);
});

test('hero scale is clamped, layout-stable, and disabled with reduced motion', async ({ page }) => {
  await page.goto('/');
  const media = page.locator('.hero-video');
  const height = await page.locator('.hero-product').evaluate((el) => el.clientHeight);
  await page.locator('#features').evaluate((el) => el.scrollIntoView());
  await expect
    .poll(() => media.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a))
    .toBeCloseTo(1.1, 2);
  expect(await page.locator('.hero-product').evaluate((el) => el.clientHeight)).toBe(height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(media).toHaveCSS('transform', 'none');
  await page.locator('#focus').scrollIntoViewIfNeeded();
  await expect(page.locator('#focus .showcase-rotation')).toBeHidden();
  await page.waitForTimeout(5700);
  await expect(page.locator('#focus [role="tab"]').first()).toHaveAttribute(
    'aria-selected',
    'true',
  );
});
