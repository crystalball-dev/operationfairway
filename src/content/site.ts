import type { SocialLink } from "./types";

/** Non-breaking space, for keeping a short closing phrase on one line. Visible in source, unlike a literal U+00A0. */
const nbsp = String.fromCharCode(0xa0);

/**
 * Site-wide settings.
 * ─────────────────────────────────────────────────────────────────────────
 * House style, applied everywhere:
 *   • the label name is ALWAYS allcaps                → "OPERATION FAIRWAY"
 *   • record and song titles are ALWAYS allcaps       → "KINGDOMS", "THE HILLS"
 *   • each artist's name keeps the case THEY use      → "ojinyx", "Random Thoth"
 *
 * Nothing in the CSS forces a case, so what you type here is what renders.
 * `npm run dev` warns in the console if a release or track title breaks the
 * allcaps rule.
 */
export const site = {
  /** The label, as a brand. Allcaps, always. */
  name: "OPERATION FAIRWAY",
  /**
   * The company behind the brand, from the Alaska articles of organization.
   * Used only where the law cares: the copyright line and structured data.
   * Everywhere else the label is plain OPERATION FAIRWAY.
   */
  legalName: "OPERATION FAIRWAY, LLC",
  /** Date the company was organized (ISO). Shown nowhere; feeds structured data. */
  founded: "2026-09-24",
  /** NAICS code from the articles of organization: record production and distribution. Structured data only. */
  naics: "512250",
  /** Canonical URL. Override per-environment with NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://operationfairway.org").replace(/\/$/, ""),
  /** One-line hook, shown in the hero and used in page titles. */
  tagline: "Records from the Zone.",
  /** SEO description (~150 chars). */
  description:
    "OPERATION FAIRWAY is an independent record label out of Alaska. Home of ojinyx, Random Thoth and the minimal musketeer. Artists, releases, merch and contact.",
  /**
   * Bio paragraphs, shown in the home page About section and in search
   * structured data. American English throughout. Each paragraph ends on a
   * short sign-off joined with `nbsp`, so it never wraps mid-phrase.
   */
  bio: [
    `OPERATION FAIRWAY is an independent record label out of Alaska. Electronic, hip hop, experimental, and whatever sits in between. One rule: no two records${nbsp}alike.`,
    `Every artist on the roster runs their own world. Each one delivering a new reality for your listening pleasure. Enjoy${nbsp}responsibly.`,
  ],
  /** Closing line of the bio, set as a refrain. Keep verbatim. */
  refrain: "Get lost in the Zone, stalker.",
  /** Where the label is based, at city level. Shown in the footer and about section; leave empty to hide. */
  location: "Wasilla, Alaska",
  /** Short form of the same, for the hero line ("Independent record label · Alaska"). */
  homeBase: "Alaska",
  /**
   * City-level postal address for structured data, so search engines place
   * the label on a map. Never put the street here: the site is public and
   * the registered address is a home.
   */
  address: { locality: "Wasilla", region: "AK", country: "US" },
  /** Where the contact form + mailto fallback point. TODO(label): confirm the inbox. */
  email: "hello@operationfairway.org",
  /** What the contact page invites. Shown as the intro line. */
  contactIntro: "Demos, licensing, sync, press, or to tell us the colors are too loud.",
  /** One line of demo guidance under the form. Leave empty to hide. */
  demoNote: "Demos: a private link beats an attachment. Two tracks, no bio needed.",
  /** Storefront listing everything for sale. Shown as a button on the merch page; leave empty to hide. */
  merchStoreUrl: "https://kunaki.com/msales.asp?PublisherId=249214&pp=1",
  /** Button text for `merchStoreUrl`. */
  merchStoreLabel: "All CDs on Kunaki",
  /**
   * Catalog numbers are assigned in release order ("OF001", "OF002", …) to
   * everything released on the label; a release can pin its own with
   * `catalogNumber`. Leave the prefix empty to hide catalog numbers entirely.
   */
  catalogPrefix: "OF",
  /** Genre tags for the label as a whole, used in structured data. */
  genres: ["Electronic", "Hip Hop & Rap", "Experimental"],
  /** Label profiles. Entries with an empty href are dropped automatically. TODO(label): fill in. */
  socials: [
    { label: "Instagram", href: "" },
    { label: "Bandcamp", href: "" },
    { label: "SoundCloud", href: "" },
    { label: "YouTube", href: "" },
  ].filter((s): s is SocialLink => Boolean(s.href)),
  /** Date the privacy page was last changed (ISO). Bump it when the page changes. */
  privacyUpdated: "2026-09-24",
};

export type Site = typeof site;

export const NAV = [
  { href: "/", label: "HOME" },
  { href: "/artists", label: "ARTISTS" },
  { href: "/releases", label: "RELEASES" },
  { href: "/merch", label: "MERCH" },
  { href: "/contact", label: "CONTACT" },
] as const;

if (process.env.NODE_ENV !== "production") {
  if (site.name !== site.name.toUpperCase()) console.warn(`[content] the label name should be allcaps, got "${site.name}"`);
}
