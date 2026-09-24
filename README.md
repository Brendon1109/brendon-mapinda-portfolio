# Brendon Mapinda — Creative Studio + Automation Lab

Personal brand site for **Brendon Mapinda**. A landing **chooser** sends visitors down one of two paths:

- **Studio** ([studio.html](studio.html)) — premium photography & content: editorial portraits, brand & venue content, cinematic reels, events.
- **Systems** ([systems.html](systems.html)) — software & automation: AI automation, custom builds, business optimization, AI discoverability.
- **The Growth Partnership** — a monthly retainer combining both.

> *Premium visuals. Smart systems. Business growth.*

## Live

- **Production (Cloudflare Workers):** https://brendon.giyant.co.za
- Deploy: `npx wrangler deploy` from the repo root. The Worker is on the HeavL Cloudflare account since 23 September 2026 and `account_id` is pinned in [wrangler.jsonc](wrangler.jsonc), so wrangler never has to guess between the two accounts the login can see. In the dashboard, check the account switcher before assuming a permissions problem.
- Config: [wrangler.jsonc](wrangler.jsonc). Static assets only, no Worker script and still no build step.
- Caching: [_headers](_headers) carries the one year immutable rule for `images/` and `videos/`.
- Not published: [.assetsignore](.assetsignore) lists the repo files that must never become a public URL. `assets.directory` is the repo root, so anything not in that list is served.
- URLs are extensionless. `/studio` and `/systems` are the canonical paths, and `/studio.html` 307s to `/studio` so old inbound links still land.
- **Old home, still running:** https://brendon-mapinda-portfolio.vercel.app. The Vercel project is still git connected to `main`, so it redeploys on every push and stays a working fallback. [vercel.json](vercel.json) was updated to serve from `public/` and to use `cleanUrls`, which matches the extensionless URLs Cloudflare serves. Both copies carry the same canonical tags pointing at the Cloudflare host, so search engines consolidate on the new one. Delete the Vercel project once the move has settled.

## Pricing on the site (ZAR)

| Studio (sessions) | Price |
| --- | --- |
| Mini Session | R1,000 |
| Signature *(most booked)* | R1,500 |
| Premium Creative | R2,000 |

Transport is not included in any session. The client arranges it or it is added to the quote. Event coverage has no published price since 24 September 2026, it is quoted on request.

| Systems | Price |
| --- | --- |
| Website | from R2,000 |
| Custom Build | from R5,000 |
| Automation | from R10,000 |
| Growth Partnership | monthly plan, tailored on request |

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
├── llms.txt · robots.txt · sitemap.xml · favicon.svg
├── wrangler.jsonc · _headers · .assetsignore   # Cloudflare Workers hosting
```

## Links

- Instagram: <https://www.instagram.com/framebyframeios> · TikTok: <https://www.tiktok.com/@framebyframeios>
- LinkedIn: <https://www.linkedin.com/in/brendon-mapinda-20b6911a0/> · GitHub: <https://github.com/Brendon1109>
- WhatsApp: <https://wa.me/27748226711>
