import { useEffect } from "react";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ValuePropsSection } from "@/components/marketing/ValuePropsSection";
import { AppPreviewSection } from "@/components/marketing/AppPreviewSection";
import { CTAFooterSection } from "@/components/marketing/CTAFooterSection";

export default function HomePage() {
  useEffect(() => {
    document.title = "Things Done. — Clear your mind. Own your day.";
  }, []);

  return (
    <>
      <HeroSection />
      <ValuePropsSection />
      <AppPreviewSection />
      <CTAFooterSection />
    </>
  );
}
