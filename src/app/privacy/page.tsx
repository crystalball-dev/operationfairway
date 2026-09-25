import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/content/site";
import { formatReleaseDate } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Privacy",
  description: `What ${site.name} does with your data: the contact form, cookieless analytics, hosting, and the players that load only on tap.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/**
 * Plain-words privacy page. Every section describes something the site
 * actually does (see the contact route, layout analytics, and the
 * click-to-load embeds), so keep it in step with the code when that changes,
 * and bump `site.privacyUpdated`.
 */
export default function PrivacyPage() {
  const sections: Array<{ heading: string; body: ReactNode }> = [
    {
      heading: "Who runs this site",
      body: (
        <>
          {site.legalName}, an independent record label based in {site.location || "Alaska"}. Questions about your data go to{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
          .
        </>
      ),
    },
    {
      heading: "Contact form",
      body: (
        <>
          When you send a message, your name, email address and the message are emailed to our inbox through Resend, the delivery service we use, and
          kept there so we can reply. They are not added to any list and never sold. To limit abuse, the sending IP address is held in the server&apos;s
          memory for about ten minutes and then dropped. If our mail isn&apos;t configured, the form hands you a prefilled email instead and nothing is
          sent to us at all.
        </>
      ),
    },
    {
      heading: "Analytics",
      body: (
        <>
          We use Vercel Web Analytics and Speed Insights to see how the site performs: page views, referring sites, browser and device type, and
          country, all aggregated. They set no cookies and do no cross-site tracking, and we cannot identify you from them.
        </>
      ),
    },
    {
      heading: "Hosting",
      body: (
        <>
          The site is served by Vercel, which logs requests, including IP addresses, for security and operations under its own privacy policy. Our
          domain&apos;s DNS is handled by Cloudflare.
        </>
      ),
    },
    {
      heading: "Players and embeds",
      body: (
        <>
          SoundCloud and YouTube players only load after you press play. Once loaded, those services may set cookies and collect data under their own
          policies; YouTube is embedded through its privacy-enhanced domain. Links to streaming services, stores and artist sites take you to those
          companies, whose policies apply there.
        </>
      ),
    },
    {
      heading: "Cookies",
      body: <>This site sets none of its own.</>,
    },
    {
      heading: "Your rights",
      body: (
        <>
          Email us to see, correct or delete anything we hold about you, which in practice means messages you sent. We answer within a month. This site
          is not directed at children under 13.
        </>
      ),
    },
    {
      heading: "Changes",
      body: <>If this page changes, the date below changes with it.</>,
    },
  ];

  return (
    <div className="gutter pb-24 pt-32 md:pt-40">
      <SectionHeading as="h1" label="The short version" title="PRIVACY" />
      <p className="mt-6 max-w-prose text-xl text-muted">This site collects as little as it can. Here is exactly what happens to your data, in plain words.</p>

      <dl className="mt-14 grid max-w-4xl gap-y-10 md:grid-cols-12 md:gap-x-8">
        {sections.map((s) => (
          <div key={s.heading} className="contents">
            <dt className="label text-muted md:col-span-3">{s.heading}</dt>
            <dd className="text-lg leading-relaxed md:col-span-9">{s.body}</dd>
          </div>
        ))}
      </dl>

      <p className="label mt-14 text-muted">
        Effective {formatReleaseDate(site.privacyUpdated)} ·{" "}
        <Link href="/contact" className="underline-offset-4 hover:underline">
          Contact
        </Link>
      </p>
    </div>
  );
}
