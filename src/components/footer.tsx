import Link from "next/link";
import { Wordmark } from "@/brand/wordmark";
import { NAV, site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";

export function Footer() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="relative overflow-hidden bg-bg text-fg">
      <div className="hazard" aria-hidden="true" />
      <div className="gutter pb-10 pt-14">
        <Wordmark decorative variant="stacked" outline className="w-full max-w-5xl opacity-70" />

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="label text-muted">Navigate</p>
            <ul className="mt-3 flex flex-col gap-1">
              {NAV.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href} className="display text-2xl underline-offset-8 hover:underline">
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-muted">Roster</p>
            <ul className="mt-3 flex flex-col gap-1">
              {sortedArtists.map((artist) => (
                <li key={artist.slug}>
                  <Link href={`/artists/${artist.slug}`} className="display text-2xl underline-offset-8 hover:underline">
                    {artist.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-muted">Elsewhere</p>
            {site.socials.length ? (
              <ul className="mt-3 flex flex-col gap-1">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="display text-2xl uppercase underline-offset-8 hover:underline">
                      {s.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted">Links coming soon.</p>
            )}
          </div>
          <div>
            <p className="label text-muted">Contact</p>
            <a href={`mailto:${site.email}`} className="mt-3 inline-block break-all text-lg font-medium underline-offset-4 hover:underline">
              {site.email}
            </a>
            <p className="label mt-5 text-muted">Independent record label</p>
            <p className="display mt-2 text-2xl text-accent">{site.tagline}</p>
            {site.location ? <p className="mt-3 text-muted">{site.location}</p> : null}
          </div>
        </div>

        <p className="label mt-14 text-muted">
          © {year} {site.name} · All rights reserved.
        </p>
      </div>
    </footer>
  );
}
