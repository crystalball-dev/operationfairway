import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { site } from "@/content/site";
import { sortedArtists } from "@/lib/artists";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

// All three faces are self-hosted by next/font at build: no request to Google
// from the browser, zero layout shift. Unbounded and Space Grotesk are
// variable (one file each); Space Mono ships two static weights.
const display = Unbounded({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-display-family",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-body-family",
});

const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono-family",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#090a07",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.bio.join(" "),
  sameAs: site.socials.map((s) => s.href),
  member: sortedArtists.map((a) => ({ "@type": "MusicGroup", name: a.name, url: `${site.url}/artists/${a.slug}` })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} h-full`}>
      <body className="grain flex min-h-full flex-col">
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
