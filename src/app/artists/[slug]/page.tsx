import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, ViewTransition, type CSSProperties } from "react";
import { Blobs } from "@/components/blobs";
import { CoverMedia } from "@/components/cover-media";
import { ErrorBoundary } from "@/components/error-boundary";
import { Marquee } from "@/components/marquee";
import { PaletteScope } from "@/components/palette-scope";
import { pillOutline, pillSolid } from "@/components/pill";
import { ReleaseCard } from "@/components/release-card";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ShowList } from "@/components/show-list";
import { SoundCloudEmbed } from "@/components/soundcloud-embed";
import { Swatches } from "@/components/swatches";
import { TiltCard } from "@/components/tilt-card";
import { site } from "@/content/site";
import { getArtistTheme } from "@/lib/artist-theme";
import { adjacentArtists, artistSocials, getArtist, sortedArtists } from "@/lib/artists";
import { getArtistMedia } from "@/lib/covers";
import { longestWord, releasesByArtist } from "@/lib/releases";
import { showsByArtist, splitShows } from "@/lib/shows";
import { isSoundCloudUrl } from "@/lib/soundcloud";
import { safeJsonLd } from "@/lib/utils";

type Props = PageProps<"/artists/[slug]">;

export const dynamicParams = false;

/** Re-render hourly so live dates move from upcoming to past on their own (see lib/shows.ts). */
export const revalidate = 3600;

export function generateStaticParams() {
  return sortedArtists.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  const description = artist.bio?.[0] ?? artist.tagline ?? `${artist.name} on ${site.name}.`;
  return {
    title: artist.name,
    description,
    alternates: { canonical: `/artists/${artist.slug}` },
    openGraph: {
      type: "profile",
      title: `${artist.name} — ${site.name}`,
      description,
      url: `/artists/${artist.slug}`,
    },
  };
}

