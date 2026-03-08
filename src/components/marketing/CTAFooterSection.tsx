import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTAFooterSection() {
  return (
    <section className="bg-background px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-lg text-center"
      >
        <h2 className="font-display text-3xl text-foreground sm:text-[2.5rem]">
          Ready to clear your mind?
        </h2>
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
