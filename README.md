# Purr website

A static Astro website for the Purr desktop HTTP / GraphQL API client. Real product screenshots and recordings, self-hosted fonts, and small vanilla TypeScript enhancements. No React or client framework.

## Run

Node 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:4321. `npm run build` type-checks the project and produces `dist/`. `npm run preview` serves the production build.

## Launch configuration

Copy `.env.example` to `.env` and supply verified public URLs:

```dotenv
PUBLIC_SITE_URL=https://your-public-domain.com
PUBLIC_DOWNLOAD_URL=https://your-verified-macos-download
PUBLIC_GITHUB_URL=https://github.com/purr-app/Purr
PUBLIC_LICENSE_URL=https://your-published-license
```

Rebuild after changing these values. All product links are centralized in `src/config.ts`; the site origin is read in `astro.config.mjs`.

Without a public domain the site uses the reserved `purr.example` origin for build-time URL generation, omits canonical tags, and disables indexing. A real `PUBLIC_SITE_URL` enables canonical URLs, indexable Docs / Changelog, sitemap discovery in robots.txt, and absolute social metadata. Never publish the example origin as your production configuration.

Download and license links lead to local holding pages if URLs are absent. GitHub links point directly to `https://github.com/purr-app/Purr`, the origin found in the local Purr checkout, and can be overridden with `PUBLIC_GITHUB_URL`. There is no local GitHub page. Anonymous access to this remote returned 404 during verification; its public visibility is not assumed. No binary, license grant, software release date, price, security certification, or tracking policy for the desktop app is invented. Supply the official app privacy notice before public launch; the existing privacy page explains only this website and the approved local storage claim.

Deploy the contents of `dist/` to any static host. Use directory index support and serve `404.html` for missing routes. `public/_headers` supplies cache and baseline security headers on hosts that support that format; configure equivalent headers on other hosts.

## Content

- `assets/texts`: approved landing-page copy.
- `ASSET-MAP.md`: full asset audit, section mapping, and explicit missing-asset decisions.
- `src/pages/index.astro`: landing page.
- `src/content/docs/*.md`: intentionally short, approved feature overviews, ready for detailed documentation later.
- `src/content/changelog/*.{md,mdx}`: release notes.
- `src/content.config.ts`: typed Content Collection schemas.
- `src/layouts/Docs.astro`: desktop sidebar, mobile navigation, generated table of contents, and previous / next navigation.
- `src/styles/global.css`: palette, typography, responsive layouts, and accessible focus styles.
- `src/styles/refinements.css`: stronger Hero / Tracing hierarchy, compact feature compositions, layout comparison, and reduced-motion-safe entrance animation.

Add a documentation Markdown or MDX file with `title`, `description`, `order`, and optional `scaffold: false`. Routes, sidebars, and pagination are generated automatically. Use H2/H3 headings; the layout supplies the single H1. Fenced code blocks use Astro's build-time Shiki highlighting.

To publish a changelog entry, copy the draft template, replace every example value with actual shipped release information, and set `draft: false`. Entries are sorted newest first. The example is deliberately excluded, so the site does not announce a fictitious release.

## Media and performance

Original files are preserved in `assets/`. Only approved images and videos enter the public build. The unrelated GitHub screenshot and theme mockup are not shipped.

`src/assets/` contains crops and genuine video stills. Astro builds responsive WebP derivatives with explicit dimensions. On mobile, feature screenshots preserve readable scale in horizontally scrollable frames, with full-size image links. The three layout screenshots are displayed together, with a native horizontal scroll strip on mobile. Video frames remain responsive.

The 1920px H.264 videos are approximately 485 KB (hero), 249 KB (tracing), and 321 KB (JSONPath filtering). Their 960px mobile variants total approximately 331 KB. All have fast-start metadata and no audio. Each recording appears once, starts only when at least 80% of the video is visible, and holds its final frame after completion; it only restarts when the user chooses Replay. Playback pauses offscreen and when the document is hidden. Reduced motion and data saving block automatic loading while still allowing explicit playback. Posters are extracted from the final frames of the actual recordings. Focus Mode and GraphQL use screenshot tabs that rotate every 5.5 seconds while visible. Interaction pauses rotation until Resume is chosen; reduced motion disables it. The Hero media scales from 1 to 1.10 using a frame-throttled transform, without changing layout. The layout comparison keeps three static screenshots.

Only the Latin Space Grotesk font is preloaded. Google Sans Code loads as needed. Both are locally hosted with `font-display: swap`. There is no analytics, cookie banner, or external font request.

To regenerate brand assets: `node scripts/brand-assets.mjs` (uses sharp).
To regenerate product derivatives, install Python `Pillow` and `imageio-ffmpeg`, then run `python scripts/prepare-media.py` from the repository root. The committed derivatives make Python unnecessary for normal builds.

## Verification

```sh
npm run build
npx playwright install chromium
npm test
```

Tests run against the production preview on port 4322. The ten test groups cover accessible Focus Mode and GraphQL tabs, timed rotation and interaction pauses, the 80% video visibility threshold, clamped Hero scaling, the three-image layout comparison, mobile scrolling and navigation, internal destinations, play-once / hold / replay behavior, reduced motion, Docs progress notices, schema metadata, draft exclusion, robots/sitemap, and axe WCAG A/AA checks. See `VERIFICATION.md` for the completed review and remaining launch inputs.
