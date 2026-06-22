import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { SectionShell } from "./SectionShell";
import { cn } from "@/lib/utils";

const tasks: Array<{ title: string; state: "next" | "blocked" }> = [
  { title: "Draft pricing copy", state: "next" },
  { title: "Verify Stripe test flow", state: "blocked" },
  { title: "Publish launch post", state: "blocked" },
  { title: "Email beta users", state: "blocked" },
];

export function SequentialProjectSection() {
  return (
    <SectionShell tone="sand" eyebrow="Sequential projects">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-ink">
            Sequential projects
            <br />
            only show the
            <br />
            <span className="italic text-moss-deep">next move.</span>
          </h2>
          <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-md">
            When a project has to happen in order, Things Done keeps later
            actions hidden until they are unblocked. Your Next Actions list
            stays honest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <div className="rounded-2xl border border-hairline bg-paper shadow-tactile p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-hairline">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70 mb-1">
                  Project
                </p>
                <h3 className="font-display text-2xl md:text-3xl text-ink">
                  Launch pricing page
                </h3>
              </div>
              <span className="rounded-full bg-moss/15 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-moss-deep">
                Sequential
              </span>
            </div>

            <ul className="space-y-2.5">
              {tasks.map((t, i) => {
                const isNext = t.state === "next";
                return (
                  <li
                    key={t.title}
                    className={cn(
                      "flex items-center gap-4 rounded-xl px-4 py-4 transition-colors",
                      isNext
                        ? "bg-amber/[0.08] border border-amber/30"
                        : "border border-hairline opacity-55"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                        isNext
                          ? "bg-amber text-cream"
                          : "bg-ink/5 text-ink/40"
                      )}
                    >
                      {isNext ? (
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      ) : (
                        <Lock className="h-3 w-3" strokeWidth={2.5} />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[15px] md:text-base text-ink",
                          !isNext && "line-through decoration-ink/20"
                        )}
                      >
                        {t.title}
                      </p>
                      <p className="text-xs text-ink-soft mt-0.5">
                        Step {i + 1} of {tasks.length}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-[0.18em]",
                        isNext ? "text-moss-deep" : "text-ink-soft/60"
                      )}
                    >
                      {isNext ? "Next" : "Blocked"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-sm text-ink-soft border-t border-hairline pt-4">
              Only <span className="text-ink font-medium">Draft pricing copy</span>{" "}
              appears in your Next Actions list. The rest stay quiet until
              their turn.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
