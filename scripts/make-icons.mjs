/**
 * Generates the app icon PNGs and the web manifest into public/.
 *
 * WHY THIS IS A SCRIPT AND NOT A BUILD STEP. This repo has no build step and no
 * package.json on purpose: the HTML in git is the HTML that is served. But iOS
 * and Android will not read an SVG for a home screen icon, they want PNGs at
 * fixed, unhashed URLs, because those URLs are named in head tags and in the web
 * manifest. So the PNGs are generated once by this script and committed, and the
 * script exists so the next person can regenerate them from the same source
 * rather than guess what was done.
 *
 * HOW TO RUN IT. sharp is the only dependency and it is deliberately not kept in
 * the repo. From the repo root:
 *
 *   npm install sharp          # writes package.json, package-lock.json, node_modules
 *   node scripts/make-icons.mjs
 *   rm -rf node_modules package.json package-lock.json
 *
 * That last line matters. Leaving a package.json behind would make this look
 * like a repo with tooling and the next person would go looking for a build.
 *
 * WHAT IT MAKES, all straight into public/ and never into public/images/,
 * because public/_headers puts a one year immutable cache on /images/* and an
 * icon that cannot be replaced without renaming it is a trap.
 *
 *   apple-touch-icon.png   180x180  iOS NEVER reads the web manifest. This one
 *                                   file is the whole reason "Add to Home
 *                                   Screen" on an iPhone shows the mark instead
 *                                   of a grey square. It did not exist before.
 *   icon-192.png           192x192  Android and desktop install, purpose "any".
 *   icon-512.png           512x512  Splash and store sized, purpose "any".
 *   icon-512-maskable.png  512x512  purpose "maskable". Android crops an icon to
 *                                   whatever shape the launcher uses, so this
 *                                   one holds the mark inside the middle 80% and
 *                                   lets the background take the crop.
 *
 * THE SOURCE MARK is public/favicon.svg, redrawn inline below rather than loaded
 * from that file, for two reasons.
 *
 *   1. favicon.svg carries rx="56" on its background so it reads as a rounded
 *      tab icon at 16px. A raster must NOT bake that rounding in. iOS applies
 *      its own corner mask on top, and a rounded PNG under an iOS mask gives a
 *      visibly double rounded icon with pale notches in the corners. Everything
 *      here goes onto a full bleed opaque square.
 *   2. The mark is drawn 5.5% right of centre in that file. At 16px in a browser
 *      tab nobody will ever see it. At 180px on a home screen, sitting in a grid
 *      next to icons that are properly centred, it reads as broken. So the mark
 *      is measured and centred here rather than trusting the source coordinates.
 *
 * THE FONT IS A REAL DEPENDENCY. The mark is live text in Georgia, so this
 * script needs Georgia installed to render what the tab icon renders. That is
 * also why the centring is measured at run time instead of hardcoded: on a
 * machine that falls back to a different serif the metrics move, and a hardcoded
 * nudge would silently centre the wrong thing. Look at the PNGs after running.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, 'public');

/** Near black, the same value as the theme-color meta on all three pages. */
const INK = '#111111';

/** Everything is rendered once at this size and sampled down, so the small
 *  icons get supersampled edges instead of librsvg's hinting at 180px. */
const MASTER = 2048;

/** The mark's own coordinate system, from favicon.svg. */
const BOX = 256;

/**
 * The mark itself, with no background.
 *
 * `dx`/`dy` shift it in BOX units and `scale` shrinks it about the centre of the
 * canvas. 1 is the mark as drawn, 0.8 is the maskable safe zone.
 */
function glyphSvg(size, { dx = 0, dy = 0, scale = 1 } = {}) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}" width="${size}" height="${size}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3c79a"/><stop offset="0.5" stop-color="#c9a87a"/><stop offset="1" stop-color="#a8855a"/></linearGradient></defs>
  <g transform="translate(${BOX / 2} ${BOX / 2}) scale(${scale}) translate(${-BOX / 2 + dx} ${-BOX / 2 + dy})">
    <text x="100" y="182" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="600" font-size="172" fill="#f4efe7">B</text>
    <text x="162" y="182" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="600" font-size="172" fill="url(#g)">M</text>
    <line x1="72" y1="190" x2="188" y2="74" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/>
  </g>
</svg>`);
}

/**
 * Where the ink actually sits, in BOX units, found by reading the alpha channel
 * of the mark rendered on nothing. Measured rather than assumed because it
 * depends on the font the machine resolves.
 */
async function measureMark() {
  const { data, info } = await sharp(glyphSvg(MASTER))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  let minX = width, minY = height, maxX = -1, maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Anything more than faintly opaque counts as ink, so antialiased edges
      // do not drag the box outwards.
      if (data[(y * width + x) * channels + (channels - 1)] > 40) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) throw new Error('The mark rendered empty. Is Georgia installed?');

  const toBox = (v) => (v / width) * BOX;
  return {
    dx: BOX / 2 - toBox((minX + maxX) / 2),
    dy: BOX / 2 - toBox((minY + maxY) / 2),
    widthPct: ((maxX - minX) / width) * 100,
    heightPct: ((maxY - minY) / height) * 100,
  };
}

/** The centred mark on a full bleed opaque square, at MASTER resolution. */
function master(centre, scale) {
  return sharp({
    create: {
      width: MASTER,
      height: MASTER,
      channels: 4,
      background: INK,
    },
  })
    .composite([{ input: glyphSvg(MASTER, { ...centre, scale }), top: 0, left: 0 }])
    .png()
    .toBuffer();
}

async function write(buffer, name, size) {
  await sharp(buffer)
    .resize(size, size, { kernel: 'lanczos3' })
    // The square underneath is already opaque, so this only guarantees no alpha
    // channel reaches the file. iOS composites a transparent icon onto a
    // background of its own choosing and it is not always the one you expect.
    .flatten({ background: INK })
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, name));
  console.log(`  ${name}  ${size}x${size}`);
}

async function manifest() {
  // Minimal on purpose. This is a portfolio, not an app. There is no service
  // worker and no offline story, so display stays "browser": somebody who adds
  // it to a home screen gets the mark and the name rather than a screenshot of
  // the page, and tapping it still opens a normal browser with a back button.
  const json = {
    name: 'Brendon Mapinda, Modern Visuals and Smart Systems',
    short_name: 'Brendon Mapinda',
    description:
      'Cape Town creative studio and automation lab. Photography, video, websites and automation.',
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: INK,
    theme_color: INK,
    lang: 'en-ZA',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  await writeFile(
    path.join(publicDir, 'manifest.webmanifest'),
    JSON.stringify(json, null, 2) + '\n',
  );
  console.log('  manifest.webmanifest');
}

await mkdir(publicDir, { recursive: true });

const centre = await measureMark();
console.log(
  `Mark measured: ${centre.widthPct.toFixed(1)}% wide, ${centre.heightPct.toFixed(1)}% tall, ` +
    `recentred by ${centre.dx.toFixed(1)}, ${centre.dy.toFixed(1)} of ${BOX}`,
);

console.log('Writing app icons into public/');
const any = await master(centre, 1);
await write(any, 'apple-touch-icon.png', 180);
await write(any, 'icon-192.png', 192);
await write(any, 'icon-512.png', 512);

// 0.8 keeps the mark inside the maskable safe zone, so a circular or squircle
// launcher crop takes background and never a letter.
const maskable = await master(centre, 0.8);
await write(maskable, 'icon-512-maskable.png', 512);

await manifest();
