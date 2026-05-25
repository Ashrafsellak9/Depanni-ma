import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DEPANNI.ma — Artisans à domicile à El Jadida",
    template: "%s | DEPANNI.ma",
  },
  description:
    "Trouvez un artisan qualifié près de chez vous au Maroc. Plomberie, électricité, serrurerie — offres en quelques minutes.",
  openGraph: {
    title: "DEPANNI.ma — L'artisan qu'il vous faut, en quelques minutes",
    description: "Marketplace de services à domicile à El Jadida. Artisans vérifiés, paiement sécurisé.",
    locale: "fr_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmSans.variable} font-dm antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
