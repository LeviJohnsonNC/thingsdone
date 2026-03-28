import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

const REVIEW_STEPS = [
  "Inbox — process every captured item",
  "Next Actions — check each one is still relevant",
  "Waiting For — follow up on stalled handoffs",
  "Scheduled — confirm upcoming commitments",
  "Someday / Maybe — re-evaluate deferred ideas",
  "Projects — ensure every project has a next action",
  "Summary — reflect and close out the week",
];

export function WeeklyReviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="dot-grid-bg relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl items-start gap-12 md:grid-cols-2 md:gap-16">
        {/* Visual — parallax-lite */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-border shadow-xl shadow-primary/5"
        >
          <ProductMockup variant="review" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-display text-3xl leading-[1.12] text-foreground sm:text-[2.5rem]">
            Most GTD systems fail here. Ours doesn't.
          </h2>

          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            The weekly review is the engine that keeps GTD running. Skip it and
            your lists go stale, your head fills back up, and the system stops
            working. Things Done makes the review a first-class feature — not an
            afterthought.
          </p>

          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            A guided 7-step walkthrough covers every list in your system:
          </p>

          {/* 7-step list */}
          <ol className="mt-4 space-y-2">
            {REVIEW_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] leading-snug text-muted-foreground"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          {/* AI coach callout */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-card/80 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-[13px] leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Pro:</span>{" "}
              An AI coach joins each step — flagging stalled projects, surfacing
              overdue waiting-fors, and writing a summary when you're done.
            </p>
          </div>

          <Link
            to="/features"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            See the full review walkthrough
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
