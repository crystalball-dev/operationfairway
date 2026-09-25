/**
 * SoundCloud helpers.
 *
 * Playback always goes through SoundCloud's official widget (see
 * <SoundCloudEmbed/>), loaded only after a click, so their player, stats and
 * attribution stay intact. Nothing here talks to SoundCloud at build time:
 * titles and artwork for an artist's selected tracks are typed into
 * src/content/artists.ts.
 */

export function isSoundCloudUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    const host = u.hostname;
    return host === "soundcloud.com" || host.endsWith(".soundcloud.com");
  } catch {
    return false;
  }
}

/** Official widget URL. `color` is a hex string with or without "#". */
export function widgetUrl(url: string, opts: { autoPlay?: boolean; color?: string } = {}): string {
  const params = new URLSearchParams({
    url,
    color: `#${(opts.color ?? "ffd400").replace("#", "")}`,
    auto_play: String(opts.autoPlay ?? false),
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "true",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}
