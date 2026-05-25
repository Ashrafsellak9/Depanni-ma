export const dynamic = "force-static";

import { ArtisanSection } from "@/components/landing/ArtisanSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { Navbar } from "@/components/landing/Navbar";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <ServicesSection />
        <HowItWorksSection />
        <ArtisanSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
