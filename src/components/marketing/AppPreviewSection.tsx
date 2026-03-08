import { motion } from "framer-motion";
import { CheckSquare, Star, Calendar, FolderOpen } from "lucide-react";

export function AppPreviewSection() {
  return (
    <section className="bg-hero-bg px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        {/* Placeholder app frame */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-destructive/30" />
              <span className="h-3 w-3 rounded-full bg-focus-gold/30" />
              <span className="h-3 w-3 rounded-full bg-success-green/30" />
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Things Done</span>
          </div>
          {/* Mock content */}
          <div className="grid gap-0 divide-y divide-border">
            {[
              { icon: CheckSquare, text: "Review quarterly goals", tag: "Focus" },
              { icon: Star, text: "Prepare team presentation", tag: "Next" },
              { icon: Calendar, text: "Schedule dentist appointment", tag: "Scheduled" },
              { icon: FolderOpen, text: "Research new project tools", tag: "Someday" },
            ].map((row) => (
              <div key={row.text} className="flex items-center gap-3 px-5 py-3.5">
                <row.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm text-foreground">{row.text}</span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs text-muted-foreground">
                  {row.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[15px] text-muted-foreground">
          Organize by projects, areas, energy, and time — then let the system tell you what to do.
        </p>
      </motion.div>
    </section>
  );
}
