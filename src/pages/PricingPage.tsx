import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PricingFeature {
  text: string;
  comingSoon?: boolean;
}

const FREE_FEATURES: PricingFeature[] = [
  { text: "Up to 30 active items" },
  { text: "Up to 3 projects" },
  { text: "Up to 3 areas" },
  { text: "Google Calendar sync" },
  { text: "All GTD views" },
];

const PRO_FEATURES: PricingFeature[] = [
  { text: "Unlimited items" },
  { text: "Unlimited projects" },
  { text: "Unlimited areas" },
  { text: "AI weekly reviews", comingSoon: true },
  { text: "AI coach", comingSoon: true },
  { text: "Review history", comingSoon: true },
  { text: "Priority support" },
];

const FAQ = [
  {
    q: "Can I use Things Done. for free forever?",
    a: "Yes! The free plan includes up to 30 active items, 3 projects, and 3 areas with no time limit.",
  },
  {
    q: "What happens if I cancel Pro?",
    a: "You keep all your data. You just won't be able to create new items beyond the free limits until you re-subscribe.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. All data is stored securely and is never shared with third parties.",
  },
  {
    q: "Will AI features cost extra?",
    a: "No. AI features are included in the Pro plan at no additional cost.",
  },
];

function PricingCard({
  title,
  price,
  features,
  cta,
  ctaVariant = "default",
  highlighted,
}: {
  title: string;
  price: string;
  features: PricingFeature[];
  cta: string;
  ctaVariant?: "default" | "outline";
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-xl border p-8 ${
        highlighted
          ? "border-primary bg-pricing-highlight"
          : "border-border bg-card"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Recommended
        </span>
      )}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-foreground">{price}</p>
      </div>
      <ul className="flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className={f.comingSoon ? "text-muted-foreground" : "text-foreground"}>
              {f.text}
              {f.comingSoon && " *"}
            </span>
          </li>
        ))}
      </ul>
      {features.some((f) => f.comingSoon) && (
        <p className="mt-3 text-[10px] text-muted-foreground">* coming soon</p>
      )}
      <div className="mt-8">
        <Button variant={ctaVariant} asChild className="w-full">
          <Link to="/auth">{cta}</Link>
        </Button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  useEffect(() => {
    document.title = "Pricing — Things Done";
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-hero-bg px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl text-foreground sm:text-[2.5rem]">
            Simple, transparent pricing.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Start free, upgrade when you need more.
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="mx-auto max-w-3xl px-6 -mt-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 sm:grid-cols-2"
        >
          <PricingCard
            title="Free"
            price="$0"
            features={FREE_FEATURES}
            cta="Get Started"
            ctaVariant="outline"
          />
          <PricingCard
            title="Pro"
            price="$4/mo"
            features={PRO_FEATURES}
            cta="Upgrade to Pro"
            highlighted
          />
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-foreground text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
