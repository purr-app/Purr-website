# Verification

Verified locally on September 18, 2026.

- `npm run build`: passes; 15 static HTML pages plus robots.txt and sitemap. Astro check reports zero errors, warnings, or hints.
- `npm test`: all 5 Playwright test groups pass against the production build.
- Automated axe checks: no WCAG A/AA violations on the home, Docs overview, HTTP guide, Changelog, Privacy, or Download pages. The mobile homepage is checked separately, including focusable screenshot scroll regions.
- Keyboard behavior: GraphQL / Focus / Layout tabs support Left, Right, Home, End, and roving tab focus. Mobile navigation opens, closes on Escape, and returns focus to its trigger.
- Reduced motion: neither video downloads automatically; explicit play and pause still work.
- Layout: no document-level horizontal overflow at 320, 375, 390, 768, 1024, or 1440 pixels. Screenshot frames intentionally scroll at smaller sizes.
- Visual review: desktop landing page, mobile hero and feature sections, GraphQL states, Focus Mode crops, request timeline, variables, and Docs layout inspected in Chromium screenshots. Original product UI is preserved.
- SEO configuration: an isolated test build with `PUBLIC_SITE_URL=https://purr.test` confirms correct canonical URLs, absolute sitemap URLs, indexable Docs / Changelog, and robots.txt discovery. This test domain is not used by the delivered build.
- Draft changelog entries are excluded. No fictitious version or release date appears on the site.
- All landing-page internal destinations resolve. Documentation table-of-contents anchors resolve.

## Local Lighthouse measurement

Mobile simulation against the production preview, after mobile video optimization:

| Metric                   | Result    |
| ------------------------ | --------- |
| Performance              | 99 / 100  |
| Accessibility            | 100 / 100 |
| First contentful paint   | 1.1 s     |
| Largest contentful paint | 2.3 s     |
| Total blocking time      | 0 ms      |
| Cumulative layout shift  | 0         |

These are local lab results, not production field measurements. The unconfigured preview intentionally blocks indexing; its SEO score is therefore not a production SEO result. Lighthouse also flags the differing desktop/mobile intrinsic dimensions of one **hidden** picture tab; the visible source uses explicit source dimensions and was visually checked for correct proportions.

The complete homepage has roughly 2.7 KB of inline JavaScript, including metadata. Fonts, images, and videos are hosted locally. Hero and tracing desktop videos total approximately 734 KB; their mobile variants total approximately 238 KB.

## Required launch inputs

The implementation is complete; publication still needs the owner's real domain, macOS download, GitHub repository, license URL, and full app privacy notice. These were not in the supplied assets or copy. Until supplied, local holding pages explain their status, the release timeline has no fabricated entries, and indexing stays disabled for the reserved example domain.

OpenAPI/cURL and encryption use labeled conceptual diagrams because corresponding product screenshots were not supplied. Real captures can replace these without changing the surrounding layout.
