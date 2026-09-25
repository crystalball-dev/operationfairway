import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";

const FONT_FILE = path.join(process.cwd(), "src", "brand", "fonts", "Unbounded-Black.ttf");

let pending: Promise<ArrayBuffer | undefined> | undefined;

/**
 * The display face for social cards, read once per build worker. Resolves to
 * undefined if the file can't be read, so a card still renders in the
 * renderer's default face rather than failing the build.
 */
function loadDisplayFont(): Promise<ArrayBuffer | undefined> {
  pending ??= readFile(FONT_FILE)
    .then((buf) => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer)
    .catch((err: unknown) => {
      console.warn(`[og] display font unavailable (${err instanceof Error ? err.message : String(err)}); using the default face`);
      return undefined;
    });
  return pending;
}

/** `fonts` option for `ImageResponse`. Empty when the font can't be loaded. */
export async function ogFonts() {
  const data = await loadDisplayFont();
  return data ? [{ name: "Unbounded", data, weight: 900 as const, style: "normal" as const }] : [];
}

/** Font stack for OG markup: the loaded face first, then whatever Satori has. */
export const OG_FONT_FAMILY = "Unbounded, Geist, sans-serif";

/**
 * Unbounded Black runs wide (about 0.8 em per glyph), and a single long word
 * can't wrap. Size a line so its longest word fits `maxWidth`, capped at
 * `maxSize`.
 */
export function fitFontSize(text: string, maxWidth: number, maxSize: number, minSize = 28): number {
  const longest = Math.max(4, ...text.split(/\s+/).map((w) => w.length));
  return Math.max(minSize, Math.min(maxSize, Math.floor(maxWidth / (longest * 0.8))));
}

/**
 * The roundel as a data-URL SVG (the same drawing as src/brand/mark.tsx, with
 * the color baked in). The OG renderer rasterizes images through resvg, which
 * honors the mask that cuts the fairway through the ring, whereas its own
 * SVG element support does not.
 */
export function ogMark(size: number, color: string) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<mask id="c" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">` +
    `<rect width="100" height="100" fill="#fff"/>` +
    `<rect x="-30" y="41" width="160" height="18" fill="#000" transform="rotate(-40 50 50)"/>` +
    `</mask>` +
    `<circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="15" mask="url(#c)"/>` +
    `<circle cx="50" cy="50" r="7" fill="${color}"/>` +
    `</svg>`;
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={size} height={size} alt="" style={{ width: size, height: size }} />;
}
