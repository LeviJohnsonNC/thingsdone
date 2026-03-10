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
          initial={{ opacity: 1, y: 0 }}
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

        {/* Product visual — real <img> screenshots for SEO */}
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          {/* Primary frame */}
          <div className="relative z-10">
            <ProductMockup variant="tasks" />
          </div>
          {/* Overlapping editor screenshot as real img */}
          <div className="absolute -bottom-6 -right-4 z-20 w-[55%] shadow-xl sm:-bottom-8 sm:-right-6">
            <ProductMockup variant="editor" compact />
          </div>
        </motion.div>
      </div>

      {/* Hidden real images for SEO — crawlable <img> tags with descriptive alt text */}
      <div className="sr-only" aria-hidden="false">
        <img
          src="/og-image.png"
          alt="Things Done inbox view showing quick task capture with keyboard shortcut support"
          width="1200"
          height="630"
          loading="lazy"
        />
        <img
          src="/og-image.png"
          alt="Things Done task editor with energy level, time estimates, and project organization"
          width="1200"
          height="630"
          loading="lazy"
        />
        <img
          src="/og-image.png"
          alt="Things Done weekly review wizard with AI-powered task suggestions and brain dump"
          width="1200"
          height="630"
          loading="lazy"
        />
      </div>
    </section>
  );
}
