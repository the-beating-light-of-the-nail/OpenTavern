# Full SEO Audit Report — open-tavern.vercel.app

**URL:** https://open-tavern.vercel.app/
**Date:** 2026-07-21
**Business type detected:** SaaS / Web app (AI roleplay platform) with Publisher-style content marketing (character pages + how-to guides)
**Toolchain note:** Audit run inline via HTTP fetch + HTML analysis. The plugin's Python/Playwright runtime requires `python3.10-venv` on this machine (see footer). Core Web Vitals / CrUX field data not collected — scores in those categories are lab estimates.

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **SEO Health Score** | **55 / 100** |
| Pages in sitemap | 33 (1 home, 20 characters, 8 guides, 2 collections, 2 indexes) |
| Critical issues | 3 |
| High issues | 4 |
| Medium issues | 5 |

**What works well:** Clean, well-structured site. Unique keyword-rich titles and meta descriptions on every template, single H1, logical H2/H3 hierarchy, real server-rendered text (889 words home / ~590 content pages), correct `robots.txt`, valid sitemap with `<lastmod>` on all URLs, HTTPS with HSTS preload. The content foundation is genuinely good — the problems are almost entirely *missing technical markup*, not bad content.

**Top 5 issues (by impact):**
1. **No canonical tags anywhere** → duplicate-URL / query-param duplication risk.
2. **No Open Graph / Twitter Card images** → social shares and character links render as bare text.
3. **Zero JSON-LD structured data** → no rich results, weak entity signals for AI search.
4. **No character/avatar images in SSR HTML** → no image SEO, likely slower perceived load.
5. **Missing security headers** (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).

**Top 5 quick wins (≤1 day each):**
1. Add `useSeoMeta` canonical + OG/Twitter image globally in `app.vue` / layout.
2. Add `Organization` + `WebSite` JSON-LD once (Nuxt `useSchemaOrg` or raw `<script>`).
3. Generate one default OG image + per-character OG images.
4. Add Vercel `vercel.json` security headers.
5. Add `<lastmod>` is already present — submit sitemap in GSC once verified.

---

## Score Breakdown

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 58 | 12.8 |
| Content Quality | 23% | 68 | 15.6 |
| On-Page SEO | 20% | 65 | 13.0 |
| Schema / Structured Data | 10% | 10 | 1.0 |
| Performance (CWV, lab estimate) | 10% | 70 | 7.0 |
| AI Search Readiness | 10% | 45 | 4.5 |
| Images | 5% | 20 | 1.0 |
| **Total** | **100%** | | **54.9 → 55** |

---

## Technical SEO

### What works
- `robots.txt` allows all, correctly disallows `/app` (the app shell), and declares the sitemap.
- Sitemap valid, 33 URLs, every entry has a `<lastmod>`.
- HTTPS enforced, `strict-transport-security: max-age=63072000; includeSubDomains; preload` present.
- Double-slash `//` → 308 redirect (Vercel normalizes it).

### Findings

**[Critical] No canonical link tags.**
Evidence: `<link rel="canonical">` absent on home, `/characters/space-commander`, and `/guides/how-to-start-ai-roleplay`. `/?utm_source=test` returns HTTP 200 with the same body as `/`, so every query-string variant is a separately-indexable duplicate of the canonical URL.
Recommendation: emit `<link rel="canonical" href="https://open-tavern.vercel.app{route.path}" />` (or `useSeoMeta({ canonical })`) on every page, stripped of query params.
**Falsifiability check:** in Google Search Console → URL Inspection on `/?utm_source=test`, after fix the "Google-selected canonical" should equal `https://open-tavern.vercel.app/`. Leading indicator: "Duplicate without user-selected canonical" count in GSC Coverage → drops to 0 within 2–4 weeks.

**[High] Missing security headers.**
Evidence: response headers contain HSTS but no `content-security-policy`, `x-content-type-options`, `referrer-policy`, or `permissions-policy`. (`x-frame-options` is acceptable to omit if CSP `frame-ancestors` is set.)
Recommendation: add a `vercel.json` with `headers` block setting `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, and a baseline CSP.
**Falsifiability check:** `curl -sI https://open-tavern.vercel.app/ | grep -iE 'x-content-type-options|referrer-policy'` returns both headers. Leading indicator: security-header scanners (securityheaders.com) grade rises from F to A.

**[Medium] `/app` returns 200 to direct requests.**
Evidence: `GET /app` → 200 (not redirected), though it's correctly disallowed in robots. Not a leak (robots blocks it), but it relies entirely on robots.txt honoring. If `/app` is meant to be client-only, consider `noindex` header as defense-in-depth.
Recommendation: add `X-Robots-Tag: noindex` for `/app*` in `vercel.json`.

---

## Content Quality (E-E-A-T)

### What works
- Homepage is 889 words of genuine, on-topic copy.
- Character pages have unique, persona-rich titles ("Commander Jax Vire — Space Commander | RoleChat AI") and compelling descriptions.
- Clear H1 → H2 → H3 hierarchy.

### Findings

**[High] No author / E-E-A-T trust signals.**
Evidence: no "About", author bios, contact page, or trust markers visible in the analyzed templates. For YMYL-adjacent or AI-content topics, Google's QRG weights Trust heaviest; AI-generated content is fine under Search Essentials *if* trust signals exist.
Recommendation: add an `/about` page (who runs it, editorial process), a `/contact` page, and link them in the footer.
**Falsifiability check:** after adding, the homepage/footer contains a crawlable link to `/about` and `/contact` with substantive content. Leading indicator: brand-name entity recognition in AI Overviews.

