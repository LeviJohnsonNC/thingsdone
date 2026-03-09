import { motion } from "framer-motion";
import { ProductMockup } from "./ProductMockup";
import heroInbox from "@/assets/blog/hero-todo-list.jpg";
import heroReview from "@/assets/blog/hero-open-loops.jpg";
import heroProjects from "@/assets/blog/hero-chaos-to-calm.jpg";

const STEPS = [
  {
    num: "01",
    title: "Capture fast",
    body: "Drop tasks, reminders, and loose thoughts into your inbox before they disappear.",
    mockup: "inbox" as const,
  },
  {
    num: "02",
    title: "Clarify the next step",
    body: "Turn vague reminders into real tasks with notes, time estimates, energy, and context.",
    mockup: "editor" as const,
  },
  {
    num: "03",
    title: "Organize by context",
    body: "Sort work by project, area, schedule, waiting status, and someday items so your list stays useful.",
    mockup: "projects" as const,
  },
  {
    num: "04",
    title: "Review with confidence",
    body: "Run a weekly review that keeps your system current and your mind clear.",
    mockup: "review" as const,
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-background px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-lg"
        >
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            How Things Done works
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            A simple system for turning mental clutter into clear action.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-20 md:space-y-28">
          {STEPS.map((step, i) => {
            const reverse = i % 2 !== 0;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.05 }}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
                  reverse ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* Text */}
                <div className={reverse ? "md:[direction:ltr]" : ""}>
                  <span className="text-sm font-semibold tracking-wider text-primary">
                    {step.num}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-foreground sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>

                {/* Visual */}
                <div className={reverse ? "md:[direction:ltr]" : ""}>
                  <ProductMockup
                    variant={step.mockup}
                    compact
                    className="mx-auto max-w-sm md:max-w-none"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Product screenshot images for SEO */}
        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <img
            src={heroInbox}
            alt="Things Done inbox view showing quick task capture for GTD workflow"
            width={600}
            height={338}
            loading="lazy"
            className="rounded-xl w-full object-cover aspect-video"
          />
          <img
            src={heroReview}
            alt="Things Done weekly review checklist with progress tracking"
            width={600}
            height={338}
            loading="lazy"
            className="rounded-xl w-full object-cover aspect-video"
          />
          <img
            src={heroProjects}
            alt="Things Done project list organized by GTD contexts and areas"
            width={600}
            height={338}
            loading="lazy"
            className="rounded-xl w-full object-cover aspect-video"
          />
        </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
