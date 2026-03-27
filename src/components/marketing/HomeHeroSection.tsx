import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Inbox, Zap, FolderKanban, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const TYPED_TASKS = [
  "Call dentist to reschedule appointment",
  "Review Q3 budget proposal before Friday",
  "Buy birthday gift for Sarah",
  "Draft blog post outline for next week",
  "Research new project management tools",
];

const CATEGORY_PILLS = [
  { icon: Inbox, label: "Inbox" },
  { icon: Zap, label: "Next Actions" },
  { icon: FolderKanban, label: "Projects" },
  { icon: RefreshCw, label: "Weekly Review" },
];

function TypingDemo() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTask = TYPED_TASKS[taskIndex];

    if (!isDeleting && charIndex < currentTask.length) {
      const timeout = setTimeout(() => setCharIndex((c) => c + 1), 45 + Math.random() * 35);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex === currentTask.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => setCharIndex((c) => c - 1), 20);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTaskIndex((i) => (i + 1) % TYPED_TASKS.length);
    }
  }, [charIndex, isDeleting, taskIndex]);

  const displayText = TYPED_TASKS[taskIndex].slice(0, charIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mx-auto mt-12 max-w-xl"
    >
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Inbox className="h-3.5 w-3.5" />
          <span>Quick Capture</span>
        </div>
        <div className="flex items-center min-h-[28px]">
          <span className="text-[15px] text-foreground">{displayText}</span>
          <span className="typing-cursor ml-[1px] inline-block w-[2px] h-5 bg-primary" />
        </div>
      </div>
    </motion.div>
  );
}

export function HomeHeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden px-6 py-24 md:py-36">
      {/* Atmospheric gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl leading-[1.05] text-foreground sm:text-[4rem] md:text-[4.5rem]"
        >
          Capture everything.
          <br />
          Know what to do next.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-muted-foreground sm:text-lg"
        >
          Things Done helps you get tasks out of your head, organize them into a
          trusted system, and focus on what matters now.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-[15px] font-medium transition-transform hover:scale-[1.02]"
          >
            <Link to="/auth">Start for Free</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-[15px] font-medium"
          >
            <Link to="/features">See How It Works</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-3 text-[13px] text-muted-foreground"
        >
          Free forever · No credit card required
        </motion.p>

        {/* Typing demo */}
        <TypingDemo />

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {CATEGORY_PILLS.map((pill) => (
            <div
              key={pill.label}
              className="flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur-sm px-4 py-2 text-[13px] text-muted-foreground"
            >
              <pill.icon className="h-3.5 w-3.5 text-primary" />
              {pill.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Hidden real images for SEO */}
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
