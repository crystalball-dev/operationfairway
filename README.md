# OPERATION FAIRWAY — label site

Record label site for **OPERATION FAIRWAY**: the roster (ojinyx, Random Thoth, the minimal musketeer), every release across it, merch and contact. Next.js 16 (App Router), deployed on Vercel at `operationfairway.org`. Built from the ojinyx artist site and sharing its design system, so the label and its artists read as one family.
Loud on the surface, boring underneath: static pages, compositor-only animation, one native module at build time.

## House style

Three rules, applied everywhere:

| Rule | Example |
| --- | --- |
| The label name is **always allcaps** | `OPERATION FAIRWAY` |
| Record and song titles are **always allcaps** | `KINGDOMS`, `THE HILLS`, `MARCH TO THE ACID STAR SHIP` |
| Each artist's name keeps **the case they use** | `ojinyx`, `Random Thoth`, `the minimal musketeer` |

The CSS does not force a case anywhere, so what you type in `src/content/` is what renders. `npm run dev` prints a console warning if a release or track title breaks the allcaps rule, or if a release points at an artist that doesn't exist.

## The idea

The label is the frame; every artist brings their own color world. The site's own palette is olive-black, hazard yellow, signal red and deep blue, set in Unbounded with mono micro-type (catalog numbers, dates, section labels). Each artist page and release page re-themes itself from that artist's pinned palette or, by default, from the artwork, so the roster and the discography read as a wall of distinct places. Catalog numbers (`OF001`, `OF002`, …) are assigned automatically in release order.

## Stack and why

