import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import type { Artist } from "@/content/types";
import { getArtistTheme } from "@/lib/artist-theme";
import { getArtistMedia } from "@/lib/covers";
import { longestWord, releasesByArtist } from "@/lib/releases";
import { paletteVars } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { CoverMedia } from "./cover-media";

const TILTS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

interface ArtistCardProps {
  artist: Artist;
  index?: number;
  priority?: boolean;
}

/**
 * Roster card, themed by the artist's own color world so the roster reads as
 * a row of distinct places. Key art plays on hover (or while in view on touch
 * screens) and carries a view-transition name that matches the artist page
 * hero, so it morphs across navigation.
 */
export async function ArtistCard({ artist, index = 0, priority = false }: ArtistCardProps) {
  const media = getArtistMedia(artist);
  const { palette, cover } = await getArtistTheme(artist);
  const records = releasesByArtist(artist.slug);
  const count = records.length;
  const meta = [artist.genres?.[0], artist.since ? `since ${artist.since}` : undefined].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group block h-full outline-none"
      style={paletteVars(palette)}
      aria-label={`${artist.name} — ${count} ${count === 1 ? "release" : "releases"}`}
    >
      <article
        className={cn(
          "shadow-hard-sm flex h-full flex-col gap-4 bg-bg p-4 text-fg transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:rotate-0 group-focus-visible:rotate-0 group-focus-visible:ring-4 group-focus-visible:ring-accent",
          TILTS[index % TILTS.length],
        )}
      >
        <ViewTransition name={`artist-${artist.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-black/20" style={{ containerType: "inline-size" }}>
            <CoverMedia
              poster={media.poster}
              video={media.video}
              mode="hover"
              small
              alt={`${artist.name} key art`}
              fallbackLabel={artist.name}
              blurDataURL={cover.blurDataURL}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              priority={priority}
            />
            <span className="label absolute left-3 top-3 -rotate-3 bg-accent px-2 py-1 text-accent-fg" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </ViewTransition>
        <div style={{ containerType: "inline-size" }}>
          <h3
            className="display fit-title"
            style={{ "--letters": longestWord(artist.name), "--fit-max": "3rem" } as CSSProperties}
          >
            {artist.name}
          </h3>
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="label text-muted">{meta || " "}</span>
          <span className="label whitespace-nowrap">
            {count} {count === 1 ? "release" : "releases"}
          </span>
        </div>
        <div className="flex h-2 gap-1" aria-hidden="true">
          {palette.swatches.slice(0, 6).map((hex, i) => (
            <span key={`${hex}-${i}`} className="flex-1" style={{ background: hex }} />
          ))}
        </div>
      </article>
    </Link>
  );
}
