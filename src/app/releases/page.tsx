import type { Metadata } from "next";
import Link from "next/link";
import { ReleaseCard } from "@/components/release-card";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";
import { releasesByArtist, sortedReleases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Releases",
  description: `Every ${site.name} release, across the whole roster. Each page is unique, just like the records.`,
  alternates: { canonical: "/releases" },
};

export default function ReleasesPage() {
  const count = sortedReleases.length;
  const withRecords = sortedArtists.filter((a) => releasesByArtist(a.slug).length > 0);

  return (
    <div className="gutter pb-24 pt-32 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading as="h1" label={`${count} ${count === 1 ? "record" : "records"} · ${withRecords.length} ${withRecords.length === 1 ? "artist" : "artists"}`} title="RELEASES" />
        {/* Set as a sentence, not a label: two lines of uppercase micro-type
            would shout and wrap badly next to the heading. */}
        <p className="mb-2 max-w-sm text-lg leading-snug text-muted">
          Each page is unique, just like the records. Bold colors catered for your viewing pleasure.
        </p>
      </div>

      {withRecords.length > 1 ? (
        <nav aria-label="By artist" className="mt-10 flex flex-wrap items-center gap-2">
          <span className="label mr-2 text-muted">By artist</span>
          {withRecords.map((a) => (
            <Link key={a.slug} href={`/artists/${a.slug}#releases`} className="label rounded-full border border-current/30 px-3 py-1 transition-colors hover:bg-fg hover:text-bg">
              {a.name}
            </Link>
          ))}
        </nav>
      ) : null}

      {count ? (
        <ul className="mt-16 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {sortedReleases.map((release, i) => (
            <li key={release.slug} className={i % 3 === 1 ? "sm:mt-12" : undefined}>
              <ReleaseCard release={release} index={i} priority={i < 2} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-xl text-muted">Nothing out yet. Soon.</p>
      )}
    </div>
  );
}
