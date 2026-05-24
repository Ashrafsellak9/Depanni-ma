import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@depanni/ui/globals.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DEPANNI.ma — Dépannage et services à domicile",
  description:
    "Trouvez un artisan qualifié près de chez vous au Maroc. Plomberie, électricité, serrurerie et plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
