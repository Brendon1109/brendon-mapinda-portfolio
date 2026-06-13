# Brendon Mapinda — Creative Studio + Automation Lab

Personal brand site for **Brendon Mapinda**. A landing **chooser** sends visitors down one of two paths:

- **Studio** ([studio.html](studio.html)) — premium photography & content: editorial portraits, brand & venue content, cinematic reels, events.
- **Systems** ([systems.html](systems.html)) — software & automation: AI automation, custom builds, business optimization, AI discoverability.
- **The Growth Partnership** — a monthly retainer combining both.

> *Premium visuals. Smart systems. Business growth.*

## Live

- **Production (Vercel):** https://brendon-mapinda-portfolio.vercel.app
- Deploy: `vercel deploy --prod` from the repo root (Vercel CLI, logged in as `brendon1109`).
- Config: [vercel.json](vercel.json) (static, long-cache headers for images/videos).

## Pricing on the site (ZAR)

| Studio (sessions) | Price | | Studio (events) | Price |
| --- | --- | --- | --- | --- |
| Mini Session | R500 | | Basic Event | R1,500 |
| Signature *(most booked)* | R850 | | Half-Day | R2,000 |
| Premium Creative | R1,000 | | Full Event | R2,500 |

| Systems | Price |
| --- | --- |
| Automation | from R2,500 |
| Custom Build | from R3,000 |
| Growth Partnership | from R5,000 / month |

## Lead capture

Each detail page has an enquiry form. With no setup it opens **WhatsApp** pre-filled. To receive enquiries by email, get a free key at <https://web3forms.com> and set `WEB3FORMS_ACCESS_KEY` in [js/script.js](js/script.js). (See "Database" below for owning leads in a DB.)

## Media

- **Photos:** `images/gallery-1…10.{webp,jpg}` (optimised with ffmpeg).
- **Reels:** `videos/reel-1…3.mp4` + posters (vertical 9:16, click-to-play, `preload="none"`).
- **og-cover.jpg** — 1200×630 social share image.

Regenerate from new source files with ffmpeg, e.g.:

```bash
ffmpeg -y -i src.jpg -vf "scale='min(1080,iw)':-2" -c:v libwebp -quality 80 images/gallery-N.webp
ffmpeg -y -i src.mp4 -vf scale=720:1280 -c:v libx264 -crf 30 -movflags +faststart -c:a aac -b:a 96k videos/reel-N.mp4
```

## AI discoverability (built in)

`robots.txt` welcomes AI crawlers; `llms.txt` summarises the brand for LLMs; structured data (`ProfessionalService`, `Service`, `FAQPage`) + a visible FAQ on the Systems page. The site practises the "AI Discoverability" service it sells.

## Tech

HTML5 + modern CSS (custom properties, grid, fluid type), vanilla JS (nav, reveal, gallery lightbox, enquiry form). Fonts: Fraunces + Inter + JetBrains Mono. Font Awesome 6. No build step.

## Structure

```
├── index.html       # Landing chooser (Photography / Software)
├── studio.html      # Photography & content
├── systems.html     # Software & automation
├── css/styles.css   # Design system + all pages
├── js/script.js     # Nav, reveal, lightbox, enquiry form
├── images/          # gallery-*, og-cover
├── videos/          # reel-* + posters
├── llms.txt · robots.txt · sitemap.xml · vercel.json · favicon.svg
```

## Links

- Instagram: <https://www.instagram.com/framebyframeios> · TikTok: <https://www.tiktok.com/@framebyframeios>
- LinkedIn: <https://www.linkedin.com/in/brendon-mapinda-20b6911a0/> · GitHub: <https://github.com/Brendon1109>
- WhatsApp: <https://wa.me/27748226711>
