import type { Metadata } from "next";
import { Marquee } from "@/components/marquee";
import { SectionHeading } from "@/components/section-heading";
import { ShowList } from "@/components/show-list";
import { shows } from "@/content/shows";
import { site } from "@/content/site";
import { showDate, showJsonLd, splitShows } from "@/lib/shows";
import { safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Live",
  description: `Live dates for the ${site.name} roster, upcoming and past. ${site.live.tagline}`,
  alternates: { canonical: "/live" },
};

/**
 * Shows move from upcoming to past on their own, so the page re-renders
 * hourly instead of waiting for the next deploy. Keep in step with
 * SHOWS_REVALIDATE_SECONDS (this has to be a literal).
 */
export const revalidate = 3600;

export default function LivePage() {
  const { upcoming, past } = splitShows(shows);
  const events = upcoming.flatMap((s) => showJsonLd(s, site.url) ?? []);

  const ticker = [
    site.live.tagline.toUpperCase(),
    ...(upcoming.length
      ? upcoming.slice(0, 4).map((s) => {
          const d = showDate(s);
          return `${d.month} ${d.day}${s.city ? ` · ${s.city.toUpperCase()}` : ""}`;
        })
      : ["NEXT DATE SOON"]),
    "VENUES OFTEN 21+",
    site.name,
  ];

  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="gutter grid gap-10 md:grid-cols-12 md:items-end">
        <SectionHeading
          as="h1"
          label={`${upcoming.length} upcoming · ${past.length} past`}
          title="LIVE"
          className="md:col-span-6"
          titleClassName="text-[clamp(4rem,14vw,12rem)]"
        />
        <div className="flex flex-col gap-5 md:col-span-6 md:pb-4">
          <p className="display text-[clamp(1.75rem,3.4vw,3rem)] leading-none text-accent">{site.live.tagline}</p>
          <p className="max-w-prose text-xl leading-relaxed text-muted">{site.live.intro}</p>
          <p className="display text-[clamp(1.25rem,2.2vw,2rem)] leading-tight">{site.live.refrain}</p>
        </div>
      </div>

      <div className="relative z-10 my-16 -rotate-1 bg-accent py-2 text-accent-fg md:my-20">
        <Marquee
          items={ticker.map((t) => (
            <span key={t} className="display text-xl md:text-2xl">
              {t}
            </span>
          ))}
          duration={24}
        />
      </div>

      <div className="gutter flex flex-col gap-20">
        <section aria-labelledby="upcoming">
          <h2 id="upcoming" className="display text-[clamp(2.25rem,5vw,4rem)]">
            UPCOMING
          </h2>
          {upcoming.length ? (
            <div className="mt-8">
              <ShowList shows={upcoming} />
            </div>
          ) : (
            <p className="mt-6 text-xl text-muted">{site.live.noDates}</p>
          )}
        </section>

        {past.length ? (
          <section aria-labelledby="past">
            <h2 id="past" className="display text-[clamp(2.25rem,5vw,4rem)]">
              PAST
            </h2>
            <div className="mt-8">
              <ShowList shows={past} past />
            </div>
          </section>
        ) : null}
      </div>

      {events.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(events) }} /> : null}
    </div>
  );
}
