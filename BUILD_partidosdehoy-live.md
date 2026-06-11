# Claude Code Build Spec — partidosdehoy.live

## Role of this domain in the network
The **daily-freshness engine** and evergreen anchor. Target literal query: **"partidos de hoy"** — searched every single day, year-round, not just during the World Cup. This is what builds domain age and Bing trust *now* so the network is established before mid-2026. It also naturally hosts the contextual links to the other three sites.

> Model: a daily "what's on today + where to watch" guide. Lists matches and links each to its OFFICIAL broadcaster. No streams hosted or linked.

## Why this is the most valuable site long-term
"Partidos de hoy" / "fútbol hoy" recurs daily and survives past the tournament. A page updated every day feeds Bing's freshness signal hard and accrues steady engagement → domain trust that lifts the whole network. Treat this as the always-on hub, the World Cup as a traffic spike on top.

## Target keyword clusters (Bing, ES) — grounded in live query data
Pattern: subject + intent modifier. Win the long-tail now; head terms are owned by big media.
- **Primary (owns "today")**: partidos de hoy · fútbol hoy · partidos de hoy en vivo
- **World Cup**: partidos del mundial hoy · mundial 2026 partidos de hoy · qué partidos del mundial hay hoy
- **By country**: partidos de hoy en argentina / colombia / méxico / ecuador / …
- **Per-fixture long-tail (highest fast-rank value, one page each)**: `{A} vs {B} dónde ver en vivo` · `{A} vs {B} a qué hora y en qué canal` · `{A} vs {B} online gratis` · `a qué hora juega {equipo} hoy` · `dónde ver {equipo} hoy`
- **Modifiers to place literally in title/H1/first-100-words**: en vivo · hoy · a qué hora · qué canal · dónde ver · online · gratis
- **Question-format headings** (~22% more Bing visibility): "¿A qué hora juega {equipo} hoy?", "¿Dónde ver {A} vs {B}?"
- **Include the multi-country kickoff block** on every match page: `20:00 (ARG/URU) · 19:00 (CHI/VEN) · 18:00 (COL/PER/ECU) · 17:00 (CDMX)`
- **Avoid**: broadcaster brand terms as primary; pirate-intent phrasing (de-indexing risk). "Gratis" is fine — the legal free answer is real.

## Bing-first SEO requirements
- **Title**: `Partidos de Hoy: Horarios y Dónde Verlos en Vivo | Fútbol Hoy`
- **H1** (one): `Partidos de Hoy — Horarios y Transmisión Oficial`
- Exact phrase "partidos de hoy" in first 100 words, meta description, recurring H2s.
- **The whole point is freshness**: the homepage must regenerate daily with today's fixtures + kickoff times + official channel per match. Use IndexNow to ping Bing on every update.
- JSON-LD: `SportsEvent` per listed match with `BroadcastEvent` (broadcaster + region). Strong schema = strong Bing signal.
- 900+ words of stable surrounding content (how-to-watch explainer, country broadcaster table) so the page isn't thin between updates.
- Sitemap to Bing Webmaster Tools; confirm Bingbot access.

## Page structure
1. **Home** (`/`): "Partidos de hoy" — auto-updated daily list: match, competition, hora local, canal oficial (linked). During the WC, World Cup matches pinned to top.
2. **Mundial** (`/mundial`): World Cup fixtures + the per-country where-to-watch table.
3. **Por país** (`/argentina`, `/colombia`, etc.): "partidos de hoy en [país]" + official channels.
4. **Cómo ver** (`/como-ver`): evergreen explainer of official broadcasters by country.

## Data / automation note
- Pull fixtures from a licensed/legitimate sports-data source or a manually maintained JSON; render statically and redeploy daily (or ISR if using a framework). Each match row links to the OFFICIAL broadcaster for the user's country.
- Do NOT add any "watch here" link that resolves to a stream — only broadcaster sites/apps.

## Official broadcasters (reference table to embed; verify at build)
- **Argentina**: Telefe, TV Pública, TyC Sports, DGO, Disney+/ESPN.
- **Colombia**: Caracol, RCN, Win Sports, DGO, Disney+/ESPN.
- **Brazil**: Globo/Globoplay, CazéTV (YouTube, free), SBT, N Sports.
- **Ecuador/Uruguay**: ESPN/Disney+, DGO.
- **Chile/Peru/Venezuela**: DSports (DGO).
- **Bolivia/Paraguay**: excluded from DSports regional deal — verify local FTA holder.

## Internal linking — this is the designated hub
Because this site is topically central and high-traffic, it's the natural place for cross-links — but still keep them contextual, not a ring:
- From `/mundial` → `mundialenvivo.live` ("guía completa de dónde ver el Mundial") and `mundialenvivo.sbs` ("guía para Colombia y la región andina") and `assistircopaaovivo.live` ("guia em português para o Brasil").
- Descriptive, varied anchors, inside body content. One link per target. No reciprocal exact-match footer block.

## Tech stack (Astro + Cloudflare Pages + GitHub Actions)
- **Framework**: Astro, static output (`output: 'static'`). Zero client JS by default; Astro island only where truly needed.
- **Per-site config**: `site.config.ts` sets this domain's variables — `<html lang>` `es`, watch verb `ver`, slug suffix `donde-ver`, focus countries all (AR/CO/BR/EC/UY/CL/PE/VE/MX), social handles. Selected via `SITE` env var. Shared codebase with the other three sites.
- **Content/data**: content collections from `fixtures.json` + `broadcasters.json`. Per-match pages via `getStaticPaths()`. The homepage and a `/hoy/[date]` page are generated from fixtures filtered to today's date.
- **Per-match page**: route `/[teamA]-vs-[teamB]-donde-ver`. Title/H1 = exact long-tail query. First 100 words = date, local kickoff, official channel, free/pay. JSON-LD SportsEvent + BroadcastEvent in `<head>`.
- **Schema**: blocks from `assets_schema_jsonld.md`; broadcaster data from `broadcasters.json`.
- **Styling**: minimal CSS, inline critical CSS, sub-1s mobile LCP. Daily repeat visitors → dwell time + revisits are Bing engagement signals, so keep it instant.
- **Sitemap**: `@astrojs/sitemap`; submit to Bing Webmaster Tools.
- **IndexNow key**: `/<key>.txt` in `/public`.
- **Hosting**: Cloudflare Pages, auto-deploy from GitHub on push to `main`.
- **Freshness (GitHub Actions) — this site is the freshness spearhead**: scheduled `.github/workflows/freshness.yml` runs each match morning (and a few times on match days) → rebuilds today's fixtures + homepage (stamping today's date so output genuinely changes) → wrangler deploy → IndexNow push of today's URLs. This daily pulse is the core ranking mechanism for the whole network. Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `INDEXNOW_KEY`.
- HTTPS, one H1/page.
- Footer + share to Instagram page for social signals (tie via `sameAs` schema).

AIM
Atleast rank in top 10