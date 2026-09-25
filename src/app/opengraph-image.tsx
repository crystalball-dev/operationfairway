import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";
import { OG_FONT_FAMILY, ogFonts, ogMark } from "@/lib/og";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Site-wide social card: the stacked name over brand color, roster underneath. */
export default async function Image() {
  const fonts = await ogFonts();
  const words = site.name.split(/\s+/);
  const roster = sortedArtists.map((a) => a.name).join("   ·   ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "#090a07",
          color: "#f4f2e8",
          fontFamily: OG_FONT_FAMILY,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: -140, top: -220, width: 640, height: 640, borderRadius: 9999, background: "#2f5cff", opacity: 0.7 }} />
        <div style={{ position: "absolute", right: -160, top: -60, width: 560, height: 560, borderRadius: 9999, background: "#ffd400", opacity: 0.6 }} />
        <div style={{ position: "absolute", right: 260, bottom: -320, width: 620, height: 620, borderRadius: 9999, background: "#ff3d1f", opacity: 0.55 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {ogMark(64, "#f4f2e8")}
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#ffd400" }}>INDEPENDENT RECORD LABEL</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 118, fontWeight: 900, lineHeight: 0.9, letterSpacing: -5 }}>
          {words.map((w) => (
            <div key={w} style={{ display: "flex" }}>
              {w}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 30 }}>{site.tagline}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#a5a697", textAlign: "right" }}>{roster}</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
