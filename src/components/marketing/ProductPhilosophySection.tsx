import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, FolderKanban, RefreshCw } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

const TABS = [
  {
    id: "capture",
    icon: Inbox,
    label: "Capture",
    heading: "Get it out of your head — fast",
    body: "Capture tasks, ideas, and reminders the moment they hit you. Things Done's inbox-first approach means nothing gets lost, and you can organize later when you're ready.",
    mockup: "inbox" as const,
  },
  {
    id: "organize",
    icon: FolderKanban,
    label: "Organize",
    heading: "Structure that actually works",
    body: "Break work into projects, tag by area, set energy levels, and schedule for later. Every task gets the right context so your lists stay useful — not overwhelming.",
    mockup: "project-detail" as const,
  },
  {
    id: "review",
    icon: RefreshCw,
    label: "Review",
    heading: "Stay current without relying on memory",
    body: "A built-in weekly review walks you through inbox items, stale tasks, project progress, and someday items. Keep your system trustworthy with zero extra effort.",
    mockup: "review" as const,
  },
];

export function ProductPhilosophySection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-hero-bg px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-xl text-center font-display text-3xl text-foreground sm:text-[2.5rem]"
        >
          Built for people who think in systems, not just lists.
        </motion.h2>

        {/* Tab buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex justify-center gap-2"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                activeTab === i
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              {/* Text */}
              <div>
                <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {TABS[activeTab].heading}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {TABS[activeTab].body}
                </p>
              </div>

              {/* Mockup */}
              <div className="overflow-hidden rounded-xl border border-border/50">
                <ProductMockup variant={TABS[activeTab].mockup} compact />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
