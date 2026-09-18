# Purr asset audit and section map

All 29 supplied files were inspected before implementation, including both image encodings, sampled video frames and metadata, the SVG, approved copy, and HTML design reference.

| Source                                            | Section / treatment                                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `texts`                                           | Approved landing-page copy; used verbatim for primary headings and descriptions.                                                                        |
| `theme-ref.html`                                  | Palette reference only; not its illustrative UI or feature claims.                                                                                      |
| `purr.svg`                                        | Brand, favicon, app icons.                                                                                                                              |
| `hero.mp4`                                        | Hero; 5.4 seconds, H.264, 2364×1440, 60 fps. Optimize to 30 fps with fast-start metadata. Extract Compose / Inspect / Adjust stills at 0, 2, 4 seconds. |
| `hero.png`, `hero.webp`                           | Hero poster; response-primary HTTP workspace.                                                                                                           |
| `tracing.mp4`                                     | Lazy-loaded tracing demonstration; 3.92 seconds, H.264, 2364×1440, 60 fps.                                                                              |
| `tracing.png`, `tracing.webp`                     | Trace waterfall and span details; tracing poster / detail crop.                                                                                         |
| `focus.png`, `focus.webp`                         | Focus layout mode, same Preview action weekend plan request as split modes.                                                                             |
| `vertical_mode.png`, `vertical_mode.webp`         | Vertical Split mode and HTTP request/response workflow.                                                                                                 |
| `horisontal_mode.png`, `horisontal_mode.webp`     | Horizontal Split mode. Keep original misspelling in source only.                                                                                        |
| `gql_multi_queries.png`, `gql_multi_queries.webp` | GraphQL Queries tab; operation-level send.                                                                                                              |
| `gql_var_form.png`, `gql_var_form.webp`           | GraphQL Variables tab; structured enum input.                                                                                                           |
| `gql_schema.png`, `gql_schema.webp`               | GraphQL Schema tab; type registry and schema details.                                                                                                   |
| `gql_autocomplete.png`, `gql_autocomplete.webp`   | GraphQL Autocomplete tab; real suggestions.                                                                                                             |
| `dynamic_vars.png`, `dynamic_vars.webp`           | Dynamic variables; crop main variables area and extraction settings.                                                                                    |
| `jpath.mp4`                                       | 5.58-second JSONPath filtering recording; extract final still, no additional autoplay video.                                                            |
| `timeline.png`, `timeline.webp`                   | Request Timeline; crop response timing and request details.                                                                                             |
| `Screenshot 2026-09-18 at 16.45.46.png`           | Unrelated GitHub PR screenshot. Excluded from public output.                                                                                            |

## Missing assets and approved fallbacks

- OpenAPI / cURL: no import UI supplied. Use labeled conceptual source-to-request diagrams, with source comments for future real screenshots. Do not recreate a Purr importer.
- Encryption: no settings screenshot supplied. Use response → encryption → local storage diagram. No algorithm, certification, key handling, or telemetry claims.
- Changelog: no release history supplied. Provide an empty published collection and a draft example excluded from output. The prompt's v0.4.0 date is an example, not an actual release.
- Domain, download, repository and license: no verified URLs or license supplied. Centralized environment configuration and honest local fallback pages until provided.

## Image processing

Source files remain untouched. Generated crops remove surrounding black margins / unrelated panels without altering app UI. Responsive WebP derivatives preserve readable feature areas; full-size source views are available through media links. Video frames are real recording stills. Only the hero and tracing recordings are shipped, each with a smaller mobile encode. Reduced-motion and data-saver preferences prevent automatic playback.
