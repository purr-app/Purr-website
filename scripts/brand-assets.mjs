import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
const icon = await readFile('assets/purr.svg');
await writeFile('public/purr.svg', icon);
for (const [name, size] of [
  ['favicon-48x48', 48],
  ['favicon-96x96', 96],
  ['apple-touch-icon', 180],
  ['icon-192', 192],
  ['icon-512', 512],
])
  await sharp(icon).resize(size, size).png().toFile(`public/${name}.png`);

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((size) => sharp(icon).resize(size, size).png().toBuffer()),
);
const icoDirectory = Buffer.alloc(6 + icoImages.length * 16);
icoDirectory.writeUInt16LE(0, 0);
icoDirectory.writeUInt16LE(1, 2);
icoDirectory.writeUInt16LE(icoImages.length, 4);
let icoOffset = icoDirectory.length;
icoImages.forEach((image, index) => {
  const entry = 6 + index * 16;
  icoDirectory.writeUInt8(icoSizes[index], entry);
  icoDirectory.writeUInt8(icoSizes[index], entry + 1);
  icoDirectory.writeUInt8(0, entry + 2);
  icoDirectory.writeUInt8(0, entry + 3);
  icoDirectory.writeUInt16LE(1, entry + 4);
  icoDirectory.writeUInt16LE(32, entry + 6);
  icoDirectory.writeUInt32LE(image.length, entry + 8);
  icoDirectory.writeUInt32LE(icoOffset, entry + 12);
  icoOffset += image.length;
});
await writeFile('public/favicon.ico', Buffer.concat([icoDirectory, ...icoImages]));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0B0D13"/><path d="M0 580h1200" stroke="#262938"/><text x="80" y="92" font-family="Arial,sans-serif" font-size="26" fill="#F4F4F5">Purr</text><text x="80" y="245" font-family="Arial,sans-serif" font-size="76" font-weight="600" fill="#F4F4F5">API work, with less</text><text x="80" y="335" font-family="Arial,sans-serif" font-size="76" font-weight="600" fill="#A1A1AA">UI in the way.</text><text x="80" y="440" font-family="Arial,sans-serif" font-size="25" fill="#A1A1AA">A focused HTTP and GraphQL client for macOS.</text><text x="80" y="540" font-family="monospace" font-size="18" fill="#78A9FA">LOCAL-FIRST  /  HTTP  /  GRAPHQL  /  JAEGER TRACING</text></svg>`;
await sharp(Buffer.from(svg))
  .composite([{ input: await sharp(icon).resize(80).toBuffer(), left: 1040, top: 54 }])
  .png()
  .toFile('public/og.png');