| Concern | Choice | Reason |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Turbopack) | First-class on Vercel: static generation, image CDN, OG image generation, all zero-config. |
| Styling | **Tailwind CSS 4** + a few `@utility` rules | Tiny CSS output; the whole theme is CSS custom properties, so re-theming a page is one inline `style`. |
| Motion | **No animation library.** CSS keyframes/transitions plus two small hooks (IntersectionObserver reveals, rAF pointer tilt) | Everything ambient (blobs, marquee, hero entrance, scroll-driven parallax, reveals) runs on the compositor and costs zero JS on an idle page. |
| Page transitions | React `<ViewTransition>` | Key art and covers morph from card → page using the browser View Transitions API. No library, degrades to an instant swap. |
| Audio | SoundCloud's official widget behind a click-to-load facade | For artists whose music lives on SoundCloud. The iframe (~1 MB of third-party JS) only loads after a tap, never on first paint. |
| Color extraction | **sharp** (already a Next.js dependency) + a small median-cut quantizer + OKLCH math in `src/lib` | Runs once per artist and release at build time on the poster frame. No client-side extraction, no extra runtime dependency. |
| Animated artwork | **ffmpeg** at import time (`npm run covers`), native `<video>` at runtime | Finished clips in `_ANIMATIONS/<ARTIST>/<ALBUM>/DONE` become H.264 (+ VP9 when it's smaller) at 1080² plus a silent 720² card variant and a poster frame. Reduced motion and data-saver get the poster only. |
| Brand mark | The roundel (`src/brand/mark.tsx`): a ring cut by a diagonal fairway, dot at the center | Inline SVG inherits `currentColor`, so it works inside the difference-blended nav, on themed pages and in OG cards. `src/app/icon.svg` is the same mark on a rounded square; `npm run icons` rasterizes it. The wordmark is type, not a drawing (`src/brand/wordmark.tsx`). |
| Fonts | `next/font/google`: **Unbounded** (display) + **Space Grotesk** (body) + **Space Mono** (micro-type) | Self-hosted at build, `font-display: swap`, no request to Google from the browser. A static copy of Unbounded Black under `src/brand/fonts` feeds the OG cards. |
| Analytics | `@vercel/analytics` + `@vercel/speed-insights` | No-ops locally; real-user Core Web Vitals in production. |

No WebGL, no canvas loops, no scroll-jacking. Every continuous animation touches only `transform`/`opacity`.

## Content model

Everything editable lives in `src/content/`:

- **`artists.ts`** — the roster. Name (in the artist's own case), tagline, bio, genres, `website`, `socials`, optional pinned `palette`, optional `image`/`imageVideo` overrides, and `tracks` for music hosted on SoundCloud (each becomes a click-to-load player on the artist page). `featured: true` pins an artist to the front; `since` shows the year they joined.
- **`releases.ts`** — every record across the label, each with `artist: "<slug>"`. Dates, tracklists, streaming links, videos, credits. Undated releases show "Coming soon" and sort to the top. `featured: true` decides which of two same-day records leads. Set `label` only on a record that came out elsewhere; set `catalogNumber` to pin one.
- **`merch.ts`** — one entry per product, each linking to where it is sold, with an optional `artist`.
- **`site.ts`** — label name, legal name, URL, tagline, bio, location, email, contact copy, catalog prefix, storefront button, socials, nav, privacy date.

The brand is plain `OPERATION FAIRWAY` everywhere a visitor reads it. The company name from the Alaska filing (`site.legalName`, "OPERATION FAIRWAY, LLC") appears only where the law cares: the copyright line in the footer and the Organization structured data, which also carries the formation date, the NAICS code and a city-level address. The registered street address is a home and is deliberately not on the site; `site.address` stops at city, state and country.
- **`covers.generated.json`** — the artwork manifest written by `npm run covers`. Commit it.

## Artwork pipeline: `_ANIMATIONS` → site

Source clips live in `_ANIMATIONS/` (git-ignored). The convention is artist first, then record:

```
_ANIMATIONS/
  ojinyx/MAIN/DONE/*.mp4                → /artists/ojinyx key art (poster + clip)
  ojinyx/KINGDOMS/DONE/*.mp4            → /releases/kingdoms
  ojinyx/WAR ON DRUGS/DONE/*.mp4        → /releases/war-on-drugs   (folder name is slugified)
  random-thoth/MAIN/DONE/*.mp4          → /artists/random-thoth key art
  <ARTIST>/<ALBUM>/DONE/poster.jpg      → optional: use this still instead of a frame from the clip
```

`npm run covers` (needs ffmpeg + ffprobe on PATH, or `npm i -D ffmpeg-static ffprobe-static`) takes the newest `.mp4` in each `DONE` folder and writes, with a content hash in the name so they can be cached forever:

- `public/covers/<slug>.<hash>.mp4` — 1080², H.264, audio kept
- `public/covers/<slug>.<hash>.webm` — VP9, only kept when it beats the MP4 by 15 %+
- `public/covers/<slug>-sm.<hash>.mp4` — 720², silent, for cards
- `public/covers/<slug>.<hash>.jpg` — poster frame (the palette, OG card and no-JS fallback all come from this)
- `public/artists/<artist>.<hash>.*` — same set for key art
- `src/content/covers.generated.json` — the manifest the site reads

Commit the generated files; they are the deployable assets. A release picks up its artwork automatically when its `slug` matches the slugified folder name; an artist picks up key art when their `slug` matches the artist folder. Where a folder is named after the image rather than the record, map it in `ALBUM_SLUGS` in the import script — that is how `BUNNY/` becomes `/releases/the-hills`.

The ojinyx covers and key art in this repo were imported from the ojinyx site with their original hashes, so re-running the import against the same masters produces identical filenames.

## How the artwork → palette theming works

`src/lib/palette.ts`, called from server components at build:

1. Load the poster frame from `/public` (or an `https://` URL).
2. sharp downsamples it to ≤ 64 px and hands back raw RGB.
3. Median-cut quantization → 8 color boxes with pixel share (deterministic, so builds are stable).
4. Score boxes: the most populous is *dominant*; the best chroma × population is *vibrant*; two more accents are picked for hue distance (or synthesized by hue rotation).
5. In OKLCH, derive `bg`, `fg`, `muted`, `accent`, `accent2`, `accent3`. Bright artwork gets a light theme, dark artwork a dark one. Every text/accent color is nudged until it clears WCAG contrast against `bg` (7:1 body, 4.5:1 muted, 3:1 accents).
6. A 16 px WebP blur placeholder is generated in the same pass for `next/image`.

An artist with `palette` set in `artists.ts` skips steps 3–5 and uses those colors as written (ojinyx uses the brand colors from ojinyx.com; Random Thoth's placeholder art is grayscale). The result is written as CSS custom properties on a wrapper (`<PaletteScope>`), so every Tailwind token (`bg-bg`, `text-accent`, …) re-resolves inside it. Blobs, marquee, buttons, `<meta name="theme-color">` and the Open Graph card all use the same palette.

**If anything fails** (missing file, corrupt image, network) the label palette is used and a warning is logged at build. The page still renders.

## Error handling

- **Artwork** — `CoverImage` swaps to a palette-colored tile with the name or title on load error or missing `src`; layouts never collapse.
- **Palette extraction** — never throws; falls back to the label palette (see above).
- **Streaming links** — only well-formed `https` links render; a release with none shows "Not on streaming services yet."
- **SoundCloud tracks** — only `soundcloud.com` URLs get a player; the player iframe is behind a click-to-load facade with a 12 s timeout and an "open on SoundCloud" escape hatch; each embed sits inside a client `ErrorBoundary`.
- **YouTube videos** — same facade pattern; an unparseable URL hides the video rather than rendering an empty player.
- **Contact form** — server-side validation, honeypot, best-effort rate limit; if mail isn't configured (no `RESEND_API_KEY`) or delivery fails the visitor gets a prefilled `mailto:` link so nothing is lost.
- **Routes** — `not-found.tsx`, `error.tsx` (keeps nav/footer, offers retry) and `global-error.tsx` (self-contained, no dependencies).

## Project layout

```
src/
  app/                    routes (App Router)
    page.tsx              home: hero, ticker, roster, latest release, discography strip, about, tiles
    artists/              index + [slug] page + per-artist opengraph-image
    releases/             index + [slug] page + per-release opengraph-image
    merch/  contact/
    privacy/              plain-words privacy page; keep it in step with what the code does
    api/contact/route.ts  form delivery (Resend REST API)
    opengraph-image.tsx   site-wide social card
    robots.ts sitemap.ts manifest.ts icon.svg apple-icon.png
    error.tsx global-error.tsx not-found.tsx
    globals.css           tokens, utilities, keyframes
  brand/
    mark.tsx              the roundel (inline SVG)
    wordmark.tsx          the name in the display face, inline or stacked
    fonts/                Unbounded Black, for OG cards and scripts
  components/             UI (server components unless marked "use client")
    hero-title.tsx        letter-by-letter hero name
    artist-card.tsx       roster card, themed by the artist's palette
    release-card.tsx      discography card, themed by the cover
    palette-scope.tsx     scopes a palette to a subtree
    cover-media.tsx       poster + animated artwork (autoplay / in-view / hover, sound toggle)
    soundcloud-embed.tsx  click-to-load SoundCloud player
    label-badge.tsx       rotating OPERATION FAIRWAY stamp
  content/                ← ALL editable content: site.ts artists.ts releases.ts merch.ts
    covers.generated.json manifest written by `npm run covers`
  lib/
    color.ts              OKLab/OKLCH + WCAG math (pure)
    palette.ts            artwork → theme (server only, sharp)
    artist-theme.ts       pinned palette or extracted, per artist (server only)
    artists.ts releases.ts covers.ts soundcloud.ts youtube.ts og.tsx theme.ts utils.ts
public/
  artists/                key art (poster + clip per artist)
  covers/                 release covers (poster + clips)
  brand/                  512px icon
  merch/                  product shots
scripts/
  import-covers.mjs       _ANIMATIONS → public/covers + public/artists + manifest (ffmpeg)
  make-icons.mjs          icon.svg → apple-icon.png + icon-512.png (sharp)
_ANIMATIONS/              source clips (git-ignored)
```

## Editing content

Everything marked `TODO(label)` in `src/content/` is placeholder or unconfirmed.

- **Add an artist**: add an entry to `src/content/artists.ts`. Drop key art in `_ANIMATIONS/<artist>/MAIN/DONE/` and run `npm run covers`, or set `image` to a content-hashed file under `/public/artists`. Leave `palette` off to theme from the art, or pin one.
- **Add a release**: put the finished clip in `_ANIMATIONS/<ARTIST>/<ALBUM>/DONE/`, run `npm run covers`, add an entry with the matching slug and `artist` to `src/content/releases.ts`. The page, theme, OG image, catalog number and sitemap entry are generated. Titles go in allcaps. Leave `releaseDate` off until it's announced; undated releases show "Coming soon" and sort to the top.
- **SoundCloud-only music**: add `tracks` to the artist (title, URL, year, optional artwork URL). Anything that isn't a `soundcloud.com` URL is dropped.
- **Merch**: `src/content/merch.ts`, one entry per product, each linking to where it is sold, with `artist` set to the slug it belongs to. Store product photos can go in as-is, white background and all: the card sets them on a light panel and blends the white away. Give image filenames a content hash, since `/merch` is cached immutably.
- **Label bio, tagline, email, socials, contact copy**: `src/content/site.ts`. Set `catalogPrefix` to `""` to hide catalog numbers.

What is still placeholder, as of the first build:

- `hello@operationfairway.org` as the contact inbox, and the label's own social profiles (all empty, so the "Elsewhere" blocks show "Links coming soon").
- Random Thoth and the minimal musketeer: key art is a 500² SoundCloud image each. Neither has a release on the label yet, so their pages lead with their SoundCloud tracks.
- Per-release descriptions.

## Local development

```bash
npm install
npm run dev
```

Other scripts: `npm run build` (production build + type check), `npm run lint`, `npm run typecheck`, `npm run covers` (import artwork from `_ANIMATIONS`, see above), `npm run icons` (rasterize the favicon after editing `icon.svg`).

## Deploying to Vercel (repo + Cloudflare DNS)

The repo lives at [crystalball-dev/operationfairway](https://github.com/crystalball-dev/operationfairway). Let Vercel build it — see the Windows note below.

1. Push this code to the repository (the project root is the repo root; `vercel.json` just pins the framework).
2. In Vercel: **Add New → Project → Import** the repo. Framework preset is detected as Next.js. Build command `next build`, output default. Node 20+ (see `engines` in `package.json`).
3. **Environment variables** (Project → Settings → Environment Variables), from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL=https://operationfairway.org` (Production). Drives canonical URLs, sitemap and OG image URLs.
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — optional; the form degrades to `mailto:` without them.
4. **Domain**: Project → Settings → Domains → add `operationfairway.org` and `www.operationfairway.org`. Vercel shows the exact records it wants (an `A` record for the apex, a `CNAME` to `cname.vercel-dns.com` for `www`).
5. **In Cloudflare** (the domain's DNS lives there): DNS → Records → add those two records. Set both to **DNS only** (grey cloud), not Proxied. Vercel issues and renews the certificate itself; a proxied record puts Cloudflare's certificate in front of it and tends to end in redirect loops or `525` errors. If you want Cloudflare's proxy anyway, set SSL/TLS to **Full (strict)** and turn off *Always Use HTTPS* so the two edges don't fight over redirects. Delete any old Cloudflare placeholder records for the apex first, since a CNAME and an A record can't coexist on the same name.
6. Back in Vercel, set one domain as primary and let Vercel redirect the other (one toggle; no code needed). Verification usually completes within minutes at Cloudflare's TTLs.
7. Deploy. Every push to `main` builds; other branches get preview URLs.

> **Do not deploy a locally-built bundle from Windows.** `vercel deploy` builds locally on Windows and emits every serverless function as a symlink into a shared `.func` folder. Those symlinks don't survive the upload and the deploy fails with `ENOENT`. Importing the repo (or any deploy that builds on Vercel's Linux runners) sidesteps it. If you ever do need the CLI, run it from WSL or a Linux/macOS machine.

What runs where:

- All pages are **statically generated** at build (artist and release themes included).
- `/api/contact` is the only server function.
- Images go through Vercel's image CDN (AVIF/WebP, 31-day cache). `/covers/*`, `/artists/*.jpg|mp4`, `/brand/*` and `/merch/*` are served immutable; generated files carry a content hash, so re-running `npm run covers` after changing a clip produces new URLs automatically.
- Video is served as static files from `public/` (range requests work out of the box). Cards use the silent 720² variant; release pages use the full clip, which starts loading only after the poster has painted. Phones get the small variant everywhere.

## Performance notes

- Home page JS is essentially the React/Next runtime; the site's own client islands (nav, reveals, tilt, pointer glow, cover fallback, players, contact form) add a few KB. Everything else is server-rendered HTML.
- The hero entrance and parallax are CSS (`@keyframes` + `animation-timeline: scroll()` where supported), so the largest text paints on the first frame and LCP doesn't wait for hydration.
- Blobs are pre-softened radial gradients moved with `transform` only — no `filter: blur()` on large surfaces. Grain and the map grid are single static tiles.
- `prefers-reduced-motion` stops the blobs, marquees, entrance, parallax and the badge.

## Recommended next steps (not built, on purpose)

- **Proper key art** for Random Thoth and the minimal musketeer (1080² clips through `npm run covers`), which also lets their palettes be extracted rather than pinned.
- **First label releases for the new artists** — add them to `releases.ts` once they're announced; undated entries show as "Coming soon".
- **Mailing list** — one field posting to Buttondown/Resend Audiences; the contact route already has the delivery plumbing.
- **Label socials** — fill `site.socials` and the "Elsewhere" blocks light up everywhere.
- **CSP header** — once the third-party surface is final (SoundCloud, YouTube, Vercel analytics), add a Content-Security-Policy in `next.config.ts` `headers()`.
- **Vercel WAF rate limiting** on `/api/contact` if the honeypot isn't enough.
