import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { artistName } from "@/lib/artists";
import { getCoverMedia } from "@/lib/covers";
import { OG_FONT_FAMILY, fitFontSize, ogFonts, ogMark } from "@/lib/og";
import { getCoverDataUrl, getCoverTheme } from "@/lib/palette";
import { RELEASE_TYPE_LABEL, catalogNumber, formatReleaseDate, getRelease, releaseLabel, sortedReleases } from "@/lib/releases";

export const alt = `Release on ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return sortedReleases.map((r) => ({ slug: r.slug }));
}

/**
 * Social card generated from the release's own palette + artwork poster.
 * Rendered at build; falls back to a text-only card if the poster can't be read.
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = getRelease(slug);
  const title = release?.title ?? site.name;
  const poster = release ? getCoverMedia(release).poster : undefined;
  const [{ palette }, coverSrc, fonts] = await Promise.all([getCoverTheme(poster, slug), getCoverDataUrl(poster, 560), ogFonts()]);

  const by = release ? artistName(release) : site.name;
  const catalog = release ? catalogNumber(release) : undefined;
  const subtitle = release
    ? [catalog, RELEASE_TYPE_LABEL[release.type], release.releaseDate ? formatReleaseDate(release.releaseDate) : "Coming soon", releaseLabel(release)]
        .filter(Boolean)
        .join(" · ")
    : `${site.tagline} ${site.name}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: palette.bg,
          color: palette.fg,
          fontFamily: OG_FONT_FAMILY,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -160, width: 520, height: 520, borderRadius: 9999, background: palette.accent2, opacity: 0.55 }} />
        <div style={{ position: "absolute", left: -160, bottom: -220, width: 560, height: 560, borderRadius: 9999, background: palette.accent3, opacity: 0.45 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "56px 64px", width: "100%" }}>
          {coverSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverSrc}
              width={518}
              height={518}
              alt=""
              style={{ width: 518, height: 518, objectFit: "cover", transform: "rotate(-3deg)", boxShadow: `18px 18px 0 ${palette.accent}` }}
            />
          ) : (
            <div style={{ width: 518, height: 518, display: "flex", background: palette.accent, transform: "rotate(-3deg)" }} />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {ogMark(44, palette.fg)}
              <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: palette.muted }}>{site.name}</div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: fitFontSize(title, 490, 84),
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -3,
              }}
            >
              {title}
            </div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 900, color: palette.accent }}>{by}</div>
            <div style={{ display: "flex", fontSize: 24, color: palette.muted }}>{subtitle}</div>
            <div
              style={{
                display: "flex",
                marginTop: 6,
                padding: "14px 28px",
                borderRadius: 9999,
                background: palette.accent,
                color: palette.accentFg,
                fontSize: 22,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 3,
                alignSelf: "flex-start",
              }}
            >
              {release?.releaseDate ? "Listen now" : "Coming soon"}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
