#!/usr/bin/env node
/**
 * Push today's URLs to IndexNow (Bing) so the daily freshness rebuild gets
 * crawled immediately. Reads the built sitemap if present, otherwise derives
 * URLs from fixtures + today's date.
 *
 * Env:
 *   INDEXNOW_KEY  - the IndexNow key (must match /public/<key>.txt)
 *   SITE_HOST     - host without scheme, default partidosdehoy.live
 *   BUILD_DATE    - optional YYYY-MM-DD to pin "today"
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const HOST = process.env.SITE_HOST ?? 'partidosdehoy.live';
const ORIGIN = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY ?? 'a1b2c3d4e5f64738a9b0c1d2e3f40516';

function anchorToday() {
  if (process.env.BUILD_DATE) return process.env.BUILD_DATE;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

async function fixtureUrlsForToday() {
  const raw = JSON.parse(await readFile(new URL('../src/data/fixtures.json', import.meta.url)));
  const today = anchorToday();
  const onDate = (iso) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(iso)) === today;
  const urls = new Set([`${ORIGIN}/`, `${ORIGIN}/mundial`, `${ORIGIN}/hoy/${today}`]);
  for (const f of raw) if (onDate(f.date)) urls.add(`${ORIGIN}/${f.slug}`);
  return [...urls];
}

async function main() {
  const urlList = await fixtureUrlsForToday();
  console.log(`IndexNow: submitting ${urlList.length} URL(s) for ${anchorToday()}`);

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (!res.ok && res.status !== 202 && res.status !== 200) {
    const text = await res.text().catch(() => '');
    console.error(text);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
