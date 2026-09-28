import { shows } from "@/content/shows";
import { site } from "@/content/site";
import { isWellFormedShow, lineup, showLinks, showWindow, zoneOf } from "@/lib/shows";

/** Built at deploy: shows only change when src/content/shows.ts does. */
export const dynamic = "force-static";

/**
 * GET /shows.json — every live date on the label as plain JSON, so an
 * artist's own site can list its dates without keeping a second copy.
 * ojinyx.com reads this and keeps the entries that bill ojinyx.
 *
 * `date`, `start` and `end` are the venue's wall clock in `timeZone`;
 * `startsAt` and `endsAt` are the same moments in UTC, which is all a
 * reader needs to sort upcoming from past. Past shows stay in the feed.
 */
export function GET() {
  return Response.json({
    label: site.name,
    url: `${site.url}/live`,
    shows: shows.filter(isWellFormedShow).map((show) => {
      const { start, end } = showWindow(show);
      const { event, recording } = showLinks(show);
      return {
        id: show.id,
        name: show.name,
        artists: lineup(show).map((a) => ({ slug: a.slug, name: a.name, url: `${site.url}/artists/${a.slug}` })),
        date: show.date,
        start: show.start ?? null,
        end: show.end ?? null,
        timeZone: zoneOf(show),
        startsAt: new Date(start).toISOString(),
        endsAt: new Date(end).toISOString(),
        venue: show.venue ?? null,
        address: show.address ?? null,
        city: show.city ?? null,
        region: show.region ?? null,
        country: show.country ?? "US",
        url: event ?? null,
        recording: recording ?? null,
        note: show.note ?? null,
      };
    }),
  });
}