/** Browser chrome (mobile address bar, PWA title bar) matches the artist's colors. */
export async function generateViewport({ params }: Props): Promise<Viewport> {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) return {};
  const { palette } = await getArtistTheme(artist);
  return { themeColor: palette.bg, colorScheme: palette.mode };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const media = getArtistMedia(artist);
  const { palette, cover } = await getArtistTheme(artist);
  const records = releasesByArtist(artist.slug);
  // Only SoundCloud URLs get a player; anything else is dropped here rather
  // than rendered as an empty box.
  const tracks = (artist.tracks ?? []).filter((t) => isSoundCloudUrl(t.url));
  const socials = artistSocials(artist);
  const website = artist.website && /^https?:\/\//i.test(artist.website) ? artist.website : undefined;
  const { prev, next } = adjacentArtists(artist.slug);
  const genres = artist.genres ?? [];
  const bio = artist.bio ?? [];
  const { upcoming, past } = splitShows(showsByArtist(artist.slug));

  const metaLine = [...genres.slice(0, 3), artist.since ? `since ${artist.since}` : undefined, site.name].filter(Boolean).join(" · ");
  const sectionTitle = "text-[clamp(2.5rem,7vw,6rem)]";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: `${site.url}/artists/${artist.slug}`,
    genre: genres,
    description: bio.join(" ") || artist.tagline,
    image: media.poster ? new URL(media.poster, site.url).toString() : undefined,
    memberOf: { "@type": "Organization", name: site.name, url: site.url },
    sameAs: [...socials.map((s) => s.href), ...(website ? [website] : [])],
    album: records.map((r) => ({ "@type": "MusicAlbum", name: r.title, url: `${site.url}/releases/${r.slug}` })),
    track: tracks.map((t) => ({ "@type": "MusicRecording", name: t.title, url: t.url })),
  };

  const releasesSection = (
    <section id="releases" className="mt-20 scroll-mt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading label={`${records.length} ${records.length === 1 ? "record" : "records"}`} title="RELEASES" titleClassName={sectionTitle} />
        <Link href="/releases" className="label mb-3 whitespace-nowrap underline-offset-4 hover:underline">
          Whole label →
        </Link>
      </Reveal>
      {records.length ? (
        <ul className="mt-12 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((release, i) => (
            <li key={release.slug} className={i % 3 === 1 ? "sm:mt-12" : undefined}>
              <ReleaseCard release={release} index={i} hideArtist />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-xl text-muted">Nothing out on the label yet. Soon.</p>
      )}
    </section>
  );

  const listenSection = tracks.length ? (
    <section id="listen" className="mt-20 scroll-mt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading label={`${tracks.length} ${tracks.length === 1 ? "track" : "tracks"} · SoundCloud`} title="LISTEN" titleClassName={sectionTitle} />
        <p className="mb-2 max-w-sm text-lg leading-snug text-muted">Players load on tap. Nothing else does.</p>
      </Reveal>
      <ul className="mt-12 grid gap-8 lg:grid-cols-2">
        {tracks.map((t) => {
          const fallback = (
            <a href={t.url} target="_blank" rel="noreferrer" className="display block rounded-3xl border border-current/15 p-8 text-2xl">
              {t.title} — open on SoundCloud ↗
            </a>
          );
          return (
            <li key={t.url}>
              <ErrorBoundary fallback={fallback}>
                <SoundCloudEmbed
                  url={t.url}
                  title={t.title}
                  thumbnail={t.artwork}
                  note={t.note}
                  publishedAt={t.year}
                  accent={palette.accent.replace("#", "")}
                  resolved
                />
              </ErrorBoundary>
            </li>
          );
        })}
      </ul>
    </section>
  ) : null;

  const liveSection = (
    <section id="live" className="mt-20 scroll-mt-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          label={upcoming.length ? `${upcoming.length} upcoming` : "On stage"}
          title="LIVE"
          titleClassName={sectionTitle}
        />
        <div className="mb-3 flex flex-col items-start gap-2 sm:items-end">
          <p className="display text-[clamp(1.25rem,2.2vw,2rem)] leading-none text-accent">{site.live.tagline}</p>
          <Link href="/live" className="label whitespace-nowrap underline-offset-4 hover:underline">
            Whole label →
          </Link>
        </div>
      </Reveal>
      <Reveal className="mt-12 flex flex-col gap-12">
        {upcoming.length ? (
          <div>
            <h3 className="label mb-4 text-muted">Upcoming</h3>
            <ShowList shows={upcoming} headingAs="h4" />
          </div>
        ) : (
          <p className="text-xl text-muted">{site.live.noDates}</p>
        )}
        {past.length ? (
          <div>
            <h3 className="label mb-4 text-muted">Past</h3>
            <ShowList shows={past} past headingAs="h4" />
          </div>
        ) : null}
      </Reveal>
    </section>
  );

  // Whatever has something to show leads, upcoming dates first of all;
  // sections with nothing in them yet sink to the bottom.
  const sections = [
    { key: "live", node: liveSection, rank: upcoming.length ? 0 : past.length ? 3 : 4 },
    { key: "releases", node: releasesSection, rank: records.length ? 1 : 5 },
    { key: "listen", node: listenSection, rank: 2 },
  ]
    .filter((s) => s.node)
    .sort((a, b) => a.rank - b.rank);

  return (
    <PaletteScope palette={palette} className="relative min-h-[100svh] overflow-hidden">
      <Blobs colors={[palette.accent, palette.accent2, palette.accent3, palette.accent]} className="opacity-80" />

      <div className="gutter relative z-10 pb-24 pt-28 md:pt-36">
        <nav aria-label="Breadcrumb" className="label text-muted">
          <Link href="/artists" className="underline-offset-4 hover:underline">
            ← Artists
          </Link>
        </nav>

        {/* Header */}
        <header className="mt-10 grid items-start gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <TiltCard className="shadow-hard relative -rotate-2">
              <ViewTransition name={`artist-${artist.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-black/20" style={{ containerType: "inline-size" }}>
                  <CoverMedia
                    poster={media.poster}
                    video={media.video}
                    mode="autoplay"
                    priority
                    alt={`${artist.name} key art`}
                    fallbackLabel={artist.name}
                    blurDataURL={cover.blurDataURL}
                    sizes="(min-width: 768px) 42vw, 92vw"
                  />
                </div>
              </ViewTransition>
            </TiltCard>
          </div>

          <div className="flex flex-col gap-7 md:col-span-7 md:pl-6" style={{ containerType: "inline-size" }}>
            <p className="label text-muted">{metaLine}</p>
            <h1
              className="display fit-title -ml-[0.04em]"
              style={{ "--letters": longestWord(artist.name), "--fit-max": "clamp(3rem, 10vw, 9rem)" } as CSSProperties}
            >
              {artist.name}
            </h1>
            {artist.tagline ? <p className="display text-[clamp(1.25rem,2.2vw,2rem)] leading-tight text-accent">{artist.tagline}</p> : null}
            {bio.length ? (
              <div className="flex max-w-prose flex-col gap-4 text-lg leading-relaxed text-muted md:text-xl">
                {bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="max-w-prose text-lg text-muted md:text-xl">Bio coming soon.</p>
            )}
            {socials.length || website ? (
              <ul className="flex flex-wrap gap-3">
                {website ? (
                  <li>
                    <a href={website} target="_blank" rel="noreferrer" className={pillSolid}>
                      {hostOf(website)} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ) : null}
                {socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noreferrer" className={website ? pillOutline : pillSolid}>
                      {s.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="label text-muted">Links coming soon.</p>
            )}
          </div>
        </header>

        {/* Ticker in accent */}
        <div className="bleed mt-20 -rotate-1 bg-accent py-2 text-accent-fg">
          <Marquee
            items={[
              artist.name,
              ...genres.map((g) => g.toUpperCase()),
              records.length ? `${records.length} ${records.length === 1 ? "RELEASE" : "RELEASES"}` : `${tracks.length} ${tracks.length === 1 ? "TRACK" : "TRACKS"}`,
              site.name,
            ].map((t) => (
              <span key={t} className="display text-xl md:text-2xl">
                {t}
              </span>
            ))}
            duration={24}
            reverse
          />
        </div>

        {sections.map((s) => (
          <Fragment key={s.key}>{s.node}</Fragment>
        ))}

        <Reveal className="mt-20 max-w-md">
          <h2 className="label mb-4 text-muted">Color world</h2>
          <Swatches palette={palette} />
        </Reveal>

        {/* Prev / next */}
        {prev || next ? (
          <nav aria-label="More artists" className="mt-24 grid gap-4 border-t border-current/15 pt-8 sm:grid-cols-2">
            {prev ? (
              <Link href={`/artists/${prev.slug}`} className="group flex flex-col gap-1">
                <span className="label text-muted">← Previous</span>
                <span className="display text-3xl underline-offset-8 group-hover:underline">{prev.name}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/artists/${next.slug}`} className="group flex flex-col gap-1 sm:items-end sm:text-right">
                <span className="label text-muted">Next →</span>
                <span className="display text-3xl underline-offset-8 group-hover:underline">{next.name}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    </PaletteScope>
  );
}
