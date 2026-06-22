import { HeroV2 } from "@/components/marketing/home/HeroV2";
import { ProblemV2 } from "@/components/marketing/home/ProblemV2";
import { GtdNativeSection } from "@/components/marketing/home/GtdNativeSection";
import { SequentialProjectSection } from "@/components/marketing/home/SequentialProjectSection";
import { WeeklyReviewCoachSection } from "@/components/marketing/home/WeeklyReviewCoachSection";
import { EditorialVignetteSection } from "@/components/marketing/home/EditorialVignetteSection";
import { FinalCtaSection } from "@/components/marketing/home/FinalCtaSection";
import { ActiveDevelopmentLine } from "@/components/marketing/home/ActiveDevelopmentLine";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
import { ORG_JSONLD } from "@/lib/jsonLd";

const SOFTWARE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Things Done.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "GTD-native task management. Inbox, next actions, sequential projects, a guided weekly review, and an AI review coach. Free to start.",
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
        title="Things Done - GTD-native task management"
        description="Your brain is not a storage unit. Capture every open loop, clarify the next action, and keep your system alive with a guided Weekly Review. Free to start."
        canonical={`${SITE_URL}/`}
        jsonLd={HOME_JSONLD}
      />
      <HeroV2 />
      <ProblemV2 />
      <GtdNativeSection />
      <SequentialProjectSection />
      <WeeklyReviewCoachSection />
      <EditorialVignetteSection />
      <FinalCtaSection />
      <ActiveDevelopmentLine />
    </>
  );
}
