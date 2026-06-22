import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "./SectionShell";
import heroImage from "@/assets/hero-image.png.asset.json";

export function HeroV2() {
  return (
    <SectionShell
      tone="cream"
      width="wide"
      grain
      className="pt-24 md:pt-32 lg:pt-40 pb-20 md:pb-28 lg:pb-32"
      containerClassName="lg:px-16"
    >
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7"
        >
          <p className="mb-8 text-[11px] uppercase tracking-[0.24em] text-ink-soft font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-moss mr-3 align-middle" />
            GTD-native task management
          </p>

          <h1 className="font-display text-[44px] sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95] tracking-tight text-ink">
            Your brain
            <br />
            is not a
            <br />
            <span className="italic text-moss-deep">storage unit.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg md:text-xl text-ink-soft leading-relaxed">
            Capture every open loop, clarify the next action, and keep your
            system alive with a guided Weekly Review, built the way David
            Allen drew it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-cream transition-all hover:bg-moss-deep"
            >
              Start free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
            >
              See how it works
            </Link>
          </div>

          <p className="mt-6 text-xs text-ink-soft/80 tracking-wide">
            Free to start · No card · Built for real GTD practice
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <figure className="group">
            <div className="relative w-full overflow-hidden rounded-2xl border border-hairline bg-paper shadow-tactile">
              <img
                src={heroImage.url}
                alt="GTD workflow: capture, clarify, and organize open loops into clear next actions"
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </figure>
        </motion.div>
      </div>
    </SectionShell>
  );
}
