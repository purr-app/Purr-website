# Purr asset audit and section map

All 29 supplied files were inspected before implementation, including both image encodings, sampled video frames and metadata, the SVG, approved copy, and HTML design reference.

| Source                                            | Section / treatment                                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `texts`                                           | Approved landing-page copy; used verbatim for primary headings and descriptions.                                                                        |
| `theme-ref.html`                                  | Palette reference only; not its illustrative UI or feature claims.                                                                                      |
| `purr.svg`                                        | Brand, favicon, app icons.                                                                                                                              |
| `hero.mp4`                                        | Hero; 5.4 seconds, H.264, 2364×1440, 60 fps. Optimize to 30 fps with fast-start metadata. Extract Compose / Inspect / Adjust stills at 0, 2, 4 seconds. |
| `hero.png`, `hero.webp`                           | Original response-primary HTTP workspace; retained as source reference. The current hero poster is its recording’s final frame.                         |
| `tracing.mp4`                                     | Lazy-loaded tracing demonstration; 3.92 seconds, H.264, 2364×1440, 60 fps.                                                                              |
| `tracing.png`, `tracing.webp`                     | Trace waterfall and span details; retained as source reference. The current tracing poster is its recording’s final frame.                              |
| `focus.png`, `focus.webp`                         | Focus layout mode, same Preview action weekend plan request as split modes.                                                                             |
| `vertical_mode.png`, `vertical_mode.webp`         | Vertical Split comparison screenshot. HTTP now uses a compact summary without repeating this visual.                                                    |
| `horisontal_mode.png`, `horisontal_mode.webp`     | Horizontal Split mode. Keep original misspelling in source only.                                                                                        |
| `gql_multi_queries.png`, `gql_multi_queries.webp` | GraphQL Queries tab; operation-level send.                                                                                                              |
| `gql_var_form.png`, `gql_var_form.webp`           | GraphQL Variables tab; structured enum input.                                                                                                           |
| `gql_schema.png`, `gql_schema.webp`               | GraphQL Schema tab; type registry and schema details.                                                                                                   |
| `gql_autocomplete.png`, `gql_autocomplete.webp`   | GraphQL Autocomplete tab; real suggestions.                                                                                                             |
| `dynamic_vars.png`, `dynamic_vars.webp`           | Dynamic variables; crop main variables area and extraction settings.                                                                                    |
| `jpath.mp4`                                       | 5.58-second JSONPath filtering demonstration; optimized desktop/mobile video with its final frame as poster. Plays once, then holds.                    |
| `timeline.png`, `timeline.webp`                   | Request Timeline; crop response timing and request details.                                                                                             |
| `Screenshot 2026-09-18 at 16.45.46.png`           | Unrelated GitHub PR screenshot. Excluded from public output.                                                                                            |

## Missing assets and approved fallbacks

- OpenAPI / cURL: no import UI supplied. Use labeled conceptual source-to-request diagrams, with source comments for future real screenshots. Do not recreate a Purr importer.
- Encryption: no settings screenshot supplied. Use response → encryption → local storage diagram. No algorithm, certification, key handling, or telemetry claims.
- Changelog: no release history supplied. Provide an empty published collection and a draft example excluded from output. The prompt's v0.4.0 date is an example, not an actual release.
- Domain, download, and license remain configurable with local fallback pages. GitHub now points directly to `https://github.com/purr-app/Purr`, found in the local Purr Git remote; anonymous access returned 404 during verification. No local GitHub route remains.

## Feature pages

- `/tracing/`: existing tracing video and final-frame poster lead the page; `tracing.webp` provides the static waterfall detail. The duration bars are explicitly labeled as an illustrative example.
- `/graphql-client/`: existing operation, structured-variable, schema and autocomplete detail screenshots use the shared accessible showcase tabs.
- The variables section uses `gql-variables-form-crop.webp`, cropped from `assets/gql_var_form.png` at left 765, top 1525, width 2695, height 480. It retains the enum menu, pageSize input and Form / JSON switch without modifying the UI.
- `/local-first-api-client/`: `hero.webp` shows the real local workspace. Storage separation and response encryption use conceptual HTML diagrams because no settings capture was supplied.
- Original images and videos are unchanged. Feature-page copy comes from the supplied approved text.

## Image processing

Source files remain untouched. Generated crops remove surrounding black margins / unrelated panels without altering app UI. Responsive WebP derivatives preserve readable feature areas; full-size source views are available through media links. Video frames are real recording stills. Hero, tracing, and JSONPath recordings are shipped once each, with smaller mobile encodes. Their final-frame posters are extracted at 5.30, 3.80, and 5.45 seconds respectively. Each video holds its final frame and requires explicit replay after completion. Reduced-motion and data-saver preferences prevent automatic playback. Focus Mode uses Compose / Inspect / Adjust tabs with the three genuine hero stills and their mobile crops; the three layout screenshots are displayed side-by-side.
