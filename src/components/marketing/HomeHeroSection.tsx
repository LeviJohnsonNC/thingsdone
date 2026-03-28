import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Zap,
  Clock,
  CalendarDays,
  Lightbulb,
  FolderKanban,
  RefreshCw,
} from "lucide-react";

const GTD_VIEWS = [
  { icon: Inbox, label: "Inbox" },
  { icon: Zap, label: "Next Actions" },
  { icon: Clock, label: "Waiting For" },
  { icon: CalendarDays, label: "Scheduled" },
  { icon: Lightbulb, label: "Someday / Maybe" },
  { icon: FolderKanban, label: "Projects" },
  { icon: RefreshCw, label: "Weekly Review" },
];

export function HomeHeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden px-6 py-24 md:py-36">
      {/* SVG noise texture overlay */}
      <svg className="noise-overlay" aria-hidden="true">
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* Animated gradient orbs — reduced opacity */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-1 absolute -top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="orb-2 absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-accent/[0.05] blur-[100px]" />
        <div className="orb-3 absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.04] blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Positioning pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5 text-[13px] font-medium text-muted-foreground"
        >
          <RefreshCw className="h-3.5 w-3.5 text-primary" />
          The GTD-native task manager
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display text-5xl leading-[1.05] text-foreground sm:text-[4rem] md:text-[4.5rem]"
        >
          Your trusted system.
          <br />
          Finally an app for it.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-lg"
        >
          Most task apps make you bend GTD to fit their structure. Things Done is
          built around it — Inbox, Next Actions, Waiting For, Someday/Maybe,
          sequential projects, and a guided Weekly Review. All built in, not
          configured.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
        >
          <Button
            asChild
            size="lg"
            className="btn-shimmer rounded-full px-8 text-[15px] font-medium transition-transform hover:scale-[1.02]"
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
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-3 text-[13px] text-muted-foreground"
        >
          Free forever · No credit card required
        </motion.p>

        {/* GTD views strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mx-auto mt-12 max-w-2xl"
        >
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 shadow-lg">
            <p className="text-xs font-medium text-muted-foreground mb-4 tracking-wide uppercase">
              Every GTD list, built in
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {GTD_VIEWS.map((view, i) => (
                <motion.div
                  key={view.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.7 + i * 0.06 }}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[13px] text-foreground"
                >
                  <view.icon className="h-3.5 w-3.5 text-primary" />
                  {view.label}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden real images for SEO */}
      <div className="sr-only" aria-hidden="false">
        <img src="/og-image.png" alt="Things Done inbox view showing quick task capture with keyboard shortcut support" width="1200" height="630" loading="lazy" />
        <img src="/og-image.png" alt="Things Done task editor with energy level, time estimates, and project organization" width="1200" height="630" loading="lazy" />
        <img src="/og-image.png" alt="Things Done weekly review wizard with AI-powered task suggestions and brain dump" width="1200" height="630" loading="lazy" />
      </div>
    </section>
  );
}
