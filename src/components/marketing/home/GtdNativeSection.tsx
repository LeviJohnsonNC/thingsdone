import { motion } from "framer-motion";
import { SectionShell } from "./SectionShell";
import { MarketingImagePlaceholder } from "./MarketingImagePlaceholder";

const flow = ["Capture", "Clarify", "Organize", "Do", "Review"];

const modules: Array<{
  title: string;
  copy: string;
  label: string;
  accent: "moss" | "clay" | "amber";
}> = [
  {
    title: "Inbox",
    copy: "One trusted place for every loose thought, before it becomes a task.",
    label: "Inbox: capture without committing",
    accent: "moss",
  },
  {
    title: "Next Actions",
    copy: "The honest list of physical, doable actions, sorted by context and energy.",
    label: "Next Actions: by context & energy",
    accent: "amber",
  },
  {
    title: "Projects",
    copy: "Outcomes with multiple steps. Parallel or sequential. Your call.",
    label: "Projects: with next action surfaced",
    accent: "moss",
  },
  {
    title: "Waiting For",
    copy: "Things you're owed. Tracked with who, what, and how long.",
    label: "Waiting For: with follow-up timing",
    accent: "clay",
  },
  {
    title: "Someday / Maybe",
    copy: "Out of mind, not out of system. Reviewed weekly, never forgotten.",
    label: "Someday / Maybe: quiet but alive",
    accent: "moss",
  },
  {
    title: "Scheduled",
    copy: "Date-specific actions that surface on the day they belong, not before.",
    label: "Scheduled: surfaces on the day",
    accent: "amber",
  },
  {
    title: "Weekly Review",
    copy: "The keystone habit. Guided, structured, and impossible to skip by accident.",
    label: "Weekly Review: guided, 7 steps",
    accent: "moss",
  },
];

export function GtdNativeSection() {
  return (
    <SectionShell tone="cream" eyebrow="GTD-native structure" width="wide">
      <div className="max-w-3xl">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-ink">
          A real place for
          <br />
          <span className="italic text-moss-deep">every open loop.</span>
        </h2>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
          Things Done gives GTD concepts first-class places, so your system
          does not depend on hacks, workarounds, or perfect discipline.
        </p>
      </div>

      {/* Capture → Clarify → Do flow rail */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 mb-20"
      >
        <div className="rounded-2xl border border-hairline bg-paper px-6 py-8 md:px-10 md:py-10">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            {flow.map((step, i) => (
              <div key={step} className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
                    Step {i + 1}
                  </span>
                  <span className="font-display text-2xl md:text-3xl text-ink">
                    {step}
                  </span>
                </div>
                {i < flow.length - 1 && (
                  <span className="h-px w-10 md:w-16 bg-ink/15" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-soft leading-relaxed max-w-2xl">
            A loose thought is not a task yet. Things Done helps you decide
            what it means, where it belongs, and what the next physical
            action is.
          </p>
        </div>
      </motion.div>

      {/* GTD module grid - large modules, not tight bento */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {modules.map((m, i) => (
          <motion.article
            key={m.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: (i % 3) * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group flex flex-col rounded-2xl border border-hairline bg-paper p-6 md:p-7 hover:shadow-tactile transition-shadow"
          >
            <MarketingImagePlaceholder
              label={m.label}
              variant="module"
              accent={m.accent}
            />
            <div className="mt-6">
              <h3 className="font-display text-2xl md:text-[28px] text-ink leading-tight">
                {m.title}
              </h3>
              <p className="mt-2 text-sm md:text-[15px] text-ink-soft leading-relaxed">
                {m.copy}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}
