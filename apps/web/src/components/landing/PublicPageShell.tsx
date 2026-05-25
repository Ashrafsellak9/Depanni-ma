import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";

export function PublicPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
