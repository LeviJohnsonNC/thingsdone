import { motion } from "framer-motion";
import { Inbox, SlidersHorizontal, FolderKanban, RefreshCw } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

const ACCENT_COLORS = [
  { bg: "bg-[hsl(213,58%,57%,0.12)]", text: "text-[hsl(213,58%,57%)]", stripe: "from-[hsl(213,58%,57%)] to-[hsl(220,65%,48%)]" },
  { bg: "bg-[hsl(96,60%,48%,0.12)]",  text: "text-[hsl(96,60%,48%)]",  stripe: "from-[hsl(96,60%,48%)] to-[hsl(150,50%,42%)]" },
  { bg: "bg-[hsl(36,90%,55%,0.12)]",  text: "text-[hsl(36,90%,55%)]",  stripe: "from-[hsl(36,90%,55%)] to-[hsl(28,80%,50%)]" },
  { bg: "bg-[hsl(270,50%,60%,0.12)]", text: "text-[hsl(270,50%,60%)]", stripe: "from-[hsl(270,50%,60%)] to-[hsl(250,55%,55%)]" },
];

const CARDS = [
  {
    icon: Inbox,
    title: "Capture fast",
    body: "Drop tasks, reminders, and loose thoughts into your inbox before they disappear.",
    mockup: "inbox" as const,
  },
  {
    icon: SlidersHorizontal,
    title: "Clarify the next step",
    body: "Turn vague reminders into real tasks with notes, time estimates, energy, and context.",
    mockup: "editor" as const,
  },
  {
    icon: FolderKanban,
    title: "Organize by context",
    body: "Sort work by project, area, schedule, waiting status, and someday items.",
    mockup: "project-detail" as const,
  },
  {
    icon: RefreshCw,
    title: "Review with confidence",
    body: "Run a weekly review that keeps your system current and your mind clear.",
    mockup: "review" as const,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            How Things Done works
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            A simple system for turning mental clutter into clear action.
          </p>
        </motion.div>

        {/* Card grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {CARDS.map((card, i) => {
            const accent = ACCENT_COLORS[i];
            // Alternate slide direction: odd from left, even from right
            const xOffset = i % 2 === 0 ? -30 : 30;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: xOffset }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                {/* Accent gradient stripe at top */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accent.stripe}`} />

                <div className="flex items-start gap-4 mb-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.bg}`}>
                    <card.icon className={`h-5 w-5 ${accent.text}`} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">
                      {card.body}
                    </p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-border/50">
                  <ProductMockup variant={card.mockup} compact />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}