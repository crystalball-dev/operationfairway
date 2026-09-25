import type { Metadata } from "next";
import { ArtistCard } from "@/components/artist-card";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";

export const metadata: Metadata = {
  title: "Artists",
  description: `The ${site.name} roster: ${sortedArtists.map((a) => a.name).join(", ")}.`,
  alternates: { canonical: "/artists" },
};

export default function ArtistsPage() {
  const count = sortedArtists.length;
  return (
    <div className="gutter pb-24 pt-32 md:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading as="h1" label={`${count} on the roster`} title="ARTISTS" />
        {/* Set as a sentence, not a label: two lines of uppercase micro-type
            would shout and wrap badly next to the heading. */}
        <p className="mb-2 max-w-sm text-lg leading-snug text-muted">Every artist runs their own world. Each page takes its colors from theirs.</p>
      </div>

      {count ? (
        <ul className="mt-16 grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {sortedArtists.map((artist, i) => (
            <li key={artist.slug} className={i % 3 === 1 ? "lg:mt-12" : undefined}>
              <ArtistCard artist={artist} index={i} priority={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-16 text-xl text-muted">Nobody signed yet. Soon.</p>
      )}
    </div>
  );
}
