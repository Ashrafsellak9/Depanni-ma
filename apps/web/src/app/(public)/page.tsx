import { AppDownloadBanner } from "@/components/landing/AppDownloadBanner";
import { ArtisanSection } from "@/components/landing/ArtisanSection";
import { CoverageSection } from "@/components/landing/CoverageSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { MobileStickyCta } from "@/components/landing/MobileStickyCta";
import { Navbar } from "@/components/landing/Navbar";
import { PricingBand } from "@/components/landing/PricingBand";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FeaturedArtisans } from "@/components/sections/featured-artisans";
import { LiveFeed } from "@/components/sections/live-feed";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="contenu">
        <HeroSection />
        <StatsBar />
        <LiveFeed />
        <ServicesSection />
        <HowItWorksSection />
        <PricingBand />
        <AppDownloadBanner />
        <ArtisanSection />
        <TestimonialsSection />
        <FeaturedArtisans />
        <FaqSection />
        <CoverageSection />
        <CtaSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileStickyCta />
    </>
  );
}
