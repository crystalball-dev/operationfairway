import { artists } from "@/content/artists";
import { releases } from "@/content/releases";
import type { Artist, Release } from "@/content/types";
import { releaseYear } from "./releases";

/**
 * Roster order: a `featured` artist leads, everyone else keeps the order in
 * artists.ts.
 */
export const sortedArtists: Artist[] = (() => {
  const list = [...artists];
  const i = list.findIndex((a) => a.featured);
  if (i <= 0) return list;
  const [featured] = list.splice(i, 1);
  return [featured, ...list];
})();

export function getArtist(slug: string): Artist | undefined {
  return artists.find((a) => a.slug === slug);
}

export function artistOf(release: Pick<Release, "artist">): Artist | undefined {
  return getArtist(release.artist);
}

/** Display name for a release's artist; falls back to the slug so a typo is visible, not invisible. */
export function artistName(release: Pick<Release, "artist">): string {
  return artistOf(release)?.name ?? release.artist;
}

/** Neighbors on the roster. `prev` is earlier in the list, `next` later. */
export function adjacentArtists(slug: string): { prev?: Artist; next?: Artist } {
  const i = sortedArtists.findIndex((a) => a.slug === slug);
  if (i === -1) return {};
  return { prev: sortedArtists[i - 1], next: sortedArtists[i + 1] };
}

/** The label's first release year, from the discography. Undefined until something is dated. */
export const labelSince: string | undefined = (() => {
  const years = releases.map((r) => releaseYear(r.releaseDate)).filter((y) => /^\d{4}$/.test(y));
  return years.length ? years.sort()[0] : undefined;
})();

/** Only well-formed https profiles. */
export function artistSocials(artist: Artist) {
  return (artist.socials ?? []).filter((s) => /^https?:\/\//i.test(s.href));
}

// Dev-time sanity checks. Never throws.
if (process.env.NODE_ENV !== "production") {
  const seen = new Set<string>();
  for (const a of artists) {
    if (seen.has(a.slug)) console.warn(`[content] duplicate artist slug "${a.slug}"`);
    seen.add(a.slug);
    if (!/^[a-z0-9-]+$/.test(a.slug)) console.warn(`[content] artist slug "${a.slug}" should be lowercase-hyphenated`);
    if (!a.name.trim()) console.warn(`[content] artist "${a.slug}" has no name`);
  }
}
