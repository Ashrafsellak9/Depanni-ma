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
      <main id="contenu" className="scroll-mt-28 pt-[72px] md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
