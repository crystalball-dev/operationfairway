import type { Artist } from "./types";

/**
 * The roster.
 * ─────────────────────────────────────────────────────────────────────────
 * House style: each artist's name is written exactly as they write it.
 * Nothing in the CSS forces a case, so "ojinyx" stays lowercase and
 * "Random Thoth" keeps its capitals. Record and song titles are allcaps
 * everywhere.
 *
 * Key art comes from `npm run covers`, which reads
 * _ANIMATIONS/<ARTIST>/MAIN/DONE/*.mp4 and writes a poster plus a clip to
 * /public/artists. Set `image` to use a still instead (content-hashed
 * filename, since /artists is served immutable). Set `palette` to pin the
 * artist's color world; leave it off to extract one from the key art.
 *
 * `tracks` is for music that lives on SoundCloud rather than in a release:
 * each entry becomes a click-to-load player on the artist page.
 */
export const artists: Artist[] = [
  {
    slug: "ojinyx",
    name: "ojinyx",
    tagline: "Get lost in the Zone, stalker.",
    bio: [
      "ojinyx is an independent music project, written, recorded and self-released through OPERATION FAIRWAY. Every track is boldly experimental — crossing genre lines without regard for expectations.",
      "Each record builds an altered reality. No two alike.",
    ],
    genres: ["Electronic", "Hip Hop & Rap", "Experimental"],
    // The brand colors from ojinyx.com, so the artist reads the same here and there.
    palette: {
      mode: "dark",
      bg: "#06020c",
      fg: "#f3eef7",
      muted: "#a99bb7",
      accent: "#ff2bd6",
      accentFg: "#000000",
      accent2: "#c6ff00",
      accent3: "#5b3dff",
    },
    website: "https://ojinyx.com",
    socials: [
      { label: "Spotify", href: "https://open.spotify.com/artist/3mpVwDRoOxK71JARKm0Tm0" },
      { label: "Apple Music", href: "https://music.apple.com/artist/ojinyx/1556812806" },
      { label: "YouTube Music", href: "https://music.youtube.com/channel/UCil1y5ifGKFxhtPgGPhz1-A" },
      { label: "SoundCloud", href: "https://soundcloud.com/ojinyx" },
      { label: "Instagram", href: "https://instagram.com/ojinyx" },
    ],
    featured: true,
    since: "2024",
  },
  {
    slug: "random-thoth",
    name: "Random Thoth",
    // Bio written by the label, 2026-09-24. Keep verbatim.
    tagline: "Acid, the slow burn.",
    bio: [
      "Random Thoth is acid techno buffed and polished. Warm TB-303 lines. Old-school drum machines. A head full of Detroit.",
      "Forged in Dallas, now coming at you live from Anchorage, Alaska.",
      "Loud by default.",
    ],
    genres: ["Acid Techno", "Detroit Techno", "IDM"],
    // TODO(label): placeholder key art (the RANDOM THOTH SoundCloud avatar, 500²). Replace with proper art via _ANIMATIONS/random-thoth/MAIN.
    image: "/artists/random-thoth.2b7f6bf3.jpg",
    // Pinned: the placeholder art is grayscale, so there is nothing to extract.
    palette: {
      mode: "dark",
      bg: "#0a0806",
      fg: "#f6efe2",
      muted: "#a89e8c",
      accent: "#ffb000",
      accentFg: "#000000",
      accent2: "#19e6c1",
      accent3: "#7a4dff",
    },
    socials: [
      { label: "SoundCloud", href: "https://soundcloud.com/noah-lott" },
      { label: "YouTube", href: "https://www.youtube.com/@bouncelectric303" },
    ],
    tracks: [
      {
        title: "ELECTRIC EXODUS",
        url: "https://soundcloud.com/user-150831201-707624379/electric-exodus-random-thoth",
        year: "2009",
        artwork: "https://i1.sndcdn.com/artworks-vVxBnybuE7jkwrvk-8kyECQ-t500x500.jpg",
      },
      {
        title: "STELLAR TOUCH",
        url: "https://soundcloud.com/optickone/stellar-touch",
        year: "2010",
        artwork: "https://i1.sndcdn.com/artworks-000115335318-u5qu6n-t500x500.jpg",
      },
      {
        title: "SPECTRAL PURITY",
        url: "https://soundcloud.com/optickone/spectral-purity",
        year: "2009",
        artwork: "https://i1.sndcdn.com/artworks-000115335891-97aoka-t500x500.jpg",
      },
    ],
  },
  {
    slug: "the-minimal-musketeer",
    name: "the minimal musketeer",
    // Bio written by the label, 2026-09-24. Keep verbatim.
    tagline: "Strong. Cold. Minimal.",
    bio: [
      "the minimal musketeer is a series, not a project. Years of experience etched into the hardest acid techno.",
      "Minimal. Just like the 303s, 808s and 909s carrying the groove.",
      "Loud by choice.",
    ],
    genres: ["Minimal Techno", "Hard Techno", "Acid Techno"],
    // TODO(label): placeholder key art (the MARCH TO THE ACID STAR SHIP artwork, 500²). Replace via _ANIMATIONS/the-minimal-musketeer/MAIN.
    image: "/artists/the-minimal-musketeer.d26dde16.jpg",
    // No pinned palette: the color world is extracted from the key art at build.
    socials: [
      { label: "SoundCloud", href: "https://soundcloud.com/noah-lott" },
      { label: "More on SoundCloud", href: "https://soundcloud.com/optickone" },
    ],
    tracks: [
      {
        title: "MARCH TO THE ACID STAR SHIP",
        url: "https://soundcloud.com/noah-lott/minimal-musketeer-march-to-the-acid-star-ship",
        year: "2013",
        artwork: "https://i1.sndcdn.com/artworks-000125859786-5fbr03-t500x500.jpg",
      },
      {
        title: "MINIMAL MUSKETEER 13",
        url: "https://soundcloud.com/noah-lott/minimal-musketeer-13",
        year: "2015",
        artwork: "https://i1.sndcdn.com/artworks-000125861540-4hvsl2-t500x500.jpg",
      },
      {
        title: "THE 4TH MUSKATEER",
        url: "https://soundcloud.com/optickone/the-4th-muskateer",
        year: "2011",
      },
      {
        title: "THE 5TH MUSKATEER",
        url: "https://soundcloud.com/optickone/the-5th-muskateer",
        year: "2015",
      },
      {
        title: "AFRICA ROOTS",
        url: "https://soundcloud.com/noah-lott/africa-roots",
        year: "2007",
        note: "with Kool Zainski",
        artwork: "https://i1.sndcdn.com/artworks-000127899324-sncjao-t500x500.jpg",
      },
    ],
  },
];
