# partidosdehoy.live

Guía diaria de **partidos de hoy** y del **Mundial 2026**: horarios por país y dónde
ver cada partido en vivo, enlazando siempre a la **transmisión oficial**. Sitio estático
(Astro) optimizado para Bing y freshness diaria.

## Stack
- **Astro** static output (`output: 'static'`), zero client JS, CSS crítico inline.
- **@astrojs/sitemap** (pinned `3.2.1` for Astro 4 compatibility).
- Cloudflare Pages hosting + GitHub Actions daily freshness rebuild + IndexNow push.

## Project layout
```
site.config.ts              Per-site config (shared codebase, selected via SITE env var)
src/data/fixtures.json      Match fixtures (canonical build input)
src/data/broadcasters.json  OFFICIAL broadcasters per country (canonical build input)
src/lib/                     data.ts (loading/helpers), time.ts (tz/format), schema.ts (JSON-LD)
src/components/              MatchCard, KickoffBlock, BroadcasterTable, Schema, MatchBody, CountryBody
src/pages/                   index, mundial, como-ver, hoy/[date], [slug] (match + country router)
scripts/indexnow-push.mjs    Submit today's URLs to IndexNow (Bing)
.github/workflows/freshness.yml  Scheduled rebuild → deploy → IndexNow
```

## Important: broadcaster policy
Every "dónde ver" link points **only to legitimate rights-holders** (TV Pública, Telefe,
Caracol, RCN, Win Sports, Globo, CazéTV, Disney+/ESPN, DGO, Canal 5, ViX, etc.) per the
build spec's rule: *"No streams hosted or linked — only broadcaster sites/apps."*
`src/data/broadcasters.json` is the canonical, clean source. Do **not** repoint these to
stream aggregators.

## Commands
```bash
npm install
npm run dev            # local dev server
npm run build          # static build → dist/
BUILD_DATE=2026-06-11 npm run build   # pin "today" deterministically
npm run indexnow       # push today's URLs to IndexNow (needs INDEXNOW_KEY)
```

## Deploy secrets (GitHub Actions)
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INDEXNOW_KEY`. The IndexNow key must
match the file at `/public/<key>.txt`.

## SEO notes
- Title/H1/first-100-words carry the literal long-tail query per page.
- JSON-LD on every page: Organization+WebSite, plus SportsEvent+BroadcastEvent / FAQPage /
  BreadcrumbList where relevant.
- Multi-country kickoff block on every match page.
- Daily rebuild stamps the date so output genuinely changes → Bing freshness signal.
