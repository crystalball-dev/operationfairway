import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { getArtistTheme } from "@/lib/artist-theme";
import { getArtist, sortedArtists } from "@/lib/artists";
import { getArtistMedia } from "@/lib/covers";
import { OG_FONT_FAMILY, fitFontSize, ogFonts, ogMark } from "@/lib/og";
import { getCoverDataUrl } from "@/lib/palette";
import { releasesByArtist } from "@/lib/releases";

export const alt = `Artist on ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return sortedArtists.map((a) => ({ slug: a.slug }));
}

/**
 * Social card generated from the artist's own color world + key art.
 * Rendered at build; falls back to a text-only card if the art can't be read.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtist(slug);
  const name = artist?.name ?? site.name;
  const poster = artist ? getArtistMedia(artist).poster : undefined;
  const [theme, artSrc, fonts] = await Promise.all([
    artist ? getArtistTheme(artist) : undefined,
    getCoverDataUrl(poster, 560),
    ogFonts(),
  ]);
  const palette = theme?.palette;
  const bg = palette?.bg ?? "#090a07";
  const fg = palette?.fg ?? "#f4f2e8";
  const accent = palette?.accent ?? "#ffd400";
  const count = artist ? releasesByArtist(artist.slug).length : 0;
  const subtitle = [...(artist?.genres ?? []).slice(0, 2), `${count} ${count === 1 ? "release" : "releases"}`].join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: fg,
          fontFamily: OG_FONT_FAMILY,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -160, width: 520, height: 520, borderRadius: 9999, background: palette?.accent2 ?? "#ff3d1f", opacity: 0.55 }} />
        <div style={{ position: "absolute", left: -160, bottom: -220, width: 560, height: 560, borderRadius: 9999, background: palette?.accent3 ?? "#2f5cff", opacity: 0.45 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "56px 64px", width: "100%" }}>
          {artSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artSrc}
              width={518}
              height={518}
              alt=""
              style={{ width: 518, height: 518, objectFit: "cover", transform: "rotate(-3deg)", boxShadow: `18px 18px 0 ${accent}` }}
            />
          ) : (
            <div style={{ width: 518, height: 518, display: "flex", background: accent, transform: "rotate(-3deg)" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 22, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {ogMark(44, fg)}
              <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: palette?.muted ?? "#a5a697" }}>{site.name}</div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: fitFontSize(name, 490, 88),
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -3,
              }}
            >
              {name}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: palette?.muted ?? "#a5a697" }}>{subtitle}</div>
            <div
              style={{
                display: "flex",
                marginTop: 8,
                padding: "14px 28px",
                borderRadius: 9999,
                background: accent,
                color: palette?.accentFg ?? "#000000",
                fontSize: 22,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 3,
                alignSelf: "flex-start",
              }}
            >
              Artist
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