**[Medium] Guide depth is moderate for competitive how-to terms.**
Evidence: `/guides/how-to-start-ai-roleplay` ≈ 596 words. "How to start AI roleplay" is a competitive informational query; top-ranking pages typically run 1,200–2,000 words with screenshots.
Recommendation: expand guides with step-by-step screenshots, FAQs, and internal links to relevant character pages.

**[Medium] No FAQ content on commercial pages.**
Evidence: homepage has an FAQ section (good) but it is not in schema (see Schema) and character/collection pages lack Q&A.

---

## On-Page SEO

### What works
- Titles 50–65 chars, keyword-forward, consistent brand suffix "| RoleChat AI".
- Meta descriptions 140–170 chars, action-oriented.
- Exactly one H1 per page.

### Findings

**[High] No Open Graph / Twitter Card tags.**
Evidence: across home, character, and guide templates — `og:image`, `og:type`, `og:url`, and `twitter:card` are all absent (only `og:title`/`og:description` present). Every share on X, Discord, Reddit, Slack renders as plain text with no preview image.
Recommendation: set `og:type=website`, `og:url`, `og:image` (1200×630), `twitter:card=summary_large_image` globally; override `og:image` per character.
**Falsifiability check:** paste the URL into `https://www.opengraph.xyz/url/...` → preview shows a card image. Leading indicator: social referral traffic / CTR from shares rises.

**[Medium] No hreflang.**
Evidence: 0 `<link rel="alternate" hreflang>` tags. Acceptable while the site is English-only; add if/when additional languages ship. Low priority now.

---

## Schema / Structured Data

### Finding
**[Critical] Zero JSON-LD on every page type.**
Evidence: `application/ld+json` appears 0 times on home, character, and guide pages. No `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, or `Article`.

Recommendation (priority order):
1. Site-wide: `Organization` + `WebSite` (with `SearchAction` if there's a search) — one-time.
2. Character pages: `Article` or `CreativeWork` + `BreadcrumbList`.
3. Guide pages: `Article` + `BreadcrumbList` + `HowTo` (where applicable).
4. Homepage FAQ block: `FAQPage` as a supporting entity signal (rich result deprecated 2026-05-07 but still useful for AI/entity).

Easiest path in Nuxt: `nuxt-schema-org` module, or raw `<script type="application/ld+json">` via `useHead`.
**Falsifiability check:** Rich Results Test on any character URL → detects valid `Article`/`BreadcrumbList`. Leading indicator: sitelinks search box / breadcrumb appearance in SERP.

---

## Performance (Core Web Vitals — lab estimate)

> No CrUX/PageSpeed field data collected (runtime not provisioned). These are estimates from payload inspection.

- Homepage HTML: 69 KB (reasonable for SSR Nuxt).
- **0 `<img>` tags in SSR HTML** (see Images) → LCP element is text, so LCP should be fast (good).
- Risk: unknown JS bundle hydration size; verify with a real Lighthouse run.
- **Action required to get real numbers:** run `/seo google setup` (Tier 0, free API key) → PageSpeed + CrUX field data, then re-score this category.

**[Info] INP/CLS unknown** — recommend field measurement once toolchain is provisioned.

---

## Images

### Finding
**[High] No images present in server-rendered HTML.**
Evidence: 0 `<img>`, 0 `<picture>`, 0 `<nuxt-img>`, 0 CSS `background-image` on home, character, and guide pages. For a *character roleplay* site, character avatars are the primary visual asset — their absence means no image-search traffic, weaker engagement, and missing OG images.
Recommendation: render character avatars server-side (e.g. `<NuxtImg>` so it emits `<img src>` in SSR), with descriptive `alt` text (the character name + persona). Add width/height to prevent CLS.
**Falsifiability check:** `curl` a character page → grep shows `<img ... alt="Commander Jax Vax ...">`. Leading indicator: impressions in Google Images Search Console.

---

## AI Search Readiness (GEO)

### Findings
**[High] Weak citability + no entity signals.**
Evidence: no schema (entities), no `og:image`, no `llms.txt` consideration needed (per Google's AI Optimization Guide, llms.txt is *not* a citation lever — do not chase it). Content is well-written and on-topic (good base), but lacks the structured entity + attribution density that AI Overviews prefer.
Recommendation: prioritize the Schema + author/trust fixes above; ensure character pages have self-contained 130–170 word answer-style intro blocks (question-led) for citability.
**Falsifiability check:** search "AI roleplay platform [brand]" in ChatGPT/Perplexity before/after fixes → brand mentioned with correct attributes.

---

## Toolchain / Runtime Fix (blocks full audit depth)

The plugin's Python runtime could not be provisioned: `python3 -m venv` fails because the `ensurepip` module is missing (Debian/Ubuntu needs the `python3.10-venv` package). Until fixed, Playwright rendering, PageSpeed, CrUX, and PDF report generation are unavailable.

**Fix (run yourself — needs sudo):**
```
sudo apt install python3.10-venv
```
Then re-run `/seo setup` (or `claude-seo setup`), and re-run this audit to get real Core Web Vitals + a PDF report.
