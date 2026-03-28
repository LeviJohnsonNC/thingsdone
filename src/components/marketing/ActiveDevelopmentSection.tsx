import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SHIPPED = [
  "AI brain dump — turn free-form thoughts into organized inbox items",
  "Sequential project mode — only surface unblocked next actions",
  "Google Calendar sync — push scheduled items to your calendar",
  "Recurring tasks — daily, weekly, or custom recurrence rules",
];

export function ActiveDevelopmentSection() {
  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-sm font-medium tracking-wide uppercase text-muted-foreground"
        >
          Actively maintained
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 font-display text-3xl text-foreground sm:text-[2.5rem]"
        >
          New features, every month.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-[15px] text-muted-foreground"
        >
          Things Done ships updates regularly. Your system won't stagnate.
        </motion.p>

        {/* Shipped items */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SHIPPED.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="flex items-start gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-[13px] leading-snug text-foreground"
            >
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
