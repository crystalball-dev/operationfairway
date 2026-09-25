import "server-only";
import type { Artist } from "@/content/types";
import { getArtistMedia } from "./covers";
import { getCoverTheme, paletteFromBrand, type CoverTheme } from "./palette";

/**
 * An artist's color world: the palette pinned in artists.ts when there is
 * one, otherwise extracted from their key art at build. The cover metadata
 * (blur placeholder, dimensions) always comes from the art. Never throws.
 */
export async function getArtistTheme(artist: Artist): Promise<CoverTheme> {
  const media = getArtistMedia(artist);
  const theme = await getCoverTheme(media.poster, artist.slug);
  if (!artist.palette) return theme;
  return { palette: paletteFromBrand(artist.palette), cover: theme.cover };
}
