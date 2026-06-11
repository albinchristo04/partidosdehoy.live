/**
 * Per-site configuration. The codebase is shared across the four-site network;
 * the active site is selected via the `SITE` env var at build time and falls
 * back to partidosdehoy.live (the daily-freshness hub).
 */

export interface SiteConfig {
  key: string;
  domain: string;
  url: string;
  brand: string;
  lang: string;          // <html lang>
  locale: string;        // schema inLanguage
  watchVerb: string;     // "ver" | "assistir"
  slugSuffix: string;    // "donde-ver"
  focusCountries: string[];
  defaultTimezone: string;
  social: {
    instagram?: string;
    facebook?: string;
    x?: string;
    youtube?: string;
  };
  indexNowKey: string;
}

const SITES: Record<string, SiteConfig> = {
  'partidosdehoy.live': {
    key: 'partidosdehoy.live',
    domain: 'partidosdehoy.live',
    url: 'https://partidosdehoy.live',
    brand: 'Partidos de Hoy',
    lang: 'es',
    locale: 'es',
    watchVerb: 'ver',
    slugSuffix: 'donde-ver',
    focusCountries: ['AR', 'CO', 'BR', 'EC', 'UY', 'CL', 'PE', 'VE', 'MX'],
    defaultTimezone: 'America/Mexico_City',
    social: {
      instagram: 'partidosdehoy.live',
      facebook: 'partidosdehoy.live',
      x: 'partidosdehoy',
    },
    // Public IndexNow key file lives at /<key>.txt
    indexNowKey: process.env.INDEXNOW_KEY ?? 'a1b2c3d4e5f64738a9b0c1d2e3f40516',
  },
};

const activeKey = process.env.SITE ?? 'partidosdehoy.live';

export const SITE: SiteConfig = SITES[activeKey] ?? SITES['partidosdehoy.live'];
