import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HomeCTASection() {
  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-lg text-center"
      >
        <h2 className="font-display text-3xl text-foreground sm:text-[2.5rem]">
          Build a system you can trust.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Capture tasks, organize projects, and stay clear on what matters next.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            asChild
            size="lg"
            className="btn-shimmer rounded-full px-8 text-[15px] font-medium transition-transform hover:scale-[1.02]"
          >
            <Link to="/auth">Get Started Free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-[15px] font-medium"
          >
            <Link to="/features">Learn More</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}