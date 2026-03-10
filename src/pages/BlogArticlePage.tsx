import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
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
        could go toward the actual work. The phenomenon is closely related to what
        psychologists call{" "}
        <Link to="/blog/the-hidden-cost-of-open-loops" className="text-primary hover:underline font-medium">
          open loops — unfinished commitments that drain your mental bandwidth
        </Link>{" "}
        even when you're not consciously thinking about them.
      </p>

      <p>
        David Allen's{" "}
        <a href="https://en.wikipedia.org/wiki/Getting_Things_Done" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
          Getting Things Done®
        </a>{" "}
        methodology addresses this head-on with a structured approach to capturing and organizing work.
      </p>

      <h2>What GTD® gets right</h2>
      <p>
        David Allen's <em>Getting Things Done®</em> methodology, often called GTD®,
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
        decided to tackle next. They don't understand that a "project" in GTD® terms
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
      <p>
        A task manager built for GTD should do more than store tasks — it should{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          guide you through each stage of the workflow
        </Link>:
      </p>
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

/* ──────────────────────────────────────────────
   Article 2: The Hidden Cost of Open Loops
   ────────────────────────────────────────────── */

function OpenLoopsArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        You're in the middle of deep work when it hits you: <em>Did I reply to
        that email?</em> The thought lasts only a second, but the damage is done.
        Your focus fractures. You check your inbox "just to be sure." Twenty
        minutes later, you're still there.
      </p>
      <p>
        This isn't a willpower problem. It's a design flaw in how most of us
        manage our commitments — and understanding it might be the most important
        productivity insight you ever learn. If you've ever wondered{" "}
        <Link to="/blog/why-your-to-do-list-doesnt-work" className="text-primary hover:underline font-medium">
          why your to-do list doesn't actually work
        </Link>, open loops are a big part of the answer.
      </p>

      <h2>What is an "open loop"?</h2>
      <p>
        In GTD terminology, an <strong>open loop</strong> is anything that has
        your attention but hasn't been captured, clarified, or acted upon. It
        could be a task, a promise you made, an idea you want to explore, or a
        vague worry about something you might have forgotten.
      </p>
      <p>
        Open loops don't sit quietly in the background. They <em>demand</em>{" "}
        attention. Your brain treats each one as an active process — a thread
        that never quite closes.
      </p>

      <h2>The Zeigarnik Effect: why your brain won't let go</h2>
      <p>
        In the 1920s, psychologist Bluma Zeigarnik noticed something curious:
        waiters could remember complex orders perfectly — until the food was
        served. Once the task was complete, the details vanished.
      </p>
      <p>
        This became known as the{" "}
        <a href="https://en.wikipedia.org/wiki/Zeigarnik_effect" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
          Zeigarnik Effect
        </a>: incomplete
        tasks occupy mental space far more than completed ones. Your brain keeps
        them "loaded" because it assumes you still need to act.
      </p>
      <p>
        Now imagine carrying not one unfinished order, but dozens. Hundreds.
        Every uncaptured commitment, every "I should really…" thought, every
        half-formed plan — they're all running in the background, consuming
        cognitive resources even when you're not consciously thinking about them.
      </p>

      <h2>The real cost: decision fatigue and anxiety</h2>
      <p>
        Open loops don't just distract you. They accumulate into what researchers
        call <strong>cognitive load</strong> — the total mental effort required
        to manage working memory.
      </p>
      <p>When cognitive load is high:</p>
      <ul>
        <li>Decision-making becomes harder and slower</li>
        <li>You're more likely to procrastinate</li>
        <li>Creative thinking suffers</li>
        <li>You feel vaguely anxious, even when nothing is "wrong"</li>
      </ul>
      <p>
        That low-grade stress you carry around? It's not just modern life. It's
        the weight of hundreds of uncommitted commitments pressing on your
        working memory.
      </p>

      <h2>The counterintuitive solution</h2>
      <p>
        Here's what's surprising: you don't have to <em>finish</em> tasks to
        close the loop. You just have to <strong>capture</strong> them.
      </p>
      <p>
        Research by Baumeister and Masicampo (2011) found that simply making a
        plan for an unfinished task — not completing it — was enough to free up
        cognitive resources. The brain stopped nagging once it trusted the task
        was recorded somewhere reliable.
      </p>
      <p>
        This is the core insight behind GTD's capture habit: the faster you get
        something out of your head and into a trusted system, the faster your
        mind can let go of it. Things Done is{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          designed around this principle
        </Link>{" "}
        — instant capture, guided clarification, and a system you can trust.
      </p>

      <h2>How to close your open loops</h2>
      <ol>
        <li>
          <strong>Do a complete brain dump.</strong> Spend 15-20 minutes writing
          down every open loop you can think of. Don't organize — just capture.
          Include work tasks, personal errands, ideas, worries, and "someday"
          dreams.
        </li>
        <li>
          <strong>Clarify each item.</strong> Is it actionable? If yes, what's
          the very next physical action? If no, is it reference material,
          something to incubate, or trash?
        </li>
        <li>
          <strong>Put it where it belongs.</strong> Next actions go to your
          action lists. Multi-step outcomes become projects. Things you're
          waiting on go to Waiting For. Someday dreams go to Someday/Maybe.
        </li>
        <li>
          <strong>Trust the system.</strong> Review it regularly so your brain
          knows nothing will fall through the cracks.
        </li>
      </ol>

      <h2>The feeling on the other side</h2>
      <p>
        People who do this for the first time often describe an almost physical
        sensation of relief. David Allen calls it "mind like water" — a state
        where your mind is calm, responsive, and ready to engage fully with
        whatever's in front of you.
      </p>
      <p>
        It's not about doing more. It's about carrying less. When every open loop
        is captured in a system you trust, your brain can finally stop
        multitasking in the background — and start being present.
      </p>

      <blockquote>
        <p>
          "Your head is for having ideas, not holding them."
          <br />
          <span className="text-sm">— David Allen</span>
        </p>
      </blockquote>

      <p>
        Ready to close your open loops?{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Try Things Done. free
        </Link>{" "}
        and experience what it feels like to think clearly again.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Article 3: From Chaos to Calm
   ────────────────────────────────────────────── */

function ChaosToCalm() {
  return (
    <div className="prose-custom">
      <p className="lead">
        A month ago, I had 47 browser tabs open. Three half-used to-do apps. A
        stack of sticky notes that had become furniture. And a persistent,
        low-level dread that I was forgetting something important.
      </p>
      <p>
        I wasn't unproductive — I was <em>busy</em>. But busy and effective are
        not the same thing. I decided to try something different: one month of
        committing fully to{" "}
        <a href="https://gettingthingsdone.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
          GTD
        </a>. Here's what happened.
      </p>

      <h2>Week 1: The brain dump that broke me</h2>
      <p>
        I sat down to capture every open loop in my life. "This will take 20
        minutes," I thought. It took two hours.
      </p>
      <p>
        I had 237 items by the time I was done. Work projects. Personal errands.
        Ideas I'd been meaning to explore. Books I wanted to read. People I'd
        promised to call back. Dreams I'd quietly abandoned.
      </p>
      <p>
        Seeing it all in one place was overwhelming — but also clarifying. No
        wonder I felt scattered. I was trying to hold all of this in my head.
      </p>

      <h2>Week 2: The clarifying phase</h2>
      <p>
        Processing 237 items took several sessions. For each one, I asked: "Is
        this actionable? What's the next step? Does this belong to a bigger
        project?"
      </p>
      <p>
        Some items I'd been carrying for years turned out to be trash. Others
        needed just one two-minute action to complete — a concept David Allen calls{" "}
        <Link to="/blog/the-two-minute-rule" className="text-primary hover:underline font-medium">
          the two-minute rule
        </Link>. A few revealed themselves
        as major projects I'd been avoiding.
      </p>
      <p>
        The most surprising part: about 40% of my "tasks" weren't actionable at
        all. They were vague worries, wishes, or ideas that needed to go to
        Someday/Maybe — not my active lists.
      </p>

      <h2>Week 3: Finding my rhythm</h2>
      <p>
        By week three, something shifted. I stopped thinking about my system and
        started using it. Capture became automatic. When something popped into my
        head, it went straight to the inbox. No more "I'll remember this later."
      </p>
      <p>
        I did my first proper Weekly Review. It took 45 minutes and felt like a
        mental reset button. I walked away with complete clarity on what mattered
        and what could wait.
      </p>
      <p>
        The browser tabs dropped to 8. The sticky notes went in the trash. I
        started sleeping better.
      </p>

      <h2>Week 4: The unexpected benefits</h2>
      <p>By the end of the month, the changes went deeper than I expected:</p>
      <ul>
        <li>
          <strong>I said "no" more easily.</strong> When you can see your real
          commitments, you stop reflexively saying yes to everything.
        </li>
        <li>
          <strong>I procrastinated less.</strong> Knowing exactly what the next
          action was removed the friction that usually led to avoidance.
        </li>
        <li>
          <strong>I was more present.</strong> Without a background hum of open
          loops, I could actually focus on conversations, meals, and downtime.
        </li>
        <li>
          <strong>I trusted myself again.</strong> For the first time in years, I
          believed that nothing was falling through the cracks.
        </li>
      </ul>

      <h2>What I wish I'd known earlier</h2>
      <p>
        GTD isn't about doing more. It's about <em>carrying less</em>. The system
        isn't meant to turn you into a productivity robot — it's meant to give
        you back the mental space that chaos steals.
      </p>
      <p>
        The hardest part isn't learning the method. It's trusting it enough to
        actually use it. Once you do, the calm is real.
      </p>

      <blockquote>
        <p>
          "You can do anything, but not everything."
          <br />
          <span className="text-sm">— David Allen</span>
        </p>
      </blockquote>

      <p>
        If you're where I was a month ago — drowning in tabs and guilt — know
        that it doesn't have to stay that way.{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Start with Things Done.
        </Link>{" "}
        Give it 30 days. See what changes. And when you're ready to commit,{" "}
        <Link to="/pricing" className="text-primary hover:underline font-medium">
          check out our simple pricing
        </Link>{" "}
        — the free plan is enough to get started.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Article 4: The Two-Minute Rule
   ────────────────────────────────────────────── */

function TwoMinuteRuleArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        Of all the tactics in David Allen's{" "}
        <a href="https://en.wikipedia.org/wiki/Getting_Things_Done" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
          Getting Things Done
        </a>, the two-minute
        rule is the simplest — and possibly the most powerful. It goes like this:
        <strong> if an action takes less than two minutes, do it now.</strong>
      </p>
      <p>
        That's it. No app. No system. Just a single decision filter that can
        transform how you process tasks.
      </p>

      <h2>Why two minutes?</h2>
      <p>
        Two minutes is roughly the time it takes to capture, organize, and track
        a task. If the action itself takes less time than managing it would,
        you're better off just doing it.
      </p>
      <p>
        Think about it: replying to a short email, filing a document, making a
        quick phone call, watering a plant, sending a thank-you text. These are
        the tasks that pile up into an overwhelming backlog — not because they're
        hard, but because we keep deferring them.
      </p>

      <h2>The psychology behind it</h2>
      <p>
        The two-minute rule works because it removes decision overhead. Instead
        of asking "should I do this now or later?", you have a clear threshold.
        Under two minutes? Do it. Over? Defer it properly.
      </p>
      <p>
        It also creates momentum. Completing a quick task gives your brain a
        small dopamine hit — a sense of progress that makes tackling the next
        thing easier. Stack a few two-minute wins together, and you've built
        genuine momentum.
      </p>

      <h2>When to apply it</h2>
      <p>
        The two-minute rule is most powerful during <strong>processing</strong>{" "}
        — when you're clarifying items in your inbox and deciding what to do with
        them. This is its native habitat in GTD.
      </p>
      <p>When you pull an item from your inbox, ask:</p>
      <ol>
        <li>Is this actionable?</li>
        <li>If yes, what's the next action?</li>
        <li>Will that action take less than two minutes?</li>
        <li>If yes — do it right now.</li>
      </ol>
      <p>
        You can also apply the rule throughout your day, but be careful: if
        you're in the middle of deep work, don't let two-minute tasks pull you
        out of flow. Batch them for your next processing session.
      </p>

      <h2>Common mistakes</h2>
      <ul>
        <li>
          <strong>Overestimating the time.</strong> That email you've been
          avoiding? Time yourself. It's probably under two minutes.
        </li>
        <li>
          <strong>Using it as an excuse to stay busy.</strong> The rule is for
          processing, not for avoiding important work. Don't spend an hour on
          two-minute tasks when you have a critical project waiting.
        </li>
        <li>
          <strong>Forgetting to apply it.</strong> Like any habit, it takes
          practice. Build a trigger: "Every time I open my inbox, I'll apply the
          two-minute rule."
        </li>
      </ul>

      <h2>The compound effect</h2>
      <p>
        Imagine clearing 10 two-minute tasks per day. That's nearly 20 minutes of
        real work — but more importantly, it's 10 fewer items cluttering your
        lists, your mind, and your sense of control.
      </p>
      <p>
        Over a week, that's 70 small wins. Over a month, 300. The backlog that
        used to feel insurmountable starts to shrink — not through heroic effort,
        but through consistent, frictionless action. The two-minute rule pairs
        perfectly with the mindset shift described in{" "}
        <Link to="/blog/from-chaos-to-calm" className="text-primary hover:underline font-medium">
          From Chaos to Calm
        </Link>{" "}
        — small, consistent habits that compound over time.
      </p>

      <h2>Try it today</h2>
      <p>Pick one inbox — email, physical mail, your task manager's inbox.</p>
      <ol>
        <li>Open the first item.</li>
        <li>Decide: under two minutes?</li>
        <li>If yes, do it now. If no, move on.</li>
        <li>Repeat until the inbox is clear.</li>
      </ol>
      <p>
        That's the two-minute rule in action. Simple, powerful, and free.
      </p>

      <blockquote>
        <p>
          "If the next action can be done in two minutes or less, do it when you
          first pick the item up."
          <br />
          <span className="text-sm">— David Allen, Getting Things Done</span>
        </p>
      </blockquote>

      <p>
        Want a system that makes the two-minute rule effortless?{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Try Things Done.
        </Link>{" "}
        — built for the way GTD actually works. Explore all the{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          features designed to support your workflow
        </Link>.
      </p>
    </div>
  );
}

/* ──────── Article page shell ──────── */

const ARTICLE_CONTENT: Record<string, React.FC> = {
  "why-your-to-do-list-doesnt-work": WhyYourToDoListArticle,
  "the-hidden-cost-of-open-loops": OpenLoopsArticle,
  "from-chaos-to-calm": ChaosToCalm,
  "the-two-minute-rule": TwoMinuteRuleArticle,
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
    url: `${SITE_URL}/blog/${article.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <>
      <SEOHead
        title={`${article.title} — Things Done.`}
        description={article.description}
        canonical={`${SITE_URL}/blog/${article.slug}`}
        jsonLd={[articleJsonLd, breadcrumbJsonLd]}
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

        {/* Hero image */}
        {article.heroImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-10 -mx-6 md:mx-0 md:rounded-xl overflow-hidden"
          >
            <img
              src={article.heroImage}
              alt={article.title}
              className="w-full aspect-[16/9] object-cover"
            />
          </motion.div>
        )}

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
