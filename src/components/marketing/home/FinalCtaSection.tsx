import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "./SectionShell";

const today = [
  "Check passport expiry dates",
  "Draft Q3 strategy outline",
  "Book dentist appointment",
];

export function FinalCtaSection() {
  return (
    <SectionShell tone="ink" grain className="py-28 md:py-36 lg:py-44">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.24em] text-cream/60 font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber mr-3 align-middle" />
            Start with a clear head
          </p>

          <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] leading-[0.98] tracking-tight text-cream">
            Capture one loop.
            <br />
            Clarify one action.
            <br />
            <span className="italic text-amber">Feel it click.</span>
          </h2>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-ink transition-all hover:bg-paper"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-cream/5"
            >
              See the full system
            </Link>
          </div>

          <p className="mt-6 text-xs text-cream/60 tracking-wide">
            No credit card required.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl bg-cream/[0.04] border border-cream/10 backdrop-blur-sm p-7 md:p-8">
            <div className="flex items-center justify-between mb-7 pb-5 border-b border-cream/10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50 mb-1">
                  Today
                </p>
                <p className="font-display text-2xl text-cream">Three things</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-cream/40">
                3 of 3
              </span>
            </div>

            <ul className="space-y-4">
              {today.map((t) => (
                <li key={t} className="flex items-center gap-3.5">
                  <span className="h-5 w-5 rounded-full border border-cream/25 shrink-0" />
                  <span className="text-base text-cream/90">{t}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 pt-5 border-t border-cream/10 text-sm text-cream/55 italic font-display">
              The rest is in its proper place.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
