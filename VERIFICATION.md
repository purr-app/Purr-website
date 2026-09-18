# Verification

Verified locally on September 18, 2026.

- `npm run build`: passes; 14 static HTML pages plus robots.txt and sitemap. Astro check reports zero errors, warnings, or hints.
- `npm test`: all 7 Playwright test groups pass against the production build.
- Automated axe checks: no WCAG A/AA violations on the home, Docs overview, HTTP guide, Changelog, Privacy, or Download pages. The mobile homepage is checked separately, including focusable screenshot scroll regions.
- Keyboard behavior: GraphQL tabs support Left, Right, Home, End, and roving tab focus. Focus Mode uses a static preview. Layouts use three side-by-side screenshots and a focusable native scroll strip on mobile. Mobile navigation opens, closes on Escape, and returns focus to its trigger.
- Reduced motion: none of the three videos downloads automatically; explicit play and pause still work.
- Layout: no document-level horizontal overflow at 320, 375, 390, 768, 1024, or 1440 pixels. Screenshot frames intentionally scroll at smaller sizes.
- Visual review: desktop landing page, mobile hero and feature sections, GraphQL states, Focus Mode crops, request timeline, variables, and Docs layout inspected in Chromium screenshots. Original product UI is preserved.
- SEO configuration: an isolated test build with `PUBLIC_SITE_URL=https://purr.test` confirms correct canonical URLs, absolute sitemap URLs, indexable Docs / Changelog, and robots.txt discovery. This test domain is not used by the delivered build.
- Draft changelog entries are excluded. No fictitious version or release date appears on the site.
- All landing-page internal destinations resolve. Documentation table-of-contents anchors resolve.

## Initial launch-build Lighthouse measurement (before the polish pass)

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

The complete homepage has roughly 2.7 KB of inline JavaScript, including metadata. Fonts, images, and videos are hosted locally. The three desktop videos total approximately 1,055 KB; their mobile variants total approximately 331 KB. Videos are lazy-loaded, play once, and retain the final frame.

## Required launch inputs

The implementation is complete; publication still needs the owner's real domain, macOS download, license URL, and full app privacy notice. GitHub links use the local Purr origin (`https://github.com/purr-app/Purr`); anonymous access returned 404 during verification. These were not in the supplied assets or copy. Until supplied, local holding pages explain their status, the release timeline has no fabricated entries, and indexing stays disabled for the reserved example domain.

OpenAPI/cURL and encryption use labeled conceptual diagrams because corresponding product screenshots were not supplied. Real captures can replace these without changing the surrounding layout.

## Polish-pass verification

- Hero headline enlarged from 82px to 106px at desktop size; product frame widened to 1240px.
- Tracing has a centered 72px headline and its own large product stage.
- Focus Mode is a compact, static Compose → Inspect → Adjust explanation.
- GraphQL precedes a slim HTTP summary. Filtering and Timeline use distinct side-by-side compositions.
- Dynamic Variables has a four-step annotated flow using the real JSONPath / variable names.
- Encryption explains response storage behavior without adding algorithm, key-management, or certification claims.
- Layouts show all three real screenshots together; mobile uses an accessible horizontal strip with no tabs.
- All three unique demos are verified to hold their final frame, remain finished when scrolled out and back, and restart only when Replay is chosen.
- `/github/` returns 404; GitHub links point directly to the configured repository.
- Docs overview and guide routes display “Still in progress.”
- Main-content entrance runs for 380ms and is disabled with reduced motion. Accessibility audits wait for the finite entrance to complete before measuring contrast.

| Viewport        | Previous page height | Refined page height | Reduction |
| --------------- | -------------------: | ------------------: | --------: |
| Desktop, 1440px |             13,753px |            10,555px |     23.3% |
| Phone, 390px    |             11,627px |             9,433px |     18.9% |

No document-level overflow at 320, 375, 390, 768, 1024, or 1440px. These measurements use the same browser and reduced-motion setting, after font loading.

Final polish-build Lighthouse mobile lab check: **98 Performance / 100 Accessibility / 100 Best Practices**. FCP 1.1 s, LCP 2.3 s, total blocking time 0 ms, cumulative layout shift 0. The unconfigured preview still intentionally blocks indexing.
