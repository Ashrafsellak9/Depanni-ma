import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
