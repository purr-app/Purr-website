import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('task groups persist and breadcrumbs, feedback and pagination follow the page', async ({
  page,
}) => {
  await page.goto('/docs/getting-started/');
  await expect(page.locator('.docs-sidebar summary')).toHaveText([
    'Getting started',
    'Requests',
    'Workflows',
    'Debugging',
    'Security',
  ]);
  const group = page.locator('.docs-sidebar [data-docs-group="requests"]');
  await group.locator('summary').click();
  await expect(group).not.toHaveAttribute('open');
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem('purr-docs-navigation') || '{}').requests,
      ),
    )
    .toBe(false);
  await page.reload();
  await expect(group).not.toHaveAttribute('open');
  await page.locator('.docs-pager .next').click();
  await expect(group).not.toHaveAttribute('open');
  await expect(page.locator('.docs-breadcrumbs')).toContainText('Workspaces and environments');
  await expect(page.locator('.docs-feedback a').first()).toHaveAttribute(
    'href',
    'https://github.com/purr-app/Purr-website/edit/main/src/content/docs/workspaces-and-environments.mdx',
  );
  await expect(page.getByRole('link', { name: 'Report an issue' })).toHaveAttribute(
    'href',
    /Purr-website\/issues\/new\?/,
  );
  await expect(page.locator('.docs-pager .next')).toContainText('HTTP requests');
  await expect(page.locator('.docs-toc a[data-depth="4"]')).toHaveCount(0);
  const depths = await page
    .locator('.docs-toc a')
    .evaluateAll((links) => links.map((link) => link.getAttribute('data-depth')));
  let children = 0;
  for (const depth of depths) {
    if (depth === '2') children = 0;
    else expect(++children).toBeLessThanOrEqual(2);
  }
});

test('search loads on demand, supports the keyboard and finds documentation content', async ({
  page,
}) => {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('search-index.json')) requests.push(request.url());
  });
  await page.goto('/docs/');
  expect(requests).toEqual([]);
  await page.getByRole('button', { name: 'Search docs' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('Postman');
  await expect(dialog.getByRole('link', { name: /Workspaces and environments/ })).toBeVisible();
  await expect(dialog.getByRole('status')).toContainText('result');
  await page.screenshot({ path: '/tmp/purr-docs-search.png' });
  expect(requests).toHaveLength(1);
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await dialog.getByRole('searchbox').press('ArrowDown');
  await expect(dialog.locator('a').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/workspaces-and-environments\//);
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('zzzzzznomatch');
  await expect(dialog.getByRole('status')).toContainText('No results');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('mobile drawer traps focus and the collapsible outline navigates to a section', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/getting-started/');
  const trigger = page.locator('[data-open-drawer]');
  await page.screenshot({ path: '/tmp/purr-docs-mobile-top.png' });
  await trigger.click();
  const drawer = page.getByRole('dialog', { name: 'Documentation', exact: true });
  await expect(drawer).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.screenshot({ path: '/tmp/purr-docs-mobile-drawer.png' });
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page.keyboard.press('Shift+Tab');
  expect(
    await page.evaluate(() =>
      document.querySelector('#docs-drawer')!.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.locator('.docs-toc-mobile summary').click();
  await page
    .locator('.docs-toc-mobile')
    .getByRole('link', { name: 'Read the response', exact: true })
    .click();
  await expect(page.locator('.docs-toc-mobile')).not.toHaveAttribute('open');
  await expect(page.locator('.docs-toc-mobile [aria-current="location"]')).toHaveText(
    'Read the response',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.screenshot({ path: '/tmp/purr-docs-mobile-navigation.png' });
});
