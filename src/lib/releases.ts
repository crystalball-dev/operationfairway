import { artists } from "@/content/artists";
import { releases } from "@/content/releases";
import { site } from "@/content/site";
import { STREAMING_SERVICE_LABELS, type Release, type ReleaseType, type StreamingService } from "@/content/types";

export const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = {
  single: "Single",
  ep: "EP",
  album: "Album",
  remix: "Remix",
  mixtape: "Mixtape",
  live: "Live",
};

/** Undated releases are treated as upcoming: they sort to the top, keeping their order in releases.ts. */
const sortKey = (r: Release) => r.releaseDate ?? "9999-99-99";

/**
 * Newest first, except that a `featured` release is pinned to the front.
 * Two records can share a release date, so the date alone can't decide which
 * one leads.
 */
export const sortedReleases: Release[] = (() => {
  const byDate = [...releases].sort((a, b) => sortKey(b).localeCompare(sortKey(a)));
  const featuredIndex = byDate.findIndex((r) => r.featured);
  if (featuredIndex <= 0) return byDate;
  const [featured] = byDate.splice(featuredIndex, 1);
  return [featured, ...byDate];
})();

export const latestRelease: Release | undefined = sortedReleases[0];

export function getRelease(slug: string): Release | undefined {
  return releases.find((r) => r.slug === slug);
}

/** One artist's records, newest first. */
export function releasesByArtist(artistSlug: string): Release[] {
  return sortedReleases.filter((r) => r.artist === artistSlug);
}

/**
 * Neighbors in a list (the whole discography by default, or one artist's).
 * `prev` is older, `next` is newer.
 */
export function adjacentReleases(slug: string, within: Release[] = sortedReleases): { prev?: Release; next?: Release } {
  const i = within.findIndex((r) => r.slug === slug);
  if (i === -1) return {};
  return { prev: within[i + 1], next: within[i - 1] };
}

const longDate = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "June 12, 2026", or "Date TBA" when unset. Deterministic (UTC) so server and client agree. */
export function formatReleaseDate(iso: string | undefined): string {
  if (!iso) return "Date TBA";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : longDate.format(d);
}

export function releaseYear(iso: string | undefined): string {
  if (!iso) return "TBA";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : String(d.getUTCFullYear());
}

/** Length of the longest word — used to size display titles so single long words never overflow. */
export function longestWord(title: string): number {
  return Math.max(4, ...title.split(/\s+/).map((w) => w.length));
}

/** The imprint a release came out on. Everything is OPERATION FAIRWAY unless stated otherwise. */
export function releaseLabel(release: Release): string {
  return release.label ?? site.name;
}

/** True for records that came out on this label (the default). */
export function isHouseRelease(release: Release): boolean {
  return releaseLabel(release) === site.name;
}

/**
 * Catalog numbers. Every house release gets one in release order, oldest
 * first ("OF001", "OF002", …); undated records queue up after the dated
 * ones in the order they are listed. A release can pin its own with
 * `catalogNumber`. Set `site.catalogPrefix` to "" to hide them everywhere.
 */
const catalog: Map<string, string> = (() => {
  const map = new Map<string, string>();
  const width = 3;
  const inOrder = [...releases].filter(isHouseRelease).sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
  let n = 0;
  for (const r of inOrder) {
    n += 1;
    map.set(r.slug, r.catalogNumber ?? `${site.catalogPrefix}${String(n).padStart(width, "0")}`);
  }
  return map;
})();

export function catalogNumber(release: Release): string | undefined {
  if (release.catalogNumber) return release.catalogNumber;
  if (!site.catalogPrefix) return undefined;
  return catalog.get(release.slug);
}

export interface StreamLink {
  service: StreamingService;
  label: string;
  href: string;
}

const SERVICE_ORDER: StreamingService[] = [
  "spotify",
  "apple",
  "youtubeMusic",
  "bandcamp",
  "youtube",
  "soundcloud",
  "tidal",
  "deezer",
  "amazon",
];

/** Only well-formed https links, in a stable display order. */
export function streamLinks(release: Release): StreamLink[] {
  const links = release.links ?? {};
  return SERVICE_ORDER.flatMap((service) => {
    const href = links[service];
    return href && /^https?:\/\//i.test(href) ? [{ service, label: STREAMING_SERVICE_LABELS[service], href }] : [];
  });
}

// Dev-time sanity checks. Never throws — a content typo shouldn't take the site down.
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  const artistSlugs = new Set(artists.map((a) => a.slug));
  for (const r of releases) {
    if (seen.has(r.slug)) console.warn(`[content] duplicate release slug "${r.slug}"`);
    seen.add(r.slug);
    if (!/^[a-z0-9-]+$/.test(r.slug)) console.warn(`[content] release slug "${r.slug}" should be lowercase-hyphenated`);
    if (!artistSlugs.has(r.artist)) console.warn(`[content] release "${r.slug}" points at unknown artist "${r.artist}"`);
    if (r.releaseDate && Number.isNaN(new Date(r.releaseDate).getTime())) console.warn(`[content] release "${r.slug}" has an invalid releaseDate`);
    // House style: record and song titles are allcaps.
    if (r.title !== r.title.toUpperCase()) console.warn(`[content] release title "${r.title}" should be allcaps`);
    for (const t of r.tracks ?? []) {
      if (t.title !== t.title.toUpperCase()) console.warn(`[content] track title "${t.title}" on "${r.slug}" should be allcaps`);
    }
  }
}
