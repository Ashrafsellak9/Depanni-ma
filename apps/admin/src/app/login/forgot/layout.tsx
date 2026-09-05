import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
