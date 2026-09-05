import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://depanni.ma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DEPANNI.ma — Artisans vérifiés à El Jadida, en quelques minutes",
    template: "%s · DEPANNI.ma",
  },
  description:
    "Plomberie, électricité, serrurerie, mécanique, peinture, ménage. Recevez 3 offres d'artisans vérifiés en moins de 8 minutes à El Jadida. Paiement sécurisé, satisfait ou réintervention.",
  keywords: [
    "artisan El Jadida",
    "plombier El Jadida",
    "électricien El Jadida",
    "serrurier El Jadida",
    "dépannage El Jadida",
    "artisan Maroc",
  ],
  authors: [{ name: "DEPANNI" }],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA"],
    url: SITE_URL,
    siteName: "DEPANNI.ma",
    title: "L'artisan qu'il vous faut, en quelques minutes.",
    description: "Artisans vérifiés à El Jadida. Devis gratuit, paiement sécurisé.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DEPANNI.ma — Artisans vérifiés à El Jadida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEPANNI.ma — Artisans vérifiés à El Jadida",
    description: "Recevez 3 offres d'artisans vérifiés en moins de 8 minutes.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-MA": SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "DEPANNI.ma",
  image: `${SITE_URL}/og-image.png`,
  url: SITE_URL,
  // TODO: remplacer par vrai numéro.
  telephone: "+212XXXXXXXXX",
  address: {
    "@type": "PostalAddress",
    addressLocality: "El Jadida",
    addressRegion: "Casablanca-Settat",
    addressCountry: "MA",
  },
  areaServed: { "@type": "City", name: "El Jadida" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "300" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-medium focus:text-ink focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 focus:ring-offset-paper"
        >
          Aller au contenu principal
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
