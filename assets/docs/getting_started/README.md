# Getting started media

The source of this page's screenshots and videos is the real Purr macOS UI, captured at 1440×900 points / 2880×1800 pixels. The request is a live GET to `https://jsonplaceholder.typicode.com/posts/1`; it returned 200 OK. No response was mocked. `main_screen.png` is the original user-provided first-launch screenshot and is preserved unchanged.

## Rebuild the web assets

From the website repository:

```sh
python3 ../purr-demo-studio/web_media.py assets/docs/getting_started/media.json --replace
npm run build
```

The standalone toolkit needs Python 3, FFmpeg/ffprobe, and cwebp (`brew install ffmpeg webp`). The website build itself needs none of these tools or a sibling checkout: it consumes the generated assets already under `src/assets/docs/` and `public/media/docs/`.

- `source/`: original PNG screenshots and successful ScreenCaptureKit recordings. These are never served by the site.
- `media.json`: versioned recipe for crops, output dimensions, source-time edits and speed changes. Coordinates are pixels in the original capture. Video times are seconds in the original recording.
- `media-report.json`: output byte counts, measured dimensions/durations, and SHA-256 fingerprints for verification.
- `../../../src/content/docs/getting-started.mdx`: page copy and media placement.

The full workspace image and videos are 16:10. Response, save-dialog, and folder close-ups are also 16:10. The URL screenshot is intentionally a narrow detail strip. The request video crops away the surrounding sidebar, while the layout video retains the layout buttons. These are actual UI crops, with no retouched controls or generated UI.

Screenshots retain the original crop resolution as lossless WebP. Serve these masters directly, without a second lossy image transform. Cap their displayed width at half the source pixel width so even small detail crops have at least 2× density on Retina screens. Full-size links open the same lossless file. Videos use H.264/yuv420p, 30 fps, CRF 23, faststart, and no audio. Native controls, `preload="none"`, and no autoplay/loop let the reader choose when to watch. Each video has a poster and its steps are described in the surrounding text.

The first-request video is 5 seconds: URL entry, a cut over idle time, Send, and a short response hold. The layout video is 3 seconds around the actual layout change. Trim preparation and inactive gaps; keep roughly 1–2 seconds on an outcome already explained by the page. Review actual frames around each cut instead of relying only on action markers.

## Agent workflow for the next page

1. Read the standalone toolkit's `AGENTS.md`; translate the requested feature into observable beats. Inspect the actual UI and use disposable examples.
2. Keep the app in front and capture one named window, preferably 1440×900. Run the recorder outside the execution sandbox when the sandbox hides the granted macOS Screen Recording permission. Do not change TCC settings programmatically.
3. Record with a finite duration; await `ready.json`, set markers, stop, and await `finished.json`. Do not launch a second capture process while recording. Take PNG screenshots afterward or extract frames from the completed video.
4. Keep originals in the page's `assets/docs/<page>/source/` folder and a media recipe alongside them. Select meaningful crops; do not cut a control the prose refers to. Normalize VFR recordings before trimming static intervals.
5. Export, inspect screenshots and the complete videos, check the report, update the MDX, build, and run the relevant browser tests. Check narrow and wide layouts, media links, keyboard controls, and no automatic video downloads.
6. Leave local changes for review. Do not commit or publish unless asked.

Raw capture sessions and markers for this trial remain in `../purr-demo-studio/output/getting-started-2026-10-09/`. The failed first recording was excluded. `first-request-clean` and `send-and-layouts` are the successful sources.
