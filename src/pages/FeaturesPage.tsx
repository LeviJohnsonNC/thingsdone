import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
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
      initial={{ opacity: 1, y: 0 }}
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

/* ── Feature groups ── */

const CAPTURE_FEATURES: Omit<FeatureBlockProps, "">[] = [
  {
    title: "Instant Inbox Capture",
    body: "Drop any task, reminder, or half-formed idea into your inbox in under a second. Use the quick-add bar, the floating action button, or the global keyboard shortcut (Ctrl+K) — whichever is fastest in the moment. Things Done also supports natural language dates, so typing 'Call dentist next Tuesday at 2pm' automatically sets the scheduled date for you. Your inbox is a holding pen, not a to-do list — capture freely and organize later. This is the cornerstone of any effective GTD® task manager: frictionless capture means nothing falls through the cracks.",
    mockup: "inbox",
  },
  {
    title: "Clarify with Context",
    body: "When you process your inbox, the clarify sheet guides you through the GTD decision tree: Is this actionable? What's the very next step? Does it belong to a project? Add energy level (low, medium, high), time estimates, areas of responsibility, and tags so you can filter by context later. Attach notes and checklists to keep supporting information right where you need it — no switching apps. Clarifying transforms vague reminders into concrete next actions, which is what separates a real productivity system from a simple to-do list.",
    mockup: "editor",
    reverse: true,
  },
];

const ORGANIZE_FEATURES: Omit<FeatureBlockProps, "">[] = [
  {
    title: "Sequential & Parallel Projects",
    body: "In GTD, a project is any outcome requiring more than one action step. Things Done supports both sequential projects — where only the first incomplete action appears in your Next view — and parallel projects where all actions are available at once. Drag to reorder steps, set project-level due dates, and track progress with a visual completion indicator. Each project can belong to an area of responsibility so your commitments stay organized by life context. Whether you're managing a product launch or planning a vacation, project management in Things Done keeps multi-step work moving forward without clutter.",
    mockup: "projects",
  },
  {
    title: "Focus Mode",
    body: "Star the tasks that matter most today to surface them in Focus view. When you have 20 minutes between meetings, Focus mode shows only what you've committed to right now — not your entire backlog. Swipe right on any item to star it, swipe left to un-star. It's a deliberate, distraction-free workspace designed to keep you moving on your highest-priority work without decision fatigue. Focus mode turns your GTD next actions list into a curated, intention-driven daily plan so you always know exactly what to work on.",
    mockup: "tasks",
    reverse: true,
  },
];

const REVIEW_FEATURES: Omit<FeatureBlockProps, "">[] = [
  {
    title: "Google Calendar Sync",
    body: "Connect your Google Calendar to see events alongside your action lists in a unified daily view. Push scheduled tasks to your calendar with one tap so time-blocked commitments show up where your team expects them. Things Done never double-books you — when you schedule a task for a specific date, it respects your existing calendar events. Calendar sync is available on both the Free and Pro plans, making it easy to blend your productivity system with your existing workflow.",
    mockup: "tasks",
  },
  {
    title: "AI-Powered Weekly Reviews",
    body: "The weekly review is the heartbeat of GTD — and the habit most people skip. Things Done makes it effortless with a guided, step-by-step review wizard. Clear your inbox, review each project for a clear next action, check your Waiting For list, and scan Someday/Maybe for anything that sparks energy. On Pro, the AI assistant surfaces stale tasks, suggests next actions, and even converts a free-form brain dump into ready-to-file tasks with suggested state, energy, and time estimates. A consistent weekly review is what transforms a task manager from a graveyard of forgotten items into a trusted productivity system you rely on every day.",
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
        canonical={`${SITE_URL}/features`}
      />
      {/* Hero */}
      <section className="bg-hero-bg px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
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

      {/* Capture & Organize */}
      <section className="mx-auto max-w-4xl px-6">
        <h2 className="pt-16 text-xl font-semibold text-foreground sm:text-2xl">Capture &amp; Organize</h2>
        {CAPTURE_FEATURES.map((f) => (
          <FeatureBlock key={f.title} title={f.title} body={f.body} mockup={f.mockup} reverse={f.reverse} />
        ))}
      </section>

      {/* Focus & Execute */}
      <section className="mx-auto max-w-4xl px-6">
        <h2 className="pt-4 text-xl font-semibold text-foreground sm:text-2xl">Focus &amp; Execute</h2>
        {ORGANIZE_FEATURES.map((f) => (
          <FeatureBlock key={f.title} title={f.title} body={f.body} mockup={f.mockup} reverse={f.reverse} />
        ))}
      </section>

      {/* Review & Improve */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <h2 className="pt-4 text-xl font-semibold text-foreground sm:text-2xl">Review &amp; Improve</h2>
        {REVIEW_FEATURES.map((f) => (
          <FeatureBlock key={f.title} title={f.title} body={f.body} mockup={f.mockup} reverse={f.reverse} />
        ))}
      </section>
    </>
  );
}
