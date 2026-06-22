import { motion } from "framer-motion";
import { SectionShell } from "./SectionShell";
import mondaySundayImage from "@/assets/monday-sunday.png.asset.json";

export function EditorialVignetteSection() {
  return (
    <SectionShell tone="paper" eyebrow="What changes in a week">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <figure className="rounded-2xl border border-hairline bg-paper shadow-tactile overflow-hidden">
            <img
              src={mondaySundayImage.url}
              alt="A week on the wall: Monday's scattered torn paper notes flow through Captured and Clarified into Next, Waiting, Scheduled, Reviewed, and Current cards by Sunday"
              className="w-full h-auto select-none"
              loading="lazy"
              draggable={false}
            />
          </figure>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] tracking-tight text-ink">
            Monday: scattered.
            <br />
            <span className="italic text-moss-deep">Sunday: clear.</span>
          </h2>

          <div className="mt-8 space-y-5 text-lg text-ink-soft leading-relaxed max-w-lg">
            <p>
              You start the week with seventy-three open loops scattered
              across email, slack, voicemails, and the back of your mind.
            </p>
            <p>
              You end it with three things on today, the rest in their
              proper place, and the quiet certainty that nothing important
              is hiding from you.
            </p>
            <p className="text-ink">
              That's not a productivity gain. That's a different relationship
              with your own attention.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionShell>
  );
}
