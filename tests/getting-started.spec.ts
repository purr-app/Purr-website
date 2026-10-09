import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('getting started has working steps, optimized media, and contextual next pages', async ({
  page,
  request,
  context,
}) => {
  await page.goto('/docs/getting-started/');
  await expect(page.locator('h1')).toHaveText('Getting started');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy URL', exact: true }).click();
  await expect(page.locator('[data-copy-value]')).toHaveText('Copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'https://jsonplaceholder.typicode.com/posts/1',
  );
  await expect(page.locator('.docs-notice')).toHaveCount(0);
  await expect(page.locator('.docs-pager .next')).toContainText('Workspaces and environments');
  await expect(page.locator('.docs-screenshot img')).toHaveCount(5);
  for (const link of await page.locator('.docs-toc a').all()) {
    await expect(page.locator((await link.getAttribute('href'))!)).toHaveCount(1);
  }
  for (const image of await page.locator('.docs-screenshot img').all()) {
    const source = (await image.getAttribute('src'))!;
    expect(source).toContain('.webp');
    expect((await request.get(source)).ok()).toBe(true);
    await expect(image).toHaveAttribute('alt', /.+/);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
    const density = await image.evaluate((el) => {
      const img = el as HTMLImageElement;
      return img.naturalWidth / img.getBoundingClientRect().width;
    });
    expect(density).toBeGreaterThanOrEqual(2);
    await expect(image.locator('..')).toHaveAttribute('href', source);
  }
  for (const route of [
    '/docs/workspaces-and-environments/',
    '/docs/requests/',
    '/docs/responses/',
  ]) {
    expect((await request.get(route)).ok(), route).toBe(true);
  }
  await expect(page.locator('main')).toHaveCSS('opacity', '1');
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
});

test('left documentation groups collapse and the right outline tracks the active heading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/getting-started/');
  const toc = page.locator('.docs-toc');
  const group = page
    .locator('.docs-sidebar .docs-nav-group')
    .filter({ hasText: 'Requests and responses' });
  const toggle = group.locator('summary');
  await expect(toc.locator('a').first()).toHaveCSS('font-size', '14px');
  await toggle.focus();
  await toggle.press('Space');
  await expect(group).not.toHaveAttribute('open');
  await expect(group.getByRole('link', { name: 'HTTP requests', exact: true })).toBeHidden();
  await toggle.press('Space');
  await expect(group).toHaveAttribute('open');
  await expect(toc.locator('button, details')).toHaveCount(0);
  const target = toc.getByRole('link', { name: 'Enter the URL', exact: true });
  await target.click();
  await expect(target).toHaveAttribute('aria-current', 'location');
  await page.locator('#read-the-response').evaluate((heading) => heading.scrollIntoView());
  await expect(toc.getByRole('link', { name: 'Read the response', exact: true })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await expect(toc.locator('[aria-current="location"]')).toHaveCount(1);
  await page.screenshot({ path: '/tmp/purr-docs-outline-desktop.png' });
});

test('documentation videos wait for play, use 16:10, and finish without looping', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const requested: string[] = [];
  page.on('request', (request) => {
    if (request.url().endsWith('.mp4')) requested.push(request.url());
  });
  await page.goto('/docs/getting-started/');
  const videos = page.locator('.docs-demo video');
  await expect(videos).toHaveCount(2);
  expect(requested).toEqual([]);
  for (const [index, duration] of [5, 3].entries()) {
    const video = videos.nth(index);
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('controls', '');
    await expect(video).not.toHaveAttribute('autoplay');
    await expect(video).not.toHaveAttribute('loop');
    await video.evaluate((el) => (el as HTMLVideoElement).play());
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).videoWidth)).toBe(1600);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).videoHeight)).toBe(1000);
    expect(await video.evaluate((el) => (el as HTMLVideoElement).duration)).toBeCloseTo(
      duration,
      1,
    );
    await video.evaluate((el) => {
      const v = el as HTMLVideoElement;
      v.currentTime = v.duration - 0.1;
    });
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).ended)).toBe(true);
  }
});

test('getting started remains readable on mobile without horizontal page overflow', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/getting-started/');
  await expect(page.locator('.docs-mobile-nav')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const media of await page.locator('.docs-media').all()) {
    expect(await media.evaluate((el) => el.getBoundingClientRect().width)).toBeLessThan(391);
  }
  await page.locator('.docs-mobile-nav > summary').click();
  await page
    .locator('.docs-mobile-nav')
    .getByRole('link', { name: 'Responses', exact: true })
    .click();
  await expect(page.locator('h1')).toHaveText('Responses');
});
