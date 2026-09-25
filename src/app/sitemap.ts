import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";
import { sortedReleases } from "@/lib/releases";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const statics: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/artists`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/releases`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/merch`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/privacy`, lastModified: new Date(site.privacyUpdated), changeFrequency: "yearly", priority: 0.2 },
  ];
  const artists: MetadataRoute.Sitemap = sortedArtists.map((a) => ({
    url: `${site.url}/artists/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const releases: MetadataRoute.Sitemap = sortedReleases.map((r) => {
    const d = r.releaseDate ? new Date(r.releaseDate) : now;
    return {
      url: `${site.url}/releases/${r.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? now : d,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });
  return [...statics, ...artists, ...releases];
}
