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
    body: "Everything lands in the inbox — the GTD capture bucket. Quick-add from anywhere, and nothing leaks into an unorganized pile. Process later, on your schedule.",
    mockup: "inbox" as const,
  },
  {
    icon: SlidersHorizontal,
    title: "Clarify the next step",
    body: "Turn vague stuff into real next actions. Set an energy level, time estimate, project, area, due date, or waiting-on contact — the full GTD clarify step, built into every item.",
    mockup: "editor" as const,
  },
  {
    icon: FolderKanban,
    title: "Organize by context",
    body: "In sequential projects, only the first unblocked action appears in your Next Actions — so your lists only show work you can actually do. Waiting For, Someday/Maybe, and Scheduled are first-class states, not tags.",
    mockup: "project-detail" as const,
  },
  {
    icon: RefreshCw,
    title: "Review with confidence",
    body: "A guided 7-step weekly review walks you through every GTD list — inbox, next actions, waiting for, scheduled, someday, and projects. Nothing gets skipped.",
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
            The full GTD system. Out of the box.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Every GTD workflow is built in natively — not something you configure with tags, filters, or workarounds.
          </p>
        </motion.div>

        {/* Card grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {CARDS.map((card, i) => {
            const accent = ACCENT_COLORS[i];
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
