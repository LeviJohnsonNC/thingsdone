import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HomeCTASection() {
  return (
    <section className="bg-hero-bg px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg text-center"
      >
        <h2 className="font-display text-3xl text-foreground sm:text-[2.5rem]">
          Build a system you can trust.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Capture tasks, organize projects, and stay clear on what matters next.
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
      </motion.div>
    </section>
  );
}
