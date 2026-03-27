import { motion } from "framer-motion";
import { Inbox, SlidersHorizontal, FolderKanban, RefreshCw } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

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
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
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
          ))}
        </div>
      </div>
    </section>
  );
}
