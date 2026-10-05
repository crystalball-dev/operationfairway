import type { Show } from "./types";

/**
 * Live dates, across the roster.
 * ─────────────────────────────────────────────────────────────────────────
 * One entry per night. `artists` are slugs from artists.ts; the show is
 * listed on each of those artists' pages, on /live, and on the home page.
 *
 * Nothing needs moving after the night. A show counts as upcoming until its
 * end time passes, and the pages that list shows re-render every hour to
 * keep up. Times are the venue's local wall clock, 24-hour; an end earlier
 * than the start runs past midnight. Order in this file doesn't matter.
 *
 *   {
 *     id: "venue-or-night-2026-10-31",
 *     name: "Name of the night",
 *     artists: ["random-thoth"],
 *     date: "2026-10-31", start: "21:00", end: "02:00",
 *     venue: "Venue", city: "Anchorage", region: "AK",
 *     url: "https://…event page or tickets…",
 *   },
 */
export const shows: Show[] = [
  {
    id: "river-city-rave-2026-09-26",
    name: "River City Rave: Retro Edition",
    artists: ["random-thoth", "the-minimal-musketeer"],
    date: "2026-09-26",
    start: "22:00",
    end: "05:00",
    timeZone: "America/Anchorage",
    venue: "Club Nyt Lyt",
    address: "221 E 5th Ave",
    city: "Anchorage",
    region: "AK",
    url: "https://www.facebook.com/events/1921329685511366/",
    recording: "https://www.facebook.com/reel/1108826345162858/",
  },
  {
    id: "gnosis-2026-10-18",
    name: "Gnosis",
    artists: ["random-thoth", "the-minimal-musketeer"],
    date: "2026-10-18",
    start: "21:00",
    end: "22:00",
    timeZone: "America/Anchorage",
    // Koot's, as everyone calls it.
    venue: "Chilkoot Charlie's",
    address: "2435 Spenard Rd",
    city: "Anchorage",
    region: "AK",
    url: "https://koots.com/events",
  },
];
