import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function WeeklyReviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section ref={sectionRef} className="dot-grid-bg relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
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
            Stay current without carrying everything in your head.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Things Done helps you regularly review inbox items, next actions,
            waiting work, scheduled tasks, someday items, and projects — so
            nothing important gets lost.
          </p>
          <Link
            to="/features"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            See how it works
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}