import { SEOHead, SITE_URL } from "@/components/SEOHead";
import { breadcrumbJsonLd, ORG_JSONLD } from "@/lib/jsonLd";

const ABOUT_JSONLD = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Things Done.",
    url: `${SITE_URL}/about`,
    description:
      "Things Done is an independent GTD® task manager built to reduce cognitive load. Learn why it exists and what we believe.",
  },
  ORG_JSONLD,
  breadcrumbJsonLd([
    { name: "Home", url: `${SITE_URL}/` },
    { name: "About", url: `${SITE_URL}/about` },
  ]),
];

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About — Things Done. | Why We Built a GTD® Task Manager"
        description="Things Done is an independent GTD® task manager built to reduce cognitive load, not increase it. Learn why it exists and what we believe."
        canonical={`${SITE_URL}/about`}
        jsonLd={ABOUT_JSONLD}
      />

      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
          About Things Done.
        </h1>

        <div className="prose-custom mt-10 space-y-10 text-[15px] leading-relaxed text-foreground/90">
          {/* Why */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Why Things Done exists</h2>
            <p>
              Most task managers are really just lists. You type things in, they sit there, and eventually the app becomes another source of guilt instead of clarity.
            </p>
            <p>
              Things Done is different because it's built on a real system — Getting Things Done® (GTD®), the productivity methodology created by David Allen. GTD® isn't about doing more. It's about capturing everything that has your attention, deciding what each thing means, and organizing it so you always know what to do next.
            </p>
            <p>
              The problem is that most apps either ignore GTD® entirely or make it so complicated that you spend more time managing the system than doing the work. Things Done was built to close that gap — a calm, focused app where the system works quietly in the background so you can focus on what matters.
            </p>
          </section>

          {/* How */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">How it works</h2>
            <p>
              The GTD® workflow has five steps: capture, clarify, organize, reflect, and engage. Things Done is designed around all five — not just the first two.
            </p>
            <p>
              Everything starts in your Inbox — a single place to dump tasks, ideas, and reminders before they disappear. From there, you clarify each item (What's the next action? Does it belong to a project? When should I do it?), organize by context, and review regularly so nothing slips through the cracks.
            </p>
            <p>
              The Weekly Review is where most productivity systems fall apart — people just don't do it. Things Done makes it a guided, step-by-step process (with optional AI assistance) so you actually stay on top of your system instead of abandoning it after two weeks.
            </p>
          </section>

          {/* Beliefs */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">What we believe</h2>
            <p>
              <strong>Your task manager should feel lighter, not heavier.</strong> If your productivity tool is adding stress, something is wrong. Things Done is designed to reduce cognitive load, not increase it.
            </p>
            <p>
              <strong>A system only works if you trust it.</strong> That means everything gets captured, nothing gets lost, and you review it regularly. Things Done is built to earn that trust.
            </p>
            <p>
              <strong>Simple is better than clever.</strong> We don't chase feature bloat. Every feature in Things Done exists because it directly supports the GTD® workflow — capture, clarify, organize, review, and do.
            </p>
          </section>

          {/* Independent */}
          <section>
            <h2 className="text-xl font-semibold text-foreground">Built independently</h2>
            <p>
              Things Done is an independent product built with care. It's not backed by venture capital, it doesn't have a growth team optimizing for engagement metrics, and it will never sell your data. The business model is simple: a generous free plan and a $4/month Pro tier for people who want unlimited everything.
            </p>
            <p>
              If you have questions, feedback, or just want to say hi, reach out at{" "}
              <a href="mailto:levijohnson@gmail.com" className="text-primary hover:underline">levijohnson@gmail.com</a>.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
