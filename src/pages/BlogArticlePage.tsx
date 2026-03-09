import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEOHead } from "@/components/SEOHead";
import { getArticleBySlug } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";

/* ────────────────────────────────────────────
   Article content — rendered as JSX for rich
   formatting, internal links, and SEO.
   ──────────────────────────────────────────── */

function WhyYourToDoListArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        You've tried apps. You've tried notebooks. You've tried color-coded sticky
        notes on your monitor. And yet, every Monday morning feels the same: a vague
        cloud of things you <em>should</em> be doing, with no clear sense of what to
        do <em>first</em>.
      </p>
      <p>You're not lazy. Your system is broken.</p>

      <h2>The problem with simple to-do lists</h2>
      <p>
        A flat list of tasks treats "Buy milk" and "Restructure the Q2 roadmap" as
        the same kind of work. They're not. One takes two minutes at the store; the
        other requires deep focus, collaboration, and multiple steps over weeks.
      </p>
      <p>
        When everything lives in one undifferentiated list, your brain does what
        brains do best: it panics. You scan the list, feel overwhelmed, and either
        cherry-pick the easy wins (hello, inbox zero for the third time today) or
        shut down entirely.
      </p>
      <p>
        This is called <strong>decision fatigue</strong>. Every time you look at your
        list and ask "what should I do next?", you're spending cognitive energy that
        could go toward the actual work.
      </p>

      <h2>What GTD gets right</h2>
      <p>
        David Allen's <em>Getting Things Done</em> methodology, often called GTD,
        solves this with one elegant insight:{" "}
        <strong>
          your brain is for having ideas, not for holding them.
        </strong>
      </p>
      <p>The system works in five stages:</p>
      <ol>
        <li>
          <strong>Capture</strong> — Get everything out of your head into a trusted
          inbox. Every idea, task, reminder, or "I should really…" thought.
        </li>
        <li>
          <strong>Clarify</strong> — Process each item. Is it actionable? What's the
          very next physical action? Does it belong to a larger project?
        </li>
        <li>
          <strong>Organize</strong> — Put actions where they belong: Next Actions,
          Waiting For, Scheduled, Someday/Maybe, or a specific project.
        </li>
        <li>
          <strong>Reflect</strong> — Review your system regularly (the famous Weekly
          Review) so you trust it completely.
        </li>
        <li>
          <strong>Engage</strong> — Do the work with confidence, knowing you're
          working on the right thing.
        </li>
      </ol>
      <p>
        The magic isn't in any single step — it's in the <em>trust</em> the whole
        system creates. When you trust that nothing is falling through the cracks,
        your mind stops racing and starts focusing.
      </p>

      <h2>Why most apps still fail you</h2>
      <p>
        Most task managers give you a list and call it a day. They don't distinguish
        between something you're waiting on from a colleague and something you've
        decided to tackle next. They don't understand that a "project" in GTD terms
        is any outcome requiring more than one action step.
      </p>
      <p>
        They certainly don't help you do a Weekly Review — the single most important
        habit for keeping your system alive.
      </p>
      <p>
        The result? You end up managing the tool instead of the tool managing your
        work. After a few weeks of that overhead, you abandon it and go back to
        mental lists and anxiety.
      </p>

      <h2>What a better system looks like</h2>
      <p>A task manager built for GTD should:</p>
      <ul>
        <li>
          <strong>Make capture instant.</strong> If adding a task takes more than a
          second, you won't do it when it matters.
        </li>
        <li>
          <strong>Guide clarification.</strong> When you process your inbox, the
          system should ask the right questions: Is this actionable? What's the next
          step? Does it belong to a project?
        </li>
        <li>
          <strong>Separate states, not just lists.</strong> Next Actions, Waiting
          For, Scheduled, and Someday/Maybe aren't just labels — they represent
          fundamentally different commitments.
        </li>
        <li>
          <strong>Surface the right thing.</strong> When you have 15 minutes of low
          energy between meetings, you should see only what fits that context — not
          your entire backlog.
        </li>
        <li>
          <strong>Make reviews effortless.</strong> A guided Weekly Review that walks
          you through each project, flags stale items, and helps you recalibrate.
        </li>
      </ul>

      <h2>The Weekly Review: your secret weapon</h2>
      <p>
        If you take one thing from this article, let it be this:{" "}
        <strong>do a Weekly Review</strong>. It takes 30 minutes and returns hours of
        clarity.
      </p>
      <p>Here's the basic flow:</p>
      <ol>
        <li>Clear your inboxes (email, physical, digital).</li>
        <li>Review every active project — is there a clear next action?</li>
        <li>Check your Waiting For list — do you need to follow up?</li>
        <li>Look at your calendar for the coming week.</li>
        <li>Review Someday/Maybe — does anything spark energy now?</li>
      </ol>
      <p>
        That's it. When you walk away from a Weekly Review, you have complete
        confidence that your system reflects reality. That feeling is worth more than
        any productivity hack on the internet.
      </p>

      <h2>Getting started today</h2>
      <p>
        You don't need to overhaul your life in one afternoon. Start with one habit:
      </p>
      <ol>
        <li>
          <strong>Brain dump.</strong> Set a timer for 10 minutes. Write down every
          open loop in your head — every task, worry, idea, or commitment. Don't
          organize. Just capture.
        </li>
        <li>
          <strong>Clarify each item.</strong> For each one, ask: "What's the next
          physical action?" If it takes under two minutes, do it now. Otherwise, put
          it in the right place.
        </li>
        <li>
          <strong>Pick one "Next Action" and do it.</strong> That momentum is how
          systems take root.
        </li>
      </ol>
      <p>
        The beauty of GTD is that it scales. It works whether you have 5 tasks or
        500. The system doesn't get overwhelmed — even when you do.
      </p>

      <blockquote>
        <p>
          "Your mind is for having ideas, not holding them."
          <br />
          <span className="text-sm">— David Allen</span>
        </p>
      </blockquote>

      <p>
        If you're ready to build a system you actually trust,{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          try Things Done. for free
        </Link>
        . It's built from the ground up for the way GTD actually works — not just
        another list with a checkbox.
      </p>
    </div>
  );
}

/* ──────── Article page shell ──────── */

const ARTICLE_CONTENT: Record<string, React.FC> = {
  "why-your-to-do-list-doesnt-work": WhyYourToDoListArticle,
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const Content = slug ? ARTICLE_CONTENT[slug] : undefined;

  if (!article || !Content) return <NotFound />;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "Things Done." },
    url: `https://thingsdone.lovable.app/blog/${article.slug}`,
  };

  return (
    <>
      <SEOHead
        title={`${article.title} — Things Done.`}
        description={article.description}
        canonical={`https://thingsdone.lovable.app/blog/${article.slug}`}
        jsonLd={articleJsonLd}
      />

      <article className="mx-auto max-w-2xl px-6 py-16 md:py-24">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All articles
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {new Date(article.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            · {article.readingTime} · by {article.author}
          </p>
        </motion.header>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Content />
        </motion.div>
      </article>
    </>
  );
}
