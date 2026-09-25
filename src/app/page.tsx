import Link from "next/link";
import { ViewTransition, type CSSProperties } from "react";
import { Mark } from "@/brand/mark";
import { ArtistCard } from "@/components/artist-card";
import { Blobs } from "@/components/blobs";
import { CoverMedia } from "@/components/cover-media";
import { HeroTitle } from "@/components/hero-title";
import { LabelBadge } from "@/components/label-badge";
import { Marquee } from "@/components/marquee";
import { PaletteScope } from "@/components/palette-scope";
import { pillOutline, pillSolid } from "@/components/pill";
import { PointerGlow } from "@/components/pointer-glow";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StreamLinks } from "@/components/stream-links";
import { TiltCard } from "@/components/tilt-card";
import { site } from "@/content/site";
import { artistName, artistOf, labelSince, sortedArtists } from "@/lib/artists";
import { getCoverMedia } from "@/lib/covers";
import { getCoverTheme } from "@/lib/palette";
import {
  RELEASE_TYPE_LABEL,
  catalogNumber,
  formatReleaseDate,
  latestRelease,
  longestWord,
  releaseYear,
  sortedReleases,
} from "@/lib/releases";
import { paletteVars } from "@/lib/theme";

export default async function HomePage() {
  const roster = sortedArtists;

  const latest = latestRelease;
  const latestMedia = latest ? getCoverMedia(latest) : undefined;
  const latestTheme = latest ? await getCoverTheme(latestMedia?.poster, latest.slug) : undefined;
  const latestArtist = latest ? artistOf(latest) : undefined;
  const latestCatalog = latest ? catalogNumber(latest) : undefined;

  const others = sortedReleases.slice(1, 7);
  const otherMedia = others.map((r) => getCoverMedia(r));
  const otherThemes = await Promise.all(others.map((r, i) => getCoverTheme(otherMedia[i].poster, r.slug)));

  const tickerItems = latest
    ? [
        `${latest.releaseDate ? "NEW" : "NEXT"} ${RELEASE_TYPE_LABEL[latest.type].toUpperCase()}`,
        latest.title,
        artistName(latest),
        latest.releaseDate ? "OUT NOW" : "COMING SOON",
        site.name,
      ]
    : [site.name, site.tagline];

  const stats = [
    { term: "Roster", value: String(roster.length).padStart(2, "0") },
    { term: "Releases", value: String(sortedReleases.length).padStart(2, "0") },
    ...(labelSince ? [{ term: "Since", value: labelSince }] : []),
    { term: "Status", value: "Active" },
  ];

  return (
    <>
      {/* ── Hero: the name, letter by letter, over the drifting blobs ───── */}
      <section className="hero relative overflow-hidden bg-bg">
        <Blobs className="opacity-70" />
        <div className="map-grid text-fg" aria-hidden="true" />
        <PointerGlow />

        <div className="gutter relative flex min-h-[100svh] flex-col justify-between pb-8 pt-24 md:pt-28">
          <div className="hero-fade flex items-center justify-between gap-4">
            <span className="label text-muted">Independent record label{site.homeBase ? ` · ${site.homeBase}` : ""}</span>
            <span className="label hidden text-accent sm:inline">
              {roster.length} {roster.length === 1 ? "artist" : "artists"}
            </span>
          </div>

          <div className="py-10 md:py-14">
            <HeroTitle lines={site.name.split(/\s+/)} />
          </div>

          <div className="hero-fade flex flex-col gap-8">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div className="flex flex-col gap-5">
                <p className="display max-w-xl text-[clamp(1.35rem,2.4vw,2.25rem)] tracking-tight">{site.tagline}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/artists" className={pillSolid}>
                    The roster <span aria-hidden="true">→</span>
                  </Link>
                  {latest ? (
                    <Link href={`/releases/${latest.slug}`} className={pillOutline}>
                      {latest.releaseDate ? "Latest" : "Next"}: {latest.title}
                    </Link>
                  ) : null}
                </div>
              </div>
              <LabelBadge text={site.name} className="size-28 shrink-0 text-accent md:size-36" />
            </div>

            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-current/15 pt-5 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.term}>
                  <dt className="label text-muted">{s.term}</dt>
                  <dd className="mono mt-1 text-xl font-bold uppercase">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 -mb-4 -rotate-2 bg-accent py-3 text-accent-fg">
        <Marquee
          items={tickerItems.map((t) => (
            <span key={t} className="display text-[clamp(1.25rem,3vw,2.5rem)]">
              {t}
            </span>
          ))}
          duration={22}
        />
      </div>

      {/* ── Roster ─────────────────────────────────────────────────────── */}
      <section id="roster" className="gutter py-24 md:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading label="The roster" title="ARTISTS" />
          <p className="mb-2 max-w-sm text-lg leading-snug text-muted">Every artist runs their own world. Pick one and get lost.</p>
        </Reveal>
        <ul className="mt-14 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {roster.map((artist, i) => (
            <li key={artist.slug} className={i % 3 === 1 ? "lg:mt-12" : undefined}>
              <ArtistCard artist={artist} index={i} priority={i < 3} />
            </li>
          ))}
        </ul>
      </section>

      {/* ── Latest release ─────────────────────────────────────────────── */}
      {latest && latestTheme ? (
        <PaletteScope palette={latestTheme.palette} className="relative overflow-hidden">
          <Blobs colors={[latestTheme.palette.accent, latestTheme.palette.accent2, latestTheme.palette.accent3]} className="opacity-70" />
          <div className="gutter relative z-10 grid items-center gap-10 py-24 md:grid-cols-2 md:gap-16 md:py-32">
            <Reveal>
              <TiltCard className="shadow-hard relative mx-auto w-full max-w-[34rem] -rotate-2">
                <ViewTransition name={`cover-${latest.slug}`}>
                  <div className="relative aspect-square overflow-hidden bg-black/20" style={{ containerType: "inline-size" }}>
                    <CoverMedia
                      poster={latestMedia?.poster}
                      video={latestMedia?.video}
                      mode="inview"
                      alt={`${latest.title} cover art`}
                      fallbackLabel={latest.title}
                      blurDataURL={latestTheme.cover.blurDataURL}
                      sizes="(min-width: 768px) 45vw, 92vw"
                    />
                  </div>
                </ViewTransition>
              </TiltCard>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col gap-6">
              <span className="label text-muted">
                {latestCatalog ? `${latestCatalog} · ` : ""}
                {latest.releaseDate ? "Latest" : "Next"} {RELEASE_TYPE_LABEL[latest.type]} · {formatReleaseDate(latest.releaseDate)}
              </span>
              <div style={{ containerType: "inline-size" }}>
                <h2
                  className="display fit-title"
                  style={{ "--letters": longestWord(latest.title), "--fit-max": "clamp(3rem, 8vw, 7.5rem)" } as CSSProperties}
                >
                  {latest.title}
                </h2>
              </div>
              {latestArtist ? (
                <Link href={`/artists/${latestArtist.slug}`} className="display text-[clamp(1.25rem,2.2vw,2rem)] text-accent underline-offset-8 hover:underline">
                  {latestArtist.name}
                </Link>
              ) : null}
              {latest.description ? <p className="max-w-prose text-lg text-muted">{latest.description}</p> : null}
              <StreamLinks release={latest} />
              <Link href={`/releases/${latest.slug}`} className="label underline-offset-4 hover:underline">
                Release page →
              </Link>
            </Reveal>
          </div>
        </PaletteScope>
      ) : null}

      {/* ── Discography strip ──────────────────────────────────────────── */}
      {others.length ? (
        <section className="overflow-hidden py-8 md:py-16">
          <Reveal className="gutter flex items-end justify-between gap-6">
            <SectionHeading label="Discography" title="MORE" />
            <Link href="/releases" className="label mb-3 whitespace-nowrap underline-offset-4 hover:underline">
              All {sortedReleases.length} →
            </Link>
          </Reveal>
          <ul className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[var(--gutter)] pb-8 pt-4">
            {others.map((release, i) => {
              const { palette, cover } = otherThemes[i];
              const media = otherMedia[i];
              return (
                <li key={release.slug} className="w-[72vw] max-w-sm shrink-0 snap-start sm:w-[44vw] md:w-[30vw]">
                  <Link
                    href={`/releases/${release.slug}`}
                    className="group block bg-bg p-3 text-fg transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:-rotate-1"
                    style={paletteVars(palette)}
                  >
                    <ViewTransition name={`cover-${release.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-black/20" style={{ containerType: "inline-size" }}>
                        <CoverMedia
                          poster={media.poster}
                          video={media.video}
                          mode="hover"
                          small
                          alt={`${release.title} cover art`}
                          fallbackLabel={release.title}
                          blurDataURL={cover.blurDataURL}
                          sizes="(min-width: 768px) 30vw, 72vw"
                        />
                      </div>
                    </ViewTransition>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <span className="min-w-0">
                        <span className="display block text-lg">{release.title}</span>
                        <span className="block truncate text-sm">{artistName(release)}</span>
                      </span>
                      <span className="label text-muted">{releaseYear(release.releaseDate)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section className="gutter relative overflow-hidden py-24 md:py-36">
        <p aria-hidden="true" className="display text-outline pointer-events-none absolute -right-8 top-6 select-none text-[clamp(6rem,24vw,26rem)] leading-none opacity-30">
          HQ
        </p>
        <div className="relative grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <span className="label text-muted">About</span>
            <Mark decorative id="about-mark" className="mt-5 w-full max-w-[9rem] text-accent" />
            <ul className="label mt-6 flex flex-wrap gap-2">
              {site.genres.map((g) => (
                <li key={g} className="rounded-full border border-current/30 px-3 py-1">
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-6 text-xl leading-relaxed md:col-span-7 md:col-start-6 md:text-2xl">
            {site.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "" : "text-muted"}>
                {p}
              </p>
            ))}
            <p className="display mt-2 text-[clamp(1.5rem,3.2vw,2.75rem)] leading-tight text-accent">{site.refrain}</p>
            <div className="mt-4 flex items-center gap-6">
              <LabelBadge text={site.name} className="size-28 shrink-0 text-accent-2 md:size-32" />
              {site.location ? <span className="label text-muted">{site.location}</span> : null}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Tiles ──────────────────────────────────────────────────────── */}
      <section className="gutter py-16 md:py-24">
        <Reveal>
          <ul className="grid gap-4 md:grid-cols-3">
            {[
              { href: "/releases", title: "RELEASES", text: "Every record on the label, newest first.", bg: "bg-accent-3 text-white" },
              { href: "/merch", title: "MERCH", text: "KINGDOMS on CD. More on the way.", bg: "bg-accent text-accent-fg" },
              { href: "/contact", title: "CONTACT", text: "Demos, licensing, press, hello.", bg: "bg-accent-2 text-black" },
            ].map((tile, i) => (
              <li key={tile.href}>
                <Link
                  href={tile.href}
                  className={`group flex min-h-64 flex-col justify-between p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-2 md:min-h-80 ${tile.bg} ${
                    i % 2 ? "rotate-1 hover:rotate-0" : "-rotate-1 hover:rotate-0"
                  }`}
                >
                  <span className="display text-[clamp(2.25rem,4vw,4.25rem)]">{tile.title}</span>
                  <span className="flex items-end justify-between gap-4">
                    <span className="max-w-xs text-lg leading-snug">{tile.text}</span>
                    <span aria-hidden="true" className="display text-4xl transition-transform duration-500 group-hover:translate-x-2">
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
