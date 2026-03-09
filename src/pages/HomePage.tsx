import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { ProductPhilosophySection } from "@/components/marketing/ProductPhilosophySection";
import { WeeklyReviewSection } from "@/components/marketing/WeeklyReviewSection";
import { HomeCTASection } from "@/components/marketing/HomeCTASection";
import { SEOHead } from "@/components/SEOHead";

const HOME_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Things Done.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "A calm, focused GTD task manager that helps you capture everything, organize by context, and always know what to do next.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
    },
    {
      "@type": "Offer",
      price: "4.00",
      priceCurrency: "USD",
      name: "Pro",
      billingPeriod: "month",
    },
  ],
  url: "https://thingsdone.lovable.app",
};

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Things Done. — Capture everything. Know what to do next."
        description="A calm, focused GTD task manager that helps you capture tasks, organize projects, and always know what to do next. Free to start — no credit card required."
        canonical="https://thingsdone.lovable.app/"
        jsonLd={HOME_JSONLD}
      />
      <HomeHeroSection />
      <HowItWorksSection />
      <ProductPhilosophySection />
      <WeeklyReviewSection />
      <HomeCTASection />
    </>
  );
}
