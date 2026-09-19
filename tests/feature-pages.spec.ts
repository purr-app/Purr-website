import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const route of ['tracing', 'graphql-client', 'local-first-api-client']) {
  test(`${route}: SEO, responsive layout and accessibility`, async ({ page, request }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${route}/`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://usepurr.com/${route}/`,
    );
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\w{3}/);
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(
      schema.some((s) =>
        JSON.parse(s)['@graph']?.some((n: { '@type': string }) => n['@type'] === 'BreadcrumbList'),
      ),
    ).toBe(true);
    expect(await (await request.get('/sitemap-0.xml')).text()).toContain(
      `https://usepurr.com/${route}/`,
    );
    const links = await page
      .locator('main a[href^="/"]')
      .evaluateAll((nodes) => [...new Set(nodes.map((n) => (n as HTMLAnchorElement).pathname))]);
    for (const link of links) expect((await request.get(link)).status(), link).toBe(200);
    await page.locator('img').evaluateAll(async (images) => {
      await Promise.all(
        images.map(async (image) => {
          if (!(image instanceof HTMLImageElement)) return;
          image.loading = 'eager';
          await image.decode();
        }),
      );
    });
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
      const audit = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(audit.violations).toEqual([]);
      if (width !== 320)
        await page.screenshot({ path: `/tmp/purr-${route}-${width}.png`, fullPage: true });
    }
  });
}

test('feature discovery and GraphQL keyboard tabs', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="/tracing/"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="/graphql-client/"]')).not.toHaveCount(0);
  await expect(page.locator('a[href="/local-first-api-client/"]')).not.toHaveCount(0);
  await page.goto('/graphql-client/');
  await page.getByRole('tab', { name: 'Variables' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Typed variables');
  await page.getByRole('tab', { name: 'Variables' }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Schema' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Schema' })).toHaveAttribute('aria-selected', 'true');
});
