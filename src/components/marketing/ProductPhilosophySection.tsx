import { motion } from "framer-motion";
import { Inbox, Zap, RefreshCw } from "lucide-react";

const BLOCKS = [
  {
    icon: Inbox,
    heading: "Inbox first",
    body: "Capture quickly now, organize later. Things Done helps you get ideas out of your head before they vanish.",
  },
  {
    icon: Zap,
    heading: "Real next actions",
    body: "Break work down into clear, doable steps instead of collecting vague tasks that just sit there.",
  },
  {
    icon: RefreshCw,
    heading: "Review built in",
    body: "Weekly review is part of the system, not an afterthought. Stay current without relying on memory.",
  },
];

export function ProductPhilosophySection() {
  return (
    <section className="bg-hero-bg px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-xl text-center text-2xl font-semibold text-foreground sm:text-3xl"
        >
          Built for people who think in systems, not just lists.
        </motion.h2>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {BLOCKS.map((block, i) => (
            <motion.div
              key={block.heading}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <block.icon className="mb-4 h-5 w-5 text-primary" />
              <h3 className="text-[15px] font-semibold text-foreground">
                {block.heading}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
