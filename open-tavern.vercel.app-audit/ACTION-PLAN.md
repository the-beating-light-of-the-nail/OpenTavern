# Action Plan — open-tavern.vercel.app

Prioritized. Each item has a **verification** (how to confirm it landed) and a **leading indicator** (the metric that should move).

---

## Phase 1 — Critical Fixes (Week 1)

### 1.1 Add canonical tags to every page
- **Why:** No `<link rel="canonical">` anywhere; `/?utm_source=test` returns 200 = duplicate URLs.
- **Fix:** In Nuxt, add to layout/`app.vue`:
  ```ts
  useHead(() => ({ link: [{ rel: 'canonical', href: 'https://open-tavern.vercel.app' + useRoute().path }] }))
  ```
- **Verify:** `curl -s https://open-tavern.vercel.app/?x=1 | grep -i canonical` returns the bare URL.
- **Leading indicator:** GSC "Duplicate without user-selected canonical" → 0.

### 1.2 Add Open Graph + Twitter Card images
- **Why:** No `og:image` / `twitter:card` → every social share is bare text.
- **Fix:** Global `useSeoMeta({ ogType:'website', twitterCard:'summary_large_image', ogImage:'/og/default.png', ogUrl: ... })`; per-character override.
- **Verify:** opengraph.xyz preview shows a card.
- **Leading indicator:** social referral CTR.

### 1.3 Add Organization + WebSite JSON-LD (once)
- **Why:** Zero structured data anywhere.
- **Fix:** `nuxt-schema-org` or a single `<script type="application/ld+json">` with `Organization` + `WebSite`.
- **Verify:** Rich Results Test passes on `/`.
- **Leading indicator:** sitelinks / knowledge panel signals.

---

## Phase 2 — High-Impact (Weeks 2–3)

### 2.1 Render character avatars server-side
- **Why:** 0 `<img>` in SSR HTML — no image SEO, missing visual hook.
- **Fix:** Use `<NuxtImg>` (emits `<img>` in SSR) with `alt="{character name} — {persona}"` + width/height.
- **Verify:** `curl /characters/space-commander | grep -i '<img'`.
- **Leading indicator:** Google Images impressions in GSC.

### 2.2 Add security headers (`vercel.json`)
- **Why:** No CSP / X-Content-Type-Options / Referrer-Policy / Permissions-Policy.
- **Fix:**
  ```json
  { "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
    ]
  }]}
  ```
- **Verify:** `curl -sI / | grep -i referrer-policy`.
- **Leading indicator:** securityheaders.com grade → A.

### 2.3 Add Article + BreadcrumbList schema on character & guide pages
- **Why:** Per-page entity signals for ranking + AI search.
- **Fix:** Template-level JSON-LD per route type.
- **Verify:** Rich Results Test detects `Article` on a character URL.

### 2.4 Add About + Contact pages (E-E-A-T trust)
- **Why:** No trust/author signals.
- **Fix:** `/about`, `/contact`, linked in footer.
- **Leading indicator:** brand entity recognition in AI Overviews.

### 2.5 `X-Robots-Tag: noindex` for `/app*`
- **Why:** `/app` returns 200; defense-in-depth beyond robots.txt.

---

## Phase 3 — Content & Authority (Month 2)

### 3.1 Deepen guides to 1,200–2,000 words
- Add screenshots, FAQ, internal links to relevant characters.

### 3.2 HowTo schema on step-by-step guides

### 3.3 Add per-character OG images
- Auto-generate 1200×630 from avatar + name for shareable character cards.

---

## Phase 4 — Monitoring & Iteration (Ongoing)

### 4.1 Provision the plugin's full toolchain
- `sudo apt install python3.10-venv` → `/seo setup` → unlocks PageSpeed / CrUX / PDF reports.
- Re-run `/seo audit https://open-tavern.vercel.app/` to replace lab estimates with field data.

### 4.2 Set up drift monitoring
- `/seo drift baseline https://open-tavern.vercel.app/` — catch regressions on deploys.

### 4.3 Google Search Console + sitemap submission
- Verify domain, submit `https://open-tavern.vercel.app/sitemap.xml`, monitor indexation.

### 4.4 Optional: `/seo google setup` (Tier 0, free)
- Unlocks real Core Web Vitals + URL inspection.
