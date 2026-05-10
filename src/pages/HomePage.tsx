import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { ProductPhilosophySection } from "@/components/marketing/ProductPhilosophySection";
import { WeeklyReviewSection } from "@/components/marketing/WeeklyReviewSection";
import { ActiveDevelopmentSection } from "@/components/marketing/ActiveDevelopmentSection";
import { HomeCTASection } from "@/components/marketing/HomeCTASection";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
import { ORG_JSONLD } from "@/lib/jsonLd";

const SOFTWARE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Things Done.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "The GTD task manager built for practitioners. Native inbox, next actions, waiting for, sequential projects, guided weekly review, and an AI review coach. Free to start.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "4.00", priceCurrency: "USD", name: "Pro", billingPeriod: "month" },
  ],
  url: SITE_URL,
};

const HOME_JSONLD = [SOFTWARE_JSONLD, ORG_JSONLD];

export default function HomePage() {
  return (
    <>
      <SEOHead
        title="Things Done — The GTD Task Manager Built for Practitioners"
        description="The GTD task manager with native inbox, next actions, waiting for, sequential projects, a guided weekly review, and an AI review coach. Free to start — no credit card required."
        canonical={`${SITE_URL}/`}
        jsonLd={HOME_JSONLD}
      />
      <HomeHeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <ProductPhilosophySection />
      <WeeklyReviewSection />
      <ActiveDevelopmentSection />
      <HomeCTASection />
    </>
  );
}
