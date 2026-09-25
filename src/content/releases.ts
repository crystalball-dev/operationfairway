import type { Release } from "./types";

/**
 * Discography, across the whole roster.
 * ─────────────────────────────────────────────────────────────────────────
 * House style: record and song titles are ALWAYS allcaps ("KINGDOMS",
 * "THE HILLS"). Everything is released through OPERATION FAIRWAY, which is
 * applied automatically — only set `label` on a release that came out
 * somewhere else. `artist` is the slug from artists.ts.
 *
 * Catalog numbers are assigned automatically in release order (oldest
 * first); pin one with `catalogNumber` if the real one differs.
 *
 * Artwork comes from `npm run covers`, which maps each
 * _ANIMATIONS/<ARTIST>/<ALBUM> folder to a slug. THE HILLS artwork lives in
 * a folder named BUNNY, after its lead track — see ALBUM_SLUGS in
 * scripts/import-covers.mjs.
 */
export const releases: Release[] = [
  // ── ojinyx ──────────────────────────────────────────────────────────────
  {
    slug: "kingdoms",
    title: "KINGDOMS",
    artist: "ojinyx",
    type: "album",
    releaseDate: "2026-09-11",
    // Shares a release date with THE HILLS; this one leads.
    featured: true,
    links: {
      spotify: "https://open.spotify.com/album/5AAZG5ZaXWhadOu63Vlmaj",
      apple: "https://music.apple.com/album/kingdoms/6810581906",
      youtubeMusic: "https://music.youtube.com/browse/MPREb_pArK3N0e0dO",
    },
    videos: [
      {
        youtube: "https://www.youtube.com/watch?v=5b_eGQbQhGM",
        title: "SNOW WHITE",
        note: "Official video",
      },
    ],
    tracks: [
      { title: "SNOW WHITE", duration: "3:25" },
      { title: "WIPED OUT", duration: "2:29" },
      { title: "XION", duration: "4:04" },
      { title: "EXCALIPOOR", duration: "4:10" },
      { title: "BLACK EELS", duration: "5:11" },
      { title: "BLAZE IT UP", duration: "2:58" },
      { title: "GOBLIN$", duration: "2:42" },
      { title: "MANDATORY SAFETY MEETING", duration: "2:59" },
      { title: "STAR PLATINUM", duration: "3:12" },
      { title: "MOONSUGAR", duration: "4:44" },
      { title: "KALT", duration: "5:52" },
      { title: "SCALES", duration: "3:53" },
      { title: "STFU I'M ON THE RADIO", duration: "3:12" },
      { title: "HOLLOW", duration: "2:13" },
      { title: "LOTR", duration: "4:55" },
      { title: "THE SERPENT TRENCH", duration: "3:07" },
      { title: "NIGHT", duration: "4:30" },
    ],
  },
  {
    slug: "the-hills",
    title: "THE HILLS",
    artist: "ojinyx",
    type: "ep",
    releaseDate: "2026-09-11",
    links: {
      spotify: "https://open.spotify.com/album/6KEb8NDHgixY5zzOX48Qr8",
      apple: "https://music.apple.com/album/the-hills-ep/6810909398",
      youtubeMusic: "https://music.youtube.com/browse/MPREb_P78nMAS4uNW",
    },
    tracks: [
      { title: "BUNNY", duration: "3:12" },
      { title: "GOLD", duration: "3:30" },
      { title: "DUI", duration: "3:24" },
      { title: "DAMN THE TORPEDOES", duration: "1:46" },
    ],
  },
  {
    slug: "ojinyx",
    title: "OJINYX",
    artist: "ojinyx",
    type: "album",
    releaseDate: "2024-05-10",
    links: {
      spotify: "https://open.spotify.com/album/3SOsbi5Cv2eAvILg31NaT5",
      apple: "https://music.apple.com/album/ojinyx/1743579477",
      youtubeMusic: "https://music.youtube.com/browse/MPREb_yndQKlEHDrb",
    },
    tracks: [
      { title: "PARADISE", duration: "2:41" },
      { title: "GRAVITY", duration: "3:17" },
      { title: "STALK", duration: "3:42" },
      { title: "XIII", duration: "5:29" },
      { title: "SIX", duration: "3:29" },
      { title: "ISOLATED", duration: "3:12" },
      { title: "WHEN I'M UP", duration: "4:39" },
      { title: "NEVER", duration: "3:27" },
    ],
  },
  {
    slug: "war-on-drugs",
    title: "WAR ON DRUGS",
    artist: "ojinyx",
    type: "ep",
    releaseDate: "2024-04-12",
    links: {
      spotify: "https://open.spotify.com/album/1Sjdy76DHjW3RRbc2YPXTB",
      apple: "https://music.apple.com/album/war-on-drugs-ep/1738759827",
      youtubeMusic: "https://music.youtube.com/browse/MPREb_Lxi10OWPsM0",
    },
    tracks: [
      { title: "MIND EXPANDING", duration: "3:01" },
      { title: "WAR ON DRUGS", duration: "1:50" },
      { title: "KILL ALL HUMANS", duration: "3:34" },
      { title: "ALL HUMANS ARE VERMIN IN THE EYES OF MORBO", duration: "2:31" },
    ],
  },

  // ── Random Thoth ────────────────────────────────────────────────────────
  // TODO(label): add releases as `{ slug, title, artist: "random-thoth", … }`.

  // ── the minimal musketeer ───────────────────────────────────────────────
  // TODO(label): add releases as `{ slug, title, artist: "the-minimal-musketeer", … }`.
];
