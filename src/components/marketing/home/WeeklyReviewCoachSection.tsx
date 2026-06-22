import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "./SectionShell";
import { MarketingImagePlaceholder } from "./MarketingImagePlaceholder";

const steps = [
  "Inbox",
  "Next Actions",
  "Waiting For",
  "Scheduled",
  "Someday / Maybe",
  "Projects",
  "Summary",
];

const coachCards = [
  {
    body: "This project has no next action.",
    project: "Renovate kitchen",
    actions: ["Clarify", "Keep"],
    accent: "clay" as const,
  },
  {
    body: "This Waiting For is 12 days old. Follow up?",
    project: "Refund from airline",
    actions: ["Follow up", "Keep"],
    accent: "amber" as const,
  },
  {
    body: "This action may be too vague. Try starting with a verb.",
    project: "Q3 planning",
    actions: ["Clarify", "Dismiss"],
    accent: "moss" as const,
  },
];

const accentBg: Record<"moss" | "clay" | "amber", string> = {
  moss: "bg-moss",
  clay: "bg-clay",
  amber: "bg-amber",
};

export function WeeklyReviewCoachSection() {
  return (
    <SectionShell tone="cream" eyebrow="Weekly Review" width="wide">
      <div className="max-w-3xl">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-ink">
          The Weekly Review
          <br />
          <span className="italic text-moss-deep">is built in.</span>
        </h2>
        <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl">
          Walk through your Inbox, Next Actions, Waiting For, Scheduled,
          Someday/Maybe, and Projects with a structured review that keeps
          your system alive.
        </p>
      </div>

      {/* 7-step rail */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14"
      >
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 lg:gap-2">
          {steps.map((step, i) => (
            <li
              key={step}
              className="relative rounded-2xl border border-hairline bg-paper p-5 lg:p-4"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">
                Step {i + 1}
              </span>
              <p className="mt-2 font-display text-xl lg:text-[22px] leading-tight text-ink">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Coach: the part people abandon */}
      <div className="mt-24 md:mt-32 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft font-medium mb-6">
            The part of GTD people actually abandon
          </p>
          <h3 className="font-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight text-ink">
            A coach for the
            <br />
            <span className="italic text-moss-deep">decay points.</span>
          </h3>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
            Pro plans include a reviewer that spots stale projects, vague
            actions, overdue Waiting Fors, and things that belong somewhere
            else, so your system does not quietly decay.
          </p>
          <p className="mt-4 text-sm text-ink-soft/80">
            Suggestions, never noise. You decide what sticks.
          </p>
        </motion.div>

        <div className="lg:col-span-7 space-y-3">
          {coachCards.map((card, i) => (
            <motion.div
              key={card.body}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group rounded-2xl border border-hairline bg-paper p-5 md:p-6 shadow-tactile/50 hover:shadow-tactile transition-shadow"
            >
              <div className="flex items-start gap-4">
                <span
                  className={`mt-2 h-2 w-2 rounded-full shrink-0 ${accentBg[card.accent]}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft/70">
                    {card.project}
                  </p>
                  <p className="mt-1.5 text-[17px] md:text-lg text-ink leading-snug">
                    {card.body}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {card.actions.map((a, j) => (
                      <button
                        key={a}
                        className={
                          j === 0
                            ? "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-medium text-cream"
                            : "inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-1.5 text-xs font-medium text-ink hover:bg-ink/5"
                        }
                      >
                        {a}
                        {j === 0 && <ArrowRight className="h-3 w-3" />}
                      </button>
                    ))}
                    <button className="ml-auto text-xs text-ink-soft hover:text-ink">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
