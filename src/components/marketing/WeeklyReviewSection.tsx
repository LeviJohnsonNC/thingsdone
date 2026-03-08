import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductMockup } from "./ProductMockup";

export function WeeklyReviewSection() {
  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <ProductMockup variant="review" />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-display text-3xl leading-[1.12] text-foreground sm:text-[2.5rem]">
            Stay current without carrying everything in your head.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Things Done helps you regularly review inbox items, next actions,
            waiting work, scheduled tasks, someday items, and projects — so
            nothing important gets lost.
          </p>
          <Link
            to="/features"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            See how it works
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
