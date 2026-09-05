import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Admin — DEPANNI.ma",
    template: "%s | DEPANNI Admin",
  },
  description: "Tableau de bord administrateur DEPANNI.ma",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${syne.variable} ${dmSans.variable} bg-page font-dm text-navy antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
