# Brendon Mapinda — Creative Studio + Automation Lab

Personal brand site for **Brendon Mapinda**, a Cape Town **creative studio + automation lab**.

> *Premium visuals. Smart systems. Business growth.*

Two disciplines, one operator:

- **The Studio (visuals)** — editorial portraits, brand & venue content, cinematic reels, event coverage
- **The Systems / Lab (AI & software)** — AI automation, app/software builds, business optimization, AI discoverability
- **The Growth Partnership** — a monthly retainer that combines both

## Pricing shown on the site (ZAR)

| Studio | Price |
| --- | --- |
| Mini Session | R850 |
| Signature Session *(most booked)* | R1,350 |
| Premium Creative | R2,000 – R2,500 |
| Basic Event (2–3 hrs) | R1,800 |
| Half-Day Event (4–5 hrs) | R2,800 – R3,500 |
| Full Event | By quote |

| Systems *(indicative — scoped per project)* | Price |
| --- | --- |
| Automation Sprint | from R7,500 |
| Custom Build | from R25,000 |
| Systems Retainer | from R4,500 / month |

> Systems prices are **starting points** written into `index.html` (search for `from R`). Adjust them to your real numbers before promoting the site.

## Lead capture (enquiry form)

The contact section has a real enquiry form. It works two ways:

1. **Out of the box** — with no setup, submitting the form opens **WhatsApp** pre-filled with the enquiry. Nothing to configure.
2. **Email capture (recommended)** — to receive enquiries in your inbox:
   - Get a free access key at <https://web3forms.com> (just enter your email — no account).
   - Open [`js/script.js`](js/script.js) and replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key.
   - Done — submissions now email you *and* the WhatsApp fallback still exists in the fine print.

The form has built-in validation and a honeypot anti-spam field.

## AI discoverability (built in)

This site practises the "AI Discoverability" service it sells — useful proof for clients:

- **`robots.txt`** explicitly welcomes AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot, CCBot, etc.).
- **`llms.txt`** ([llmstxt.org](https://llmstxt.org)) gives LLMs a clean, structured summary of who Brendon is, the services and pricing.
- **Structured data** (JSON-LD): `ProfessionalService`, `WebSite`, and a `FAQPage` — the format AI answer engines extract to cite you.
- A visible **FAQ** section mirrors the FAQ structured data in plain language.

## Tech stack

- HTML5, modern CSS (custom properties, grid, fluid type) — no framework, no build step
- Vanilla JavaScript (IntersectionObserver for reveal/active-nav; the enquiry form handler)
- Google Fonts: **Fraunces** (display) + **Inter** (body) + **JetBrains Mono** (technical accents)
- Font Awesome 6 icons
- Hosted on GitHub Pages

## Images

Source photos are optimised to WebP + JPEG with ffmpeg and committed under `images/`
(`profile.*`, `work-1..3.*`, `og-cover.jpg`). To regenerate from a new source image:

```bash
ffmpeg -y -i source.jpg -vf "scale=1000:1250:force_original_aspect_ratio=increase,crop=1000:1250" -c:v libwebp -quality 82 images/profile.webp
ffmpeg -y -i source.jpg -vf "scale=1000:1250:force_original_aspect_ratio=increase,crop=1000:1250" -q:v 4 images/profile.jpg
```

## Structure

```
brendon-mapinda-portfolio/
├── index.html                # Single-page dual-pillar site
├── qr-code-generator.html    # QR utility (separate page)
├── css/styles.css            # Design system + page styles
├── js/script.js              # Nav, reveal, enquiry form
├── images/                   # Optimised WebP/JPEG (profile, work, og)
├── assets/                   # Press PDF
├── llms.txt                  # AI-readable site summary
├── robots.txt                # AI-crawler-friendly
├── sitemap.xml
├── favicon.svg
└── README.md
```

## Local development

```bash
python -m http.server 8000   # or: npx serve .
```

Then open <http://localhost:8000>.

## Deployment

Pushes to `main` are served automatically by GitHub Pages at
<https://brendon1109.github.io/brendon-mapinda-portfolio/>.

## Brand palette

| Token | Hex |
| --- | --- |
| Ink | `#111111` |
| Paper | `#f4efe7` |
| Cream | `#ece5d6` |
| Gold | `#c9a87a` |
| Gold deep | `#a8855a` |
| Slate | `#6f6f6f` |

## Links

- Instagram (visuals): <https://www.instagram.com/framebyframeios>
- TikTok: <https://www.tiktok.com/@framebyframeios>
- LinkedIn: <https://www.linkedin.com/in/brendon-mapinda-20b6911a0/>
- GitHub: <https://github.com/Brendon1109>
- Book / enquire: <https://wa.me/27748226711>
