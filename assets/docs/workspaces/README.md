# Workspaces documentation media

Real Purr capture at 1440×900 points / 2880×1800 pixels. The disposable JSONPlaceholder workspace contains public static values only: workspace base_url=https://jsonplaceholder.typicode.com and post_id=1; Preview overrides post_id=2. A live GET using {{base_url}}/posts/{{post_id}} returned 200 OK with id=2. Import dialog and settings were inspected; no third-party collection was imported in this session.

## Rebuild

```sh
python3 ../purr-demo-studio/web_media.py assets/docs/workspaces/media.json --replace
npm run build
```

`source/` keeps original screenshots and the successful ScreenCaptureKit recording. `media.json` declares pixel crops and source-time cuts; `media-report.json` records sizes, durations and hashes. Screenshots retain native crop pixels as lossless WebP; Screenshot.astro caps CSS width at half the source width. Detail panels are cropped to their useful content. The video is 16:10, 30 fps, silent H.264 with long pauses removed; native controls and preload=none avoid autoplay/downloads.

Raw recording and storyboard remain in ../purr-demo-studio/output/workspaces-2026-10-10/. The four-second edit keeps opening the environment menu and selecting Preview, then holds the changed Effective value briefly. The capture indicator and unrelated workspace list are outside the published crops.

Page: src/content/docs/workspaces-and-environments.mdx. Dynamic variables stay on /docs/variables/.
