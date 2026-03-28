import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const PAIN_POINTS = [
  {
    label: "Cluttered Next Actions",
    body: "Your Next Actions list shows tasks from every project — including ones blocked by prior steps. Without sequential project support, you're constantly scanning past work you can't do yet.",
  },
  {
    label: "Weekly Review? DIY.",
    body: "The review is the heartbeat of GTD, but your app doesn't have one. So you cobble it together with spreadsheets, checklists, or just skip it — and your system slowly falls apart.",
  },
  {
    label: '"GTD-compatible" — barely.',
    body: "No Waiting For list. No Someday/Maybe. No sequential projects. The app calls itself GTD-friendly, but you're the one doing all the work — tagging, filtering, and pretending it fits.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-[hsl(222,47%,8%)] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="text-center text-sm font-medium tracking-wide uppercase text-[hsl(215,20%,50%)]"
        >
          Sound familiar?
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl leading-[1.15] text-[hsl(210,40%,96%)] sm:text-[2.5rem]"
        >
          You know the system. The app keeps getting in the way.
        </motion.h2>

        {/* Pain points */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PAIN_POINTS.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.1 }}
              className="rounded-xl border border-[hsl(217,33%,18%)] bg-[hsl(222,47%,10%)] p-5"
            >
              <AlertCircle className="mb-3 h-5 w-5 text-[hsl(0,65%,55%)]" />
              <h3 className="text-[15px] font-semibold text-[hsl(210,40%,96%)]">
                {point.label}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[hsl(215,20%,55%)]">
                {point.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pivot line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center text-[15px] font-medium text-[hsl(210,40%,96%)]"
        >
          Things Done is different. It's not GTD-compatible —{" "}
          <span className="text-primary">it's GTD.</span>
        </motion.p>
      </div>
    </section>
  );
}
