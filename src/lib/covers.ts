import manifest from "@/content/covers.generated.json";
import type { Artist, Release } from "@/content/types";

/**
 * Resolves artwork: an explicit `cover` / `coverVideo` (or `image` /
 * `imageVideo` on an artist) in the content files wins, otherwise the assets
 * produced by `npm run covers` for a matching slug are used. Everything is
 * optional — a release or artist with no artwork at all still renders (with
 * a colored fallback tile).
 */

export interface CoverVideo {
  mp4: string;
  webm?: string;
  /** Small silent variant for cards. */
  mp4Small?: string;
  hasAudio?: boolean;
  duration?: number;
}

export interface CoverMedia {
  poster?: string;
  video?: CoverVideo;
}

interface ManifestEntry {
  poster: string;
  mp4: string;
  webm?: string;
  mp4Small?: string;
  hasAudio?: boolean;
  duration?: number;
}

interface Manifest {
  generatedAt: string;
  /** Artist key art, keyed by artist slug. */
  artists: Record<string, ManifestEntry>;
  /** Release covers, keyed by release slug. */
  covers: Record<string, ManifestEntry>;
}

const data = manifest as unknown as Manifest;

function toVideo(entry: ManifestEntry | null | undefined): CoverVideo | undefined {
  if (!entry?.mp4) return undefined;
  return { mp4: entry.mp4, webm: entry.webm, mp4Small: entry.mp4Small, hasAudio: entry.hasAudio, duration: entry.duration };
}

export function getCoverMedia(release: Pick<Release, "slug" | "cover" | "coverVideo">): CoverMedia {
  const generated = data.covers?.[release.slug];
  return {
    poster: release.cover ?? generated?.poster,
    video: release.coverVideo ?? toVideo(generated),
  };
}

export function getArtistMedia(artist: Pick<Artist, "slug" | "image" | "imageVideo">): CoverMedia {
  const generated = data.artists?.[artist.slug];
  return {
    poster: artist.image ?? generated?.poster,
    video: artist.imageVideo ?? toVideo(generated),
  };
}
