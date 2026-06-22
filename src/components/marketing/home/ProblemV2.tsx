import { motion } from "framer-motion";
import { SectionShell } from "./SectionShell";
import { MarketingImagePlaceholder } from "./MarketingImagePlaceholder";

export function ProblemV2() {
  return (
    <SectionShell tone="paper" eyebrow="The problem">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-ink">
            Most task apps
            <br />
            make you rebuild
            <br />
            <span className="italic text-clay">GTD by hand.</span>
          </h2>

          <div className="mt-8 space-y-5 text-lg text-ink-soft leading-relaxed max-w-xl">
            <p>
              Tags become contexts. Filters become lists. The Weekly Review
              becomes a forgotten checklist somewhere in your notes app.
            </p>
            <p>
              Eventually the system drifts, and your brain starts carrying
              the load again.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <MarketingImagePlaceholder
            label="Generic Apps Make GTD Your Job"
            caption="Scattered tags, filters, notes, reminders, and spreadsheets"
            variant="module"
            accent="clay"
          />
        </motion.div>
      </div>
    </SectionShell>
  );
}
