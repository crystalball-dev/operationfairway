/**
 * Wall-clock times in a named time zone, with no date library. Pure and
 * dependency-free, so it can be tested on its own:
 *
 *   node -e "import('./src/lib/zoned-time.ts').then((t) => …)"
 *
 * Everything leans on Intl, which carries the full time zone database in
 * Node and in every current browser.
 */

const validZones = new Map<string, boolean>();

/** True for any IANA zone Intl knows, e.g. "America/Anchorage". Cached. */
export function isValidZone(timeZone: string): boolean {
  let ok = validZones.get(timeZone);
  if (ok === undefined) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone });
      ok = true;
    } catch {
      ok = false;
    }
    validZones.set(timeZone, ok);
  }
  return ok;
}

/** A zone's offset from UTC at an instant, in minutes. Alaska summer time is -480. */
export function offsetMinutes(instant: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(instant));
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"), part("second"));
  return Math.round((wall - instant) / 60000);
}

/**
 * A local date and 24-hour clock time in a zone, as a UTC timestamp.
 * The first pass guesses with the offset at the wall time read as UTC; the
 * second corrects it with the offset actually in force, which settles the
 * nights the clocks change.
 */
export function zonedInstant(date: string, clock: string, timeZone: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = clock.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm);
  const guess = wall - offsetMinutes(wall, timeZone) * 60000;
  return wall - offsetMinutes(guess, timeZone) * 60000;
}

/** "2026-09-26" → "2026-09-27". */
export function nextDay(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

/** ISO 8601 in the zone's own offset: "2026-09-26T22:00:00-08:00". */
export function localIso(instant: number, timeZone: string): string {
  const offset = offsetMinutes(instant, timeZone);
  const local = new Date(instant + offset * 60000).toISOString().slice(0, 19);
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  return `${local}${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

/** "10 PM", "9:30 PM": a clock time as a flyer would print it. */
export function clockLabel(instant: number, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).formatToParts(new Date(instant));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const minutes = get("minute");
  return `${get("hour")}${minutes && minutes !== "00" ? `:${minutes}` : ""} ${get("dayPeriod")}`.trim();
}

/** The zone's short name at an instant, e.g. "AKDT" in summer and "AKST" in winter. */
export function zoneLabel(instant: number, timeZone: string): string {
  return (
    new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" }).formatToParts(new Date(instant)).find((p) => p.type === "timeZoneName")?.value ?? ""
  );
}
