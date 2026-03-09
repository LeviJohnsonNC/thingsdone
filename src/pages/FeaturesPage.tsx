import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { ProductMockup } from "@/components/marketing/ProductMockup";

type MockupVariant = "tasks" | "inbox" | "editor" | "projects" | "review";

interface FeatureBlockProps {
  title: string;
  body: string;
  mockup: MockupVariant;
  reverse?: boolean;
}

function FeatureBlock({ title, body, mockup, reverse }: FeatureBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-8 py-16 md:flex-row md:items-center md:gap-16 ${reverse ? "md:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-md">{body}</p>
      </div>
      <div className="flex-1">
        <ProductMockup variant={mockup} compact className="mx-auto max-w-sm md:max-w-none" />
      </div>
    </motion.div>
  );
}

const FEATURES: Omit<FeatureBlockProps, "">[] = [
  {
    title: "Get it out of your head",
    body: "Quick capture to your Inbox. Brain dump freely — organize later. Nothing gets lost.",
    mockup: "inbox",
  },
  {
    title: "Everything in its place",
    body: "Sort tasks by state — Next, Waiting, Scheduled, Someday. Tag them with energy level, time estimates, and areas of focus.",
    mockup: "editor",
    reverse: true,
  },
  {
    title: "Break big things into small steps",
    body: "Sequential and parallel projects. Drag to reorder. The system surfaces the right next action automatically.",
    mockup: "projects",
  },
  {
    title: "See only what matters right now",
    body: "Focus mode cuts through the noise. Star what's important today and ignore the rest.",
    mockup: "tasks",
    reverse: true,
  },
  {
    title: "Your tasks and your calendar, together",
    body: "Connect Google Calendar to see events alongside your actions. Never double-book your time.",
    mockup: "tasks",
  },
  {
    title: "An assistant that keeps you unstuck",
    body: "AI-powered weekly reviews surface stale tasks, suggest next actions, and keep your system fresh. Free users get 3 AI reviews per month — Pro unlocks unlimited AI plus brain dump capture.",
    mockup: "review",
    reverse: true,
  },
];

export default function FeaturesPage() {
  return (
    <>
      <SEOHead
        title="Features — Things Done. | GTD Task Manager"
        description="Inbox capture, Next actions, Focus mode, Google Calendar sync, sequential projects, and AI-powered weekly reviews. Everything you need to stay on top of everything."
        canonical="https://thingsdone.lovable.app/features"
      />
      {/* Hero */}
      <section className="bg-hero-bg px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl text-foreground sm:text-[2.5rem]">
            Everything you need to
            <br />
            stay on top of everything.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Built on proven productivity principles, designed for clarity.
          </p>
        </motion.div>
      </section>

      {/* Feature blocks */}
      <section className="mx-auto max-w-4xl px-6">
        {FEATURES.map((f) => (
          <FeatureBlock
            key={f.title}
            title={f.title}
            body={f.body}
            mockup={f.mockup}
            reverse={f.reverse}
          />
        ))}
      </section>
    </>
  );
}
