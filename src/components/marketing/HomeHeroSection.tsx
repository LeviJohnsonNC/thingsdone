import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductMockup } from "./ProductMockup";

export function HomeHeroSection() {
  return (
    <section className="bg-hero-bg px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="font-display text-4xl leading-[1.08] text-foreground sm:text-[3.25rem]">
            Capture everything.
            <br />
            Know what to do next.
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground sm:text-lg">
            Things Done helps you get tasks out of your head, organize them into
            a trusted system, and focus on what matters now.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-lg px-8 text-[15px] font-medium transition-transform hover:scale-[1.02]"
            >
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Free forever · No credit card required
          </p>
        </motion.div>

        {/* Product visual */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          {/* Primary frame */}
          <ProductMockup variant="tasks" className="relative z-10" />
          {/* Secondary overlapping frame */}
          <ProductMockup
            variant="editor"
            compact
            className="absolute -bottom-6 -right-4 z-20 w-[55%] shadow-xl sm:-bottom-8 sm:-right-6"
          />
        </motion.div>
      </div>
    </section>
  );
}
