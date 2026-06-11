import fixturesRaw from '../data/fixtures.json';
import broadcastersRaw from '../data/broadcasters.json';
import { SITE } from '../../site.config';

export interface Fixture {
  id: string;
  group: string | null;
  matchday: number | null;
  teamA: string;
  teamB: string;
  date: string; // ISO 8601 with offset
  venue: string;
  city: string;
  country: string; // host country code of the venue (US/CA/MX)
  slug: string;
  stage?: string;
}

export interface Broadcaster {
  name: string;
  url: string;
  access: 'free' | 'pay';
  type: string;
  note?: string;
}

export interface CountryBroadcasters {
  name: string;
  timezone: string;
  broadcasters: Broadcaster[];
}

export const fixtures: Fixture[] = fixturesRaw as Fixture[];

const broadcastersData = broadcastersRaw as {
  countries: Record<string, CountryBroadcasters>;
};

export const countries = broadcastersData.countries;

/** Focus countries for this site, in display order, that have broadcaster data. */
export const focusCountries: { code: string; data: CountryBroadcasters }[] =
  SITE.focusCountries
    .filter((code) => countries[code])
    .map((code) => ({ code, data: countries[code] }));

export function getCountry(code: string): CountryBroadcasters | undefined {
  return countries[code];
}

/** URL slug ⇄ country code, and the national-team name as it appears in fixtures. */
export const COUNTRY_SLUGS: Record<string, { slug: string; team: string }> = {
  AR: { slug: 'argentina', team: 'Argentina' },
  CO: { slug: 'colombia', team: 'Colombia' },
  BR: { slug: 'brasil', team: 'Brasil' },
  EC: { slug: 'ecuador', team: 'Ecuador' },
  UY: { slug: 'uruguay', team: 'Uruguay' },
  CL: { slug: 'chile', team: 'Chile' },
  PE: { slug: 'peru', team: 'Perú' },
  VE: { slug: 'venezuela', team: 'Venezuela' },
  MX: { slug: 'mexico', team: 'México' },
};

export function countrySlug(code: string): string {
  return COUNTRY_SLUGS[code]?.slug ?? code.toLowerCase();
}

export function codeFromSlug(slug: string): string | undefined {
  return Object.keys(COUNTRY_SLUGS).find((c) => COUNTRY_SLUGS[c].slug === slug);
}

/** Fixtures featuring a country's national team, sorted by kickoff. */
export function teamFixtures(code: string): Fixture[] {
  const team = COUNTRY_SLUGS[code]?.team;
  if (!team) return [];
  return sortByDate(fixtures.filter((f) => f.teamA === team || f.teamB === team));
}

export function getFixtureBySlug(slug: string): Fixture | undefined {
  return fixtures.find((f) => f.slug === slug);
}

/** Sorted ascending by kickoff. */
export function sortByDate(list: Fixture[]): Fixture[] {
  return [...list].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

/** Group-stage fixtures only (have a group letter). */
export const groupStage = fixtures.filter((f) => f.group !== null);

/** Knockout fixtures (round of 32 and beyond). */
export const knockout = fixtures.filter((f) => f.stage);

/** All distinct calendar dates (YYYY-MM-DD) on which matches occur, in the anchor tz. */
export function allMatchDates(): string[] {
  const set = new Set(fixtures.map((f) => localDate(f.date)));
  return [...set].sort();
}

/** Calendar date (YYYY-MM-DD) of an ISO timestamp, in the site anchor timezone. */
export function localDate(iso: string, tz: string = SITE.defaultTimezone): string {
  const d = new Date(iso);
  // en-CA yields YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Fixtures occurring on a given calendar date (anchor tz), sorted by kickoff. */
export function getFixturesOnDate(dateStr: string): Fixture[] {
  return sortByDate(fixtures.filter((f) => localDate(f.date) === dateStr));
}

/**
 * The build's notion of "today". The freshness workflow may pin it via
 * BUILD_DATE (YYYY-MM-DD) so output changes deterministically each run.
 */
export function buildToday(): string {
  if (process.env.BUILD_DATE) return process.env.BUILD_DATE;
  return localDate(new Date().toISOString());
}
