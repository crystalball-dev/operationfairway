/**
 * Content types. Everything editable about the site lives in src/content/*.ts
 * and conforms to these shapes. Optional fields may be omitted or left empty;
 * every component treats missing data as "don't render that bit", never as an
 * error.
 */

export type StreamingService =
  | "spotify"
  | "apple"
  | "youtubeMusic"
  | "bandcamp"
  | "youtube"
  | "soundcloud"
  | "tidal"
  | "deezer"
  | "amazon";

export const STREAMING_SERVICE_LABELS: Record<StreamingService, string> = {
  spotify: "Spotify",
  apple: "Apple Music",
  youtubeMusic: "YouTube Music",
  bandcamp: "Bandcamp",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
  tidal: "Tidal",
  deezer: "Deezer",
  amazon: "Amazon Music",
};

export type ReleaseType = "single" | "ep" | "album" | "remix" | "mixtape" | "live";

export interface Track {
  /** House style: song titles are allcaps, e.g. "THE HILLS". */
  title: string;
  /** "3:42" style display string. */
  duration?: string;
  /** Optional short preview clip (mp3/m4a/ogg) — local under /public or absolute URL. */
  previewUrl?: string;
  featuring?: string;
}

/** Web-ready animated cover or key art, as produced by `npm run covers`. */
export interface CoverVideo {
  mp4: string;
  webm?: string;
  /** Small silent variant for cards. */
  mp4Small?: string;
  hasAudio?: boolean;
  /** Seconds. */
  duration?: number;
}

/** A music video for a release, embedded on its page. */
export interface ReleaseVideo {
  /**
   * Anything YouTube gives you: the share link, the address bar, or a bare
   * id. `youTubeId` normalizes it, and an unparseable value hides the video
   * rather than rendering an empty player.
   */
  youtube: string;
  /** House style: song titles are allcaps, e.g. "SNOW WHITE". */
  title: string;
  /** Optional line under the title, e.g. "Official video". */
  note?: string;
  /** Local poster under /public. Defaults to YouTube's own thumbnail. */
  poster?: string;
}

/**
 * A hand-set color world. Artists without key art (or with art that reads
 * badly when quantized) can pin their palette here instead of having it
 * extracted. Every value is a hex color; `mode` decides the blob blend and
 * the browser's color-scheme.
 */
export interface BrandPalette {
  mode: "dark" | "light";
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  /** Text color to use on top of `accent`. */
  accentFg: string;
  accent2: string;
  accent3: string;
}

/**
 * A track that lives on SoundCloud rather than in a release. Listed on the
 * artist page behind a click-to-load player; nothing loads until someone
 * taps play.
 */
export interface ArtistTrack {
  /** As titled on SoundCloud. Working titles keep their case; finished songs are allcaps like everything else. */
  title: string;
  /** Public https://soundcloud.com/… track URL. Anything else is dropped. */
  url: string;
  /** Shown under the title, e.g. "2013". */
  year?: string;
  note?: string;
  /** Artwork URL. SoundCloud's own "-t500x500.jpg" links work; a failed load just hides it. */
  artwork?: string;
}

export interface Artist {
  /** URL segment: /artists/[slug]. Lowercase, hyphenated. Must match the artist folder in _ANIMATIONS for key art to be picked up. */
  slug: string;
  /**
   * The name exactly as the artist writes it. Nothing forces a case, so
   * "ojinyx" stays lowercase and "Random Thoth" keeps its capitals.
   */
  name: string;
  /** One line under the name on the roster and the artist page. */
  tagline?: string;
  /** Bio paragraphs. */
  bio?: string[];
  genres?: string[];
  /**
   * Square key art (portrait, wordmark, whatever represents them). Defaults to
   * the poster produced by `npm run covers` from _ANIMATIONS/<ARTIST>/MAIN.
   * "/artists/x.jpg" under /public or an absolute https URL.
   */
  image?: string;
  /** Animated key art override. Defaults to the clip imported by `npm run covers`. */
  imageVideo?: CoverVideo;
  /** Pin the color world instead of extracting it from `image`. */
  palette?: BrandPalette;
  /** The artist's own site, linked from their page. */
  website?: string;
  /** Streaming and social profiles. Entries with an empty href are dropped. */
  socials?: SocialLink[];
  /**
   * Selected tracks hosted on SoundCloud, for artists whose music lives there
   * rather than in releases. Shown on the artist page as click-to-load players.
   */
  tracks?: ArtistTrack[];
  /** Pin this artist to the front of the roster. Only the first featured artist wins. */
  featured?: boolean;
  /** Year they joined the label, shown on the roster. */
  since?: string;
}

export interface Release {
  /**
   * URL segment: /releases/[slug]. Lowercase, hyphenated, unique across the
   * whole label. Must match the slugified album folder in
   * _ANIMATIONS/<ARTIST>/<ALBUM>/DONE for artwork to be picked up
   * automatically ("WAR ON DRUGS" → "war-on-drugs").
   */
  slug: string;
  /** House style: record titles are allcaps, e.g. "KINGDOMS". */
  title: string;
  /** Slug of the artist in src/content/artists.ts. */
  artist: string;
  type: ReleaseType;
  /** ISO date, e.g. "2026-03-14". Drives ordering (newest first); omit for "TBA", which sorts to the top. */
  releaseDate?: string;
  /**
   * Pin this release to the top of the discography and to the home page
   * slot. Use when two records share a release date and one should lead.
   * Only the first featured release wins.
   */
  featured?: boolean;
  /** Poster override. Defaults to the frame extracted by `npm run covers`. "/covers/x.jpg" under /public or an absolute https URL. */
  cover?: string;
  /** Animated cover override. Defaults to the clip imported by `npm run covers`. */
  coverVideo?: CoverVideo;
  /** Short blurb shown on the release page. */
  description?: string;
  tracks?: Track[];
  /** Streaming / store URLs. Omit a service to hide its button. */
  links?: Partial<Record<StreamingService, string>>;
  /** Music videos, shown above the tracklist. Omit for releases without one. */
  videos?: ReleaseVideo[];
  /** Universal smart link (e.g. song.link / linktr.ee) used as the fallback CTA. */
  smartLink?: string;
  credits?: string[];
  /** Imprint. Defaults to site.name (OPERATION FAIRWAY); set only for releases that came out elsewhere. */
  label?: string;
  /** Pins a catalog number. Otherwise one is assigned in release order (see lib/releases.ts). */
  catalogNumber?: string;
}

export interface MerchItem {
  id: string;
  name: string;
  /** Slug of the artist it belongs to, or omit for label merch. */
  artist?: string;
  /** Short format line under the name, e.g. "CD", "Vinyl LP", "Tee". */
  detail?: string;
  /** Display price string, e.g. "$8". */
  price?: string;
  image?: string;
  /** External checkout URL (Kunaki, Amazon, Bandcamp…). */
  url?: string;
  available?: boolean;
  /** Sizes or options, shown after `detail`. */
  variants?: string[];
}

export interface SocialLink {
  label: string;
  href: string;
}
