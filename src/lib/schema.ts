import { SITE } from '../../site.config';
import { focusCountries, type Fixture } from './data';

const ORIGIN = SITE.url;

/** Site-wide Organization + WebSite graph. */
export function orgWebsite() {
  const sameAs: string[] = [];
  if (SITE.social.instagram) sameAs.push(`https://www.instagram.com/${SITE.social.instagram}`);
  if (SITE.social.facebook) sameAs.push(`https://www.facebook.com/${SITE.social.facebook}`);
  if (SITE.social.x) sameAs.push(`https://x.com/${SITE.social.x}`);
  if (SITE.social.youtube) sameAs.push(`https://www.youtube.com/@${SITE.social.youtube}`);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${ORIGIN}/#org`,
        name: SITE.brand,
        url: `${ORIGIN}/`,
        logo: `${ORIGIN}/logo.png`,
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${ORIGIN}/#website`,
        url: `${ORIGIN}/`,
        name: SITE.brand,
        inLanguage: SITE.locale,
        publisher: { '@id': `${ORIGIN}/#org` },
      },
    ],
  };
}

/**
 * SportsEvent + one BroadcastEvent per focus country, each pointing at that
 * country's PRIMARY OFFICIAL broadcaster (free preferred). No stream links.
 */
export function sportsEvent(f: Fixture) {
  const subEvent = focusCountries
    .map(({ code, data }) => {
      const b = data.broadcasters[0];
      if (!b) return null;
      return {
        '@type': 'BroadcastEvent',
        name: `${f.teamA} vs ${f.teamB} — transmisión oficial en ${data.name}`,
        isLiveBroadcast: true,
        videoFormat: 'HD',
        broadcastOfEvent: { '@type': 'SportsEvent', name: `${f.teamA} vs ${f.teamB}` },
        publishedOn: {
          '@type': 'BroadcastService',
          name: b.name,
          broadcastDisplayName: b.name,
          areaServed: code,
        },
      };
    })
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${f.teamA} vs ${f.teamB} — Mundial 2026`,
    sport: 'Soccer',
    startDate: f.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: f.venue,
      address: `${f.city}, ${countryName(f.country)}`,
    },
    competitor: [
      { '@type': 'SportsTeam', name: f.teamA },
      { '@type': 'SportsTeam', name: f.teamB },
    ],
    subEvent,
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPage(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

export function breadcrumb(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}

function countryName(code: string): string {
  const map: Record<string, string> = {
    US: 'Estados Unidos',
    CA: 'Canadá',
    MX: 'México',
  };
  return map[code] ?? code;
}
