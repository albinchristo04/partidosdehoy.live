/** Timezone + Spanish date/time formatting. No external deps — Intl only. */

const ES = 'es-ES';

/** Representative timezones for the multi-country kickoff block (ES audience). */
const KICKOFF_ZONES: { label: string; tz: string }[] = [
  { label: 'ARG/URU', tz: 'America/Argentina/Buenos_Aires' },
  { label: 'CHI/VEN', tz: 'America/Caracas' },
  { label: 'COL/PER/ECU', tz: 'America/Bogota' },
  { label: 'CDMX', tz: 'America/Mexico_City' },
  { label: 'ESP', tz: 'Europe/Madrid' },
];

function timeIn(iso: string, tz: string): string {
  return new Intl.DateTimeFormat(ES, {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

/**
 * Multi-country kickoff line, e.g.
 * "20:00 (ARG/URU) · 19:00 (CHI/VEN) · 18:00 (COL/PER/ECU) · 17:00 (CDMX) · 02:00 (ESP)".
 */
export function kickoffBlock(iso: string): string {
  return KICKOFF_ZONES.map(({ label, tz }) => `${timeIn(iso, tz)} (${label})`).join(
    ' · '
  );
}

export function kickoffByZone(iso: string): { label: string; time: string }[] {
  return KICKOFF_ZONES.map(({ label, tz }) => ({ label, time: timeIn(iso, tz) }));
}

/** Long Spanish date, e.g. "jueves 11 de junio de 2026" (in given tz). */
export function longDate(iso: string, tz = 'America/Bogota'): string {
  return new Intl.DateTimeFormat(ES, {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/** Long Spanish date from a YYYY-MM-DD string (no time component). */
export function longDateFromYMD(ymd: string): string {
  // Anchor at noon UTC to avoid tz rollover.
  return new Intl.DateTimeFormat(ES, {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${ymd}T12:00:00Z`));
}

/** Short Spanish date, e.g. "11 jun". */
export function shortDate(iso: string, tz = 'America/Bogota'): string {
  return new Intl.DateTimeFormat(ES, {
    timeZone: tz,
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso));
}

/** Capitalize first letter (Intl lowercases weekday/month in es). */
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
