import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { Inbox, SlidersHorizontal, FolderKanban, Star, Calendar, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureBlockProps {
  title: string;
  body: string;
  icon: ReactNode;
  reverse?: boolean;
  badge?: string;
}

function FeatureBlock({ title, body, icon, reverse, badge }: FeatureBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col gap-8 py-16 md:flex-row md:items-center md:gap-16 ${reverse ? "md:flex-row-reverse" : ""}`}
    >
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h3>
          {badge && (
            <Badge variant="secondary" className="text-xs font-normal">{badge}</Badge>
          )}
        </div>
        <p className="text-[15px] leading-relaxed text-muted-foreground max-w-md">{body}</p>
      </div>
      {/* Placeholder visual */}
      <div className="flex flex-1 items-center justify-center rounded-xl border border-border bg-feature-card-bg p-12">
        <div className="text-muted-foreground/30">{icon}</div>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    title: "Get it out of your head",
    body: "Quick capture to your Inbox. Brain dump freely — organize later. Nothing gets lost.",
    icon: <Inbox className="h-16 w-16" />,
  },
  {
    title: "Everything in its place",
    body: "Sort tasks by state — Next, Waiting, Scheduled, Someday. Tag them with energy level, time estimates, and areas of focus.",
    icon: <SlidersHorizontal className="h-16 w-16" />,
    reverse: true,
  },
  {
    title: "Break big things into small steps",
    body: "Sequential and parallel projects. Drag to reorder. The system surfaces the right next action automatically.",
    icon: <FolderKanban className="h-16 w-16" />,
  },
  {
    title: "See only what matters right now",
    body: "Focus mode cuts through the noise. Star what's important today and ignore the rest.",
    icon: <Star className="h-16 w-16" />,
    reverse: true,
  },
  {
    title: "Your tasks and your calendar, together",
    body: "Connect Google Calendar to see events alongside your actions. Never double-book your time.",
    icon: <Calendar className="h-16 w-16" />,
  },
  {
    title: "An assistant that keeps you unstuck",
    body: "AI-powered weekly reviews surface stale tasks, suggest next actions, and keep your system fresh — automatically.",
    icon: <Bot className="h-16 w-16" />,
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
            icon={f.icon}
            reverse={f.reverse}
            badge={f.badge}
          />
        ))}
      </section>
    </>
  );
}
