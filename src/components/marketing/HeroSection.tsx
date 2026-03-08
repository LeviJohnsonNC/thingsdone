import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-hero-bg px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <h1 className="font-display text-4xl leading-tight text-foreground sm:text-[3.5rem] sm:leading-[1.1]">
          Clear your mind.
          <br />
          Own your day.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground sm:text-xl">
          The task manager that helps you capture everything and always know what to do next.
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-lg px-8 text-[15px] font-medium transition-transform hover:scale-[1.02]"
          >
            <Link to="/auth">Get Started Free</Link>
          </Button>
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Free forever · No credit card
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}
