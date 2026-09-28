import Link from "next/link";
import { Fragment } from "react";
import type { Show } from "@/content/types";
import { lineup, showDate, showLinks, showPlace, showTimes } from "@/lib/shows";
import { pillOutline, pillSolid } from "./pill";

interface ShowListProps {
  shows: Show[];
  /** Past nights lead with the recording, when there is one. */
  past?: boolean;
  /** Heading level for each night's name, so the outline stays in order wherever the list sits. */
  headingAs?: "h3" | "h4";
}

/**
 * Live dates as a run of rows: a big date block, the night and its lineup,
 * where and when, then the links. Server-rendered, no client JS. Colors come
 * from whatever palette the list sits in, so an artist page shows its dates
 * in that artist's colors.
 */
export function ShowList({ shows, past = false, headingAs: Heading = "h3" }: ShowListProps) {
  return (
    <ol className="border-b border-current/15">
      {shows.map((show) => {
        const date = showDate(show);
        const times = showTimes(show);
        const place = showPlace(show);
        const who = lineup(show);
        const { event, recording } = showLinks(show);
        const watch = past ? recording : undefined;
        return (
          <li
            key={show.id}
            id={show.id}
            className="grid scroll-mt-28 grid-cols-[4.75rem_1fr] items-start gap-x-5 gap-y-5 border-t border-current/15 py-7 md:grid-cols-[7.5rem_1fr_auto] md:items-center md:gap-x-10"
          >
            <time dateTime={show.date} title={date.long} className="flex flex-col">
              <span className="label text-accent">{date.month}</span>
              <span className="display mt-1 text-[clamp(2.75rem,5vw,4.25rem)] leading-[0.85]">{date.day}</span>
              <span className="label mt-2 text-muted">
                {date.weekday} {date.year}
              </span>
            </time>

            <div className="min-w-0">
              <Heading className="display text-[clamp(1.35rem,2.6vw,2.25rem)] leading-[0.95]">{show.name}</Heading>
              {who.length ? (
                <p className="mt-3 text-lg font-medium leading-snug">
                  {who.map((artist, i) => (
                    <Fragment key={artist.slug}>
                      {i ? <span className="text-muted"> / </span> : null}
                      <Link href={`/artists/${artist.slug}`} className="text-accent underline-offset-4 hover:underline">
                        {artist.name}
                      </Link>
                    </Fragment>
                  ))}
                </p>
              ) : null}
              {place ? <p className="mt-1 text-muted">{place}</p> : null}
              {times ? <p className="label mt-3 text-muted">{times}</p> : null}
              {show.note ? <p className="mt-2 text-sm text-muted">{show.note}</p> : null}
            </div>

            {watch || event ? (
              <div className="col-span-2 flex flex-wrap gap-3 md:col-span-1 md:justify-end">
                {watch ? (
                  <a href={watch} target="_blank" rel="noreferrer" className={pillSolid}>
                    Watch the set <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {event ? (
                  <a href={event} target="_blank" rel="noreferrer" className={past ? pillOutline : pillSolid}>
                    {past ? "Event" : "Event page"} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
