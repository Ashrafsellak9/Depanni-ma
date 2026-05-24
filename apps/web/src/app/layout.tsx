import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DEPANNI.ma — Dépannage et services à domicile",
    template: "%s | DEPANNI.ma",
  },
  description:
    "Trouvez un artisan qualifié près de chez vous au Maroc. Plomberie, électricité, climatisation et plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
