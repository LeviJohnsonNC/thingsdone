import { useState } from "react";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
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
}

const FREE_FEATURES: PricingFeature[] = [
  { text: "Up to 30 active items" },
  { text: "Up to 3 projects" },
  { text: "Up to 3 areas" },
  { text: "Google Calendar sync" },
  { text: "All GTD® views" },
  { text: "Weekly Review wizard" },
  { text: "3 AI reviews per month" },
];

const PRO_FEATURES: PricingFeature[] = [
  { text: "Unlimited items" },
  { text: "Unlimited projects" },
  { text: "Unlimited areas" },
  { text: "Unlimited AI-powered reviews" },
  { text: "AI brain dump capture" },
  { text: "Recurring tasks" },
  { text: "Priority support" },
];

const FAQ = [
  {
    q: "Is there really a free plan?",
    a: "Yes — the free plan includes up to 30 active tasks, 3 projects, 3 areas, and 3 AI-powered reviews per month. No credit card required, no trial period, no expiration. Use it as long as you like.",
  },
  {
    q: "What happens if I go over the free plan limits?",
    a: "You'll be prompted to upgrade to Pro. Your existing tasks, projects, and data won't be deleted — you just won't be able to add new items beyond the free limits until you upgrade or archive some existing ones.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, you can cancel anytime from your account settings. You'll keep Pro access until the end of your current billing period. No questions asked.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) securely processed through Stripe. Your payment information is never stored on our servers.",
  },
  {
    q: "Is my data secure?",
    a: "Yes, all data is encrypted in transit and at rest, stored in a secure cloud database, and never sold or shared with third parties. AI suggestions are generated per-request and not stored for training.",
  },
  {
    q: "What is GTD®, and do I need to know it?",
    a: "GTD® (Getting Things Done®) is a productivity method by David Allen. You don't need to study it — Things Done. is built on its principles so you get the benefits just by using the app. Capture, clarify, organize, review, do.",
  },
  {
    q: "Can I connect Google Calendar?",
    a: "Yes, on both plans. Link your Google Calendar in Settings to see events alongside your tasks and push scheduled items to your calendar.",
  },
  {
    q: "What counts as an AI review?",
    a: "Each time you tap 'Get AI Suggestions' or 'Generate AI Summary' during a weekly review, that's one AI review. Free users get 3 per calendar month; Pro users get unlimited.",
  },
  {
    q: "What's AI brain dump?",
    a: "During a weekly review, you can dump everything on your mind into a text box. The AI turns each thought into a ready-to-file task — complete with suggested state, energy, and time estimate. It's a Pro-only feature.",
  },
  {
    q: "Do AI features cost extra?",
    a: "No. Unlimited AI reviews and brain dump capture are included in Pro at $4/month — no usage fees, no surprises.",
  },
];

function PricingCard({
  title,
  price,
  features,
  cta,
  ctaVariant = "default",
  highlighted,
  tagline,
}: {
  title: string;
  price: string;
  features: PricingFeature[];
  cta: string;
  ctaVariant?: "default" | "outline";
  highlighted?: boolean;
  tagline?: string;
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
        {tagline && (
          <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
        )}
      </div>
      <ul className="flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f.text} className="flex items-start gap-2.5 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-foreground">{f.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button variant={ctaVariant} asChild className="w-full">
          <Link to="/auth">{cta}</Link>
        </Button>
      </div>
    </div>
  );
}

const PRICING_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Things Done.",
    description: "A calm GTD task manager. Free plan available, Pro at $4/mo.",
    offers: [
      { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
      { "@type": "Offer", price: "4.00", priceCurrency: "USD", name: "Pro", billingPeriod: "month" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default function PricingPage() {
  return (
    <>
      <SEOHead
        title="Pricing — Things Done. | Free & Pro Plans"
        description="Start free with up to 30 tasks, 3 projects, and 3 AI reviews/month. Upgrade to Pro for $4/mo for unlimited items, AI reviews, and brain dump capture."
        canonical={`${SITE_URL}/pricing`}
        jsonLd={PRICING_JSONLD}
      />
      {/* Hero */}
      <section className="bg-hero-bg px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 1, y: 0 }}
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
            tagline="Less than a coffee a month for unlimited everything."
          />
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 pb-24">
        <h2 className="mb-8 text-center text-xl font-semibold text-foreground">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm text-foreground text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent forceMount className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
