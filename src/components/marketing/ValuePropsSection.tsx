import { motion } from "framer-motion";
import { Inbox, Zap, Clock, RefreshCw } from "lucide-react";

const PROPS = [
  {
    icon: Inbox,
    title: "Capture everything",
    desc: "Get ideas out of your head and into a system you trust. Inbox, brain dump, quick capture.",
  },
  {
    icon: Zap,
    title: "Know what's next",
    desc: "Your task list is smart enough to show you what matters right now — not everything at once.",
  },
  {
    icon: Clock,
    title: "Never drop the ball",
    desc: "Track what you're waiting on, what's scheduled, and what you're saving for later.",
  },
  {
    icon: RefreshCw,
    title: "Review & reflect",
    desc: "A weekly review that keeps your system clean and your mind clear. Coming soon with AI assistance.",
  },
];

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function ValuePropsSection() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto grid max-w-4xl gap-12 sm:grid-cols-2">
        {PROPS.map((prop, i) => (
          <motion.div
            key={prop.title}
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <prop.icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{prop.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{prop.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
