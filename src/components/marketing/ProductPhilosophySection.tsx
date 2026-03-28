import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Layers, Sparkles } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

const TABS = [
  {
    id: "sequential",
    icon: GitBranch,
    label: "Sequential Projects",
    heading: "Only see work you can actually do",
    body: "When a project is marked sequential, only the first incomplete action surfaces in your Next Actions list. Blocked tasks stay hidden until it's their turn. Your Next Actions list stays clean and trustworthy — showing only work you can move on right now. That's a core GTD principle most apps ignore.",
    mockup: "project-detail" as const,
  },
  {
    id: "gtd-lists",
    icon: Layers,
    label: "Every GTD List",
    heading: "The complete GTD vocabulary, built in",
    body: "Things Done includes every GTD state natively — Inbox, Next Actions, Waiting For, Scheduled, Someday/Maybe, Reference, and Logbook. No plugins. No workarounds. No setting up tags to simulate states that should just exist.",
    mockup: "inbox" as const,
  },
  {
    id: "ai-coach",
    icon: Sparkles,
    label: "AI Review Coach",
    heading: "A GTD coach for your weekly review",
    body: "The built-in AI doesn't give you generic productivity advice. It reads your actual lists the way a GTD coach would — flagging stalled projects, surfacing overdue waiting-fors, suggesting whether inbox items should be next actions or someday. Available on Pro.",
    mockup: "review" as const,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function ProductPhilosophySection() {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleTabChange = (i: number) => {
    setDirection(i > activeTab ? 1 : -1);
    setActiveTab(i);
  };

  return (
    <section className="bg-[hsl(222,47%,8%)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-12 max-w-xl text-center font-display text-3xl text-[hsl(210,40%,96%)] sm:text-[2.5rem]"
        >
          The features other apps don't have.
        </motion.h2>

        {/* Tab buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(i)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                activeTab === i
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-[hsl(217,33%,15%)] border border-[hsl(217,33%,22%)] text-[hsl(215,20%,60%)] hover:text-[hsl(210,40%,96%)] hover:border-primary/30"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <div className="rounded-2xl border border-[hsl(217,33%,18%)] bg-[hsl(222,47%,10%)] p-6 md:p-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              {/* Text */}
              <div>
                <h3 className="text-xl font-semibold text-[hsl(210,40%,96%)] sm:text-2xl">
                  {TABS[activeTab].heading}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[hsl(215,20%,60%)]">
                  {TABS[activeTab].body}
                </p>
              </div>

              {/* Mockup */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="overflow-hidden rounded-xl border border-[hsl(217,33%,22%)]"
              >
                <ProductMockup variant={TABS[activeTab].mockup} compact />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
