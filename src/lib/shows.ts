import { artists } from "@/content/artists";
import { shows } from "@/content/shows";
import type { Artist, Show } from "@/content/types";
import { clockLabel, isValidZone, localIso, nextDay, zoneLabel, zonedInstant } from "./zoned-time";

/** The label is in Alaska, so a show without a zone reads as Alaska time. */
export const DEFAULT_TIME_ZONE = "America/Anchorage";

/** How long the pages that list shows keep a render, in seconds. Mirrors their `revalidate`. */
export const SHOWS_REVALIDATE_SECONDS = 3600;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

/** The show's zone, or Alaska time when it is missing or misspelled. */
export function zoneOf(show: Show): string {
  return show.timeZone && isValidZone(show.timeZone) ? show.timeZone : DEFAULT_TIME_ZONE;
}

/** Date and times parse; anything else is left off every page rather than guessed at. */
export function isWellFormedShow(show: Show): boolean {
  return (
    DATE.test(show.date) &&
    !Number.isNaN(Date.parse(show.date)) &&
    (!show.start || CLOCK.test(show.start)) &&
    (!show.end || CLOCK.test(show.end))
  );
}

/** UTC timestamps for when the night starts and when it stops counting as upcoming. */
export interface ShowWindow {
  start: number;
  end: number;
}

/**
 * An end earlier than the start runs past midnight. With no end time the
 * night is taken to run until 6 AM, late enough for any club set.
 */
export function showWindow(show: Show): ShowWindow {
  const zone = zoneOf(show);
  const start = zonedInstant(show.date, show.start ?? "00:00", zone);
  const end = show.end
    ? zonedInstant(show.start && show.end <= show.start ? nextDay(show.date) : show.date, show.end, zone)
    : zonedInstant(nextDay(show.date), "06:00", zone);
  return { start, end };
}

/**
 * Upcoming (soonest first) and past (latest first) as of `now`. A show stays
 * upcoming until it ends, so tonight's is still on the board at 1 AM.
 * Entries with a malformed date or time are left out rather than guessed at.
 */
export function splitShows(list: Show[], now: number = Date.now()): { upcoming: Show[]; past: Show[] } {
  const timed = list.filter(isWellFormedShow).map((show) => ({ show, ...showWindow(show) }));
  return {
    upcoming: timed
      .filter((s) => s.end > now)
      .sort((a, b) => a.start - b.start)
      .map((s) => s.show),
    past: timed
      .filter((s) => s.end <= now)
      .sort((a, b) => b.start - a.start)
      .map((s) => s.show),
  };
}

export function showsByArtist(slug: string): Show[] {
  return shows.filter((s) => s.artists.includes(slug));
}

/** The billed artists that exist on the roster, in billing order. */
export function lineup(show: Show): Artist[] {
  return show.artists.flatMap((slug) => artists.find((a) => a.slug === slug) ?? []);
}

/** Date pieces from the show's own local date, so no zone math: "SEP", "26", "SAT", "2026". */
export function showDate(show: Show) {
  const [y, m, d] = show.date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(day);
  return {
    month: format({ month: "short" }).toUpperCase(),
    day: String(d),
    weekday: format({ weekday: "short" }).toUpperCase(),
    year: String(y),
    /** "Saturday, September 26, 2026" */
    long: format({ weekday: "long", month: "long", day: "numeric", year: "numeric" }),
  };
}

/** "10 PM – 5 AM AKDT", or "" while the times are unannounced. */
export function showTimes(show: Show): string {
  if (!show.start) return "";
  const zone = zoneOf(show);
  const { start, end } = showWindow(show);
  const clock = show.end ? `${clockLabel(start, zone)} – ${clockLabel(end, zone)}` : clockLabel(start, zone);
  return [clock, zoneLabel(start, zone)].filter(Boolean).join(" ");
}

/** "Club Nyt Lyt · Anchorage, AK" */
export function showPlace(show: Show): string {
  const town = [show.city, show.region].filter(Boolean).join(", ");
  return [show.venue, town].filter(Boolean).join(" · ");
}

const isHttp = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : undefined);

/** Only well-formed links render. */
export function showLinks(show: Show): { event?: string; recording?: string } {
  return { event: isHttp(show.url), recording: isHttp(show.recording) };
}

/**
 * schema.org MusicEvent for an upcoming show, which is what search engines
 * list under "events". Needs a venue and a city; anything less returns
 * undefined rather than a half-filled record.
 */
export function showJsonLd(show: Show, siteUrl: string) {
  if (!show.venue || !show.city) return undefined;
  const zone = zoneOf(show);
  const { start, end } = showWindow(show);
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: show.name,
    startDate: localIso(start, zone),
    endDate: show.end ? localIso(end, zone) : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: show.address,
        addressLocality: show.city,
        addressRegion: show.region,
        addressCountry: show.country ?? "US",
      },
    },
    performer: lineup(show).map((a) => ({ "@type": "MusicGroup", name: a.name, url: `${siteUrl}/artists/${a.slug}` })),
    url: isHttp(show.url),
  };
}

// Dev-time sanity checks. Never throws — a content typo shouldn't take the site down.
if (process.env.NODE_ENV !== "production") {
  const ids = new Set<string>();
  const roster = new Set(artists.map((a) => a.slug));
  for (const s of shows) {
    if (ids.has(s.id)) console.warn(`[content] duplicate show id "${s.id}"`);
    ids.add(s.id);
    if (!/^[a-z0-9-]+$/.test(s.id)) console.warn(`[content] show id "${s.id}" should be lowercase-hyphenated`);
    if (!isWellFormedShow(s)) console.warn(`[content] show "${s.id}" has a malformed date or time ("YYYY-MM-DD", "HH:MM") and is hidden`);
    if (s.end && !s.start) console.warn(`[content] show "${s.id}" has an end time but no start time`);
    if (s.timeZone && !isValidZone(s.timeZone)) console.warn(`[content] show "${s.id}" has an unknown time zone "${s.timeZone}"; using Alaska time`);
    if (!s.artists.length) console.warn(`[content] show "${s.id}" lists no artists`);
    for (const a of s.artists) if (!roster.has(a)) console.warn(`[content] show "${s.id}" lists unknown artist "${a}"`);
  }
}
