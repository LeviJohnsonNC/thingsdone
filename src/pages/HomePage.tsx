import { useEffect } from "react";
import { HomeHeroSection } from "@/components/marketing/HomeHeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { ProductPhilosophySection } from "@/components/marketing/ProductPhilosophySection";
import { WeeklyReviewSection } from "@/components/marketing/WeeklyReviewSection";
import { HomeCTASection } from "@/components/marketing/HomeCTASection";

export default function HomePage() {
  useEffect(() => {
    document.title = "Things Done. — Capture everything. Know what to do next.";
  }, []);

  return (
    <>
      <HomeHeroSection />
      <HowItWorksSection />
      <ProductPhilosophySection />
      <WeeklyReviewSection />
      <HomeCTASection />
    </>
  );
}
