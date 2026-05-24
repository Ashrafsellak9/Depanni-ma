import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@depanni/ui/globals.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "DEPANNI Admin",
  description: "Tableau de bord administrateur DEPANNI.ma",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} bg-gray-50 font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
