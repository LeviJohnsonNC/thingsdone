import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
import { getArticleBySlug } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonLd";

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
        A task manager built for GTD® should do more than store tasks — it should{" "}
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
        The beauty of GTD® is that it scales. It works whether you have 5 tasks or
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
        . It's built from the ground up for the way GTD® actually works — not just
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
        In GTD® terminology, an <strong>open loop</strong> is anything that has
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
        This is the core insight behind GTD®'s capture habit: the faster you get
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
          GTD®
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
        GTD® isn't about doing more. It's about <em>carrying less</em>. The system
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
          Getting Things Done®
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
        them. This is its native habitat in GTD®.
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
          <span className="text-sm">— David Allen, Getting Things Done®</span>
        </p>
      </blockquote>

      <p>
        Want a system that makes the two-minute rule effortless?{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Try Things Done.
        </Link>{" "}
        — built for the way GTD® actually works. Explore all the{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          features designed to support your workflow
        </Link>.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Article 5: GTD Method Beginner's Guide
   ────────────────────────────────────────────── */

function GtdBeginnersGuideArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        You've got 47 tabs open, a sticky note graveyard on your desk, and a nagging
        feeling you're forgetting something important. Sound familiar?
      </p>
      <p>
        The Getting Things Done method — GTD for short — was designed for exactly this
        kind of overwhelm. Created by productivity consultant David Allen, GTD is a
        five-step system for capturing everything on your mind, organizing it, and
        deciding what to do next. It's been around for over two decades, and it endures
        because it works. Not because it's complicated, but because it's surprisingly
        simple once you understand the core idea:{" "}
        <strong>your brain is for having ideas, not holding them.</strong>
      </p>
      <p>
        Here's how to get started with GTD, step by step — no prior productivity system
        required.
      </p>

      <h2>Step 1: Capture Everything</h2>
      <p>
        The first rule of GTD is deceptively straightforward: get it out of your head.
        Every task, idea, errand, reminder, half-formed thought — all of it goes into a
        single trusted place. David Allen calls this your "inbox."
      </p>
      <p>
        Your inbox can be a notebook, a notes app, or a dedicated task manager. The
        format matters less than the habit. The goal is to build the reflex of capturing
        instead of remembering. When your brain trusts that nothing will slip through
        the cracks, it stops running background anxiety loops — and that frees up mental
        energy for actual work. This is closely related to the psychology behind{" "}
        <Link to="/blog/the-hidden-cost-of-open-loops" className="text-primary hover:underline font-medium">
          open loops and why unfinished tasks drain you
        </Link>.
      </p>
      <p>
        <strong>Practical tip:</strong> Start with a single capture tool. Don't split
        your inbox across five apps. One place, always accessible, always used.
      </p>

      <h2>Step 2: Clarify What Each Item Means</h2>
      <p>
        Once you've captured a batch of items, the next step is to process them one by
        one. For each item, ask yourself: <em>What is this? Is it actionable?</em>
      </p>
      <p>
        If it's not actionable, you have three choices: trash it, file it as reference
        material, or add it to a "someday/maybe" list for things you might want to
        revisit later.
      </p>
      <p>
        If it is actionable, identify the very next physical action. Not "plan the
        project" — that's vague. More like "draft the project brief in Google Docs" or
        "email Sarah to confirm the timeline." GTD works because it forces you to think
        in concrete next steps instead of fuzzy intentions.
      </p>
      <p>
        <strong>Practical tip:</strong> If a task takes less than two minutes, do it
        immediately. This is Allen's famous{" "}
        <Link to="/blog/the-two-minute-rule" className="text-primary hover:underline font-medium">
          two-minute rule
        </Link>, and it's one of the most effective habits you can build.
      </p>

      <h2>Step 3: Organize by Context</h2>
      <p>
        Now that you've clarified your tasks, organize them so you can find the right
        thing to do at the right time. GTD uses a few key lists:
      </p>
      <ul>
        <li>
          <strong>Next Actions</strong> — the single next step for every active project
          or commitment. This is your go-to list when you're ready to work.
        </li>
        <li>
          <strong>Projects</strong> — anything that requires more than one action step
          to complete. "Launch the newsletter" is a project. "Write the first draft" is
          a next action within that project.
        </li>
        <li>
          <strong>Waiting For</strong> — tasks you've delegated or are blocked on.
          Tracking these prevents things from falling through the cracks.
        </li>
        <li>
          <strong>Someday/Maybe</strong> — ideas and aspirations that aren't active
          commitments yet. Reviewing this list regularly keeps good ideas alive without
          cluttering your day-to-day.
        </li>
      </ul>
      <p>
        <strong>Practical tip:</strong> Don't over-engineer your lists on day one.
        Start with Next Actions and Projects. Add the others as you get comfortable.
      </p>

      <h2>Step 4: Review Regularly</h2>
      <p>
        A system is only as good as your trust in it, and trust comes from regular
        review. GTD's "Weekly Review" is the keystone habit of the entire method. Once a
        week, sit down and go through your lists. Update what's changed. Clear out
        what's done. Identify what's stalled.
      </p>
      <p>
        The weekly review is where most people either fall in love with GTD or fall off
        the wagon. It takes 30 to 60 minutes, and it pays for itself many times over in
        reduced stress and clearer priorities for the week ahead.
      </p>
      <p>
        <strong>Practical tip:</strong> Put your weekly review on the calendar as a
        recurring event. Friday afternoon or Sunday evening both work well — pick the
        time that fits your rhythm.
      </p>

      <h2>Step 5: Engage With Confidence</h2>
      <p>
        With everything captured, clarified, organized, and reviewed, the final step is
        simply to do the work. The beauty of a well-maintained GTD system is that when
        you sit down to work, you're not wondering what you should be doing — you
        already know. You pick a task from your Next Actions list based on your current
        context, energy level, and available time, and you get to work.
      </p>
      <p>
        This is the payoff. GTD isn't about doing more. It's about doing the right
        things with a clear mind.
      </p>

      <h2>Getting Started Today</h2>
      <p>
        You don't need to overhaul your entire life to try GTD. Start small:
      </p>
      <ol>
        <li>Pick one capture tool.</li>
        <li>Spend 15 minutes doing a brain dump of everything on your mind.</li>
        <li>Process that list using the clarify step.</li>
        <li>Organize what's left into Next Actions and Projects.</li>
        <li>Do your first weekly review at the end of the week.</li>
      </ol>
      <p>That's it. Five steps. One week. You'll feel the difference.</p>

      <blockquote>
        <p>
          "Your mind is for having ideas, not holding them."
          <br />
          <span className="text-sm">— David Allen</span>
        </p>
      </blockquote>

      <p>
        If you're looking for a task manager built around GTD principles — one that
        makes capturing fast and always shows you what to do next —{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Things Done was designed for exactly this workflow
        </Link>. It's free to start, and it's calm by design. Learn more about{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          how it works
        </Link>.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Article 6: How to Build a Productivity System
   ────────────────────────────────────────────── */

function ProductivitySystemArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        Most productivity systems fail for the same reason most diets fail: they ask
        too much, too fast, with too little payoff in the early days. You read about a
        method, download an app, spend an evening setting things up, feel great for
        about 72 hours — and then quietly abandon the whole thing when real life gets
        in the way.
      </p>
      <p>
        The problem usually isn't motivation. It's architecture. A good productivity
        system should be so easy to use that you default to it even on your worst days.
        Here's how to build one that lasts.
      </p>

      <h2>Start With the Problem, Not the Tool</h2>
      <p>
        Before you download anything, ask yourself what's actually going wrong. Where
        does work slip through the cracks? When do you feel most overwhelmed?
      </p>
      <p>For most people, the answer falls into one of three categories:</p>
      <ul>
        <li>
          <strong>Capture failure</strong> — tasks and ideas live in your head, in
          scattered notes, in email threads, on sticky notes, and you forget things
          regularly.
        </li>
        <li>
          <strong>Prioritization confusion</strong> — you have a long list but no clear
          sense of what matters most right now.
        </li>
        <li>
          <strong>Follow-through breakdown</strong> — you know what to do but can't
          seem to make consistent progress on it.
        </li>
      </ul>
      <p>
        Your system needs to solve your specific problem. If you're great at capturing
        but terrible at prioritizing, a new notes app won't help. If you never forget
        tasks but struggle to make progress, you might need better project structure or
        time-blocking, not a better to-do list.
      </p>
      <p>Name the bottleneck first. Then design around it.</p>

      <h2>The Three Things Every System Needs</h2>
      <p>
        Regardless of the specific method you choose —{" "}
        <Link to="/blog/getting-things-done-method-beginners-guide" className="text-primary hover:underline font-medium">
          GTD
        </Link>, time-blocking, Eisenhower matrix, or something you invented yourself —
        every reliable productivity system needs three components.
      </p>
      <p>
        <strong>A single capture point.</strong> Everything you need to remember goes
        into one trusted place. Not two apps and a notebook. One place. The simpler and
        faster this is, the more likely you are to use it consistently. Your capture
        tool should be accessible from wherever you are — your phone, your computer,
        your desk — in under five seconds.
      </p>
      <p>
        <strong>A regular processing habit.</strong> Capturing is worthless if you never
        look at what you've captured. Build a daily or weekly habit of reviewing your
        inbox and deciding what each item means: Is it a task? A project? Something to
        delegate? Something to delete? This processing step is where raw input becomes
        organized action, and it's the habit most people skip. Understanding{" "}
        <Link to="/blog/the-hidden-cost-of-open-loops" className="text-primary hover:underline font-medium">
          why open loops drain you
        </Link>{" "}
        makes it easier to commit to this habit.
      </p>
      <p>
        <strong>A clear "what's next" view.</strong> When you sit down to work, your
        system should answer one question immediately: what should I do right now? If
        you have to scan a 200-item list and make a decision every time, you'll burn
        through willpower before you start actual work. The best systems surface a
        short, context-appropriate list of next actions so you can just pick and go.
      </p>
      <p>That's it. Capture, process, execute. Everything else is optional.</p>

      <h2>Keep It Embarrassingly Simple</h2>
      <p>
        The biggest threat to any productivity system is complexity. The temptation is
        to add features: color-coded priorities, nested sub-projects, automated
        workflows, integrations with six other tools. Every addition feels productive
        in the moment. But each one adds friction, and friction is the enemy of
        consistency.
      </p>
      <p>
        Here's a good test: could you explain your system to a friend in under two
        minutes? If not, simplify. The people who maintain their systems for years —
        not weeks — tend to use the simplest version that works.
      </p>
      <p>
        Start with the minimum viable system. Use it for two weeks. Only add complexity
        when you hit a specific, named problem that the current system can't handle.
        This approach sounds slow, but it's actually faster because you don't waste
        time rebuilding a system that collapsed under its own weight.
      </p>

      <h2>Choose Your Rhythm</h2>
      <p>
        Every system needs a rhythm — a recurring pattern of review and planning that
        keeps it alive. Without rhythm, even a great system becomes a graveyard of
        outdated tasks.
      </p>
      <p>Two rhythms matter most:</p>
      <ul>
        <li>
          <strong>A daily check-in</strong> where you spend two to five minutes at the
          start of your day reviewing your task list and choosing your priorities. This
          doesn't need to be elaborate. Just look at your list, pick the most important
          things, and start.
        </li>
        <li>
          <strong>A weekly review</strong> where you spend 20 to 45 minutes going
          through everything: clearing your inbox, updating your projects, checking on
          things you're waiting for, and asking yourself what needs attention next week.
          This is the habit that separates people who stick with a system from people
          who abandon one every quarter.
        </li>
      </ul>
      <p>
        Put both on your calendar. Treat them like meetings with yourself that you
        don't cancel.
      </p>

      <h2>Pick a Tool That Matches Your Style</h2>
      <p>
        Your tool should serve your system, not the other way around. If you've
        identified that your main problem is capture speed and clear next actions,
        choose a tool that's fast to open and shows you what to do next without
        clicking through five screens.
      </p>
      <p>A few principles for choosing well:</p>
      <ul>
        <li>
          Favor tools that start simple and let you add complexity later, over tools
          that front-load configuration.
        </li>
        <li>Avoid tools that require more than one session to set up.</li>
        <li>
          Pick something that works on the devices you actually use — if you're never
          at a desktop, a desktop-only app is the wrong choice.
        </li>
      </ul>
      <p>
        And give your tool a real chance. Use it for at least three weeks before
        evaluating. The first few days are always awkward, no matter how good the app
        is.
      </p>

      <h2>Start Today, Not Monday</h2>
      <p>
        The single best thing you can do right now is spend 10 minutes on a brain dump.
        Open a blank document or a fresh task manager, and write down everything that's
        on your mind: tasks, projects, errands, ideas, worries, commitments. Don't
        organize yet. Just get it all out.
      </p>
      <p>
        That list is your starting point. Tomorrow, process it. By the end of the week,
        you'll have the foundation of a system that actually works — not because it's
        perfect, but because it's yours and it's simple enough to keep using.
      </p>

      <blockquote>
        <p>
          Building a productivity system that works for you is a process, not an event.
          Start simple, review often, and adjust as you go.
        </p>
      </blockquote>

      <p>
        If you want a tool that was designed for exactly this kind of workflow — fast
        capture, clear next actions, and a built-in weekly review —{" "}
        <Link to="/auth" className="text-primary hover:underline font-medium">
          Things Done is worth a look
        </Link>. It's free to start, and it's built to stay out of your way. See all
        the{" "}
        <Link to="/features" className="text-primary hover:underline font-medium">
          features
        </Link>{" "}
        designed to support your workflow.
      </p>
    </div>
  );
}

/* Article 7: Best GTD Apps in 2026 */

function BestGtdAppsArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        Search "best GTD app" and you'll get a hundred listicles that recommend the same five apps and never explain <em>why</em>. Most of them aren't built for Getting Things Done at all — they're general task managers with a tag system, and they expect you to do the GTD plumbing yourself.
      </p>
      <p>
        This is a more honest take. We'll cover what GTD actually requires of an app, the apps people most often consider, and how to pick one that fits the method instead of fighting it. (Full disclosure: we make one of the apps in this list. We're going to try to be useful anyway.)
      </p>

      <h2>What "GTD-native" actually means</h2>
      <p>
        Before comparing apps, it helps to be specific about what GTD asks of a tool. David Allen's <a href="https://gettingthingsdone.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Getting Things Done</a> methodology has five steps — capture, clarify, organize, reflect, engage — and a small set of canonical lists that fall out of those steps:
      </p>
      <ul>
        <li><strong>Inbox</strong> — a single place to capture anything, processed later.</li>
        <li><strong>Next Actions</strong> — concrete, single-step actions you can do now.</li>
        <li><strong>Waiting For</strong> — things you've delegated or are blocked on.</li>
        <li><strong>Scheduled</strong> — actions tied to a specific date or time.</li>
        <li><strong>Someday/Maybe</strong> — ideas you might pursue, but aren't committed to yet.</li>
        <li><strong>Projects</strong> — outcomes that take more than one action.</li>
        <li><strong>Reference</strong> — non-actionable material you might need later.</li>
      </ul>
      <p>
        A GTD-native app treats these as first-class concepts — not labels you apply manually. It also makes the <Link to="/blog/how-to-do-a-weekly-review" className="text-primary hover:underline font-medium">weekly review</Link> a real workflow, not something you cobble together in a separate document. And it distinguishes between sequential and parallel projects, because in GTD a sequential project should only surface its very next step in your Next Actions list.
      </p>
      <p>With that yardstick in hand, the apps:</p>

      <h2>Things 3 — beautiful, but not actually GTD</h2>
      <p>
        Cultured Code's Things 3 is the prettiest task manager on the App Store and it deserves the praise it gets for design. It has Today, Upcoming, Anytime, and Someday — superficially GTD-shaped, but missing critical pieces. There's no native Waiting For list, no notion of sequential projects, and no built-in weekly review. You can fake all of that with tags and rituals, but you're doing the work the app should do for you.
      </p>
      <p>Best for: people who want a beautiful general task app and are willing to bend GTD to fit it.</p>

      <h2>Todoist — flexible enough to do anything, opinionated about nothing</h2>
      <p>
        Todoist is the Swiss Army knife of task managers. Labels, filters, projects, priorities — you can construct a GTD system inside it, and many people have. The trade-off is that <em>you</em> have to design the system, configure the filters, and remember the conventions. Six months in, you're maintaining your Todoist setup as much as you're using it.
      </p>
      <p>Best for: power users who like configuring tools and don't mind being the architect of their own workflow.</p>

      <h2>OmniFocus — built for GTD, but heavy</h2>
      <p>
        OmniFocus is the closest classical match to GTD. It has explicit Inbox, Projects, Contexts (now called Tags), and a Forecast view. It's also Apple-only, expensive, and has a learning curve steep enough that many people abandon it before they get over it. If you've already done GTD on paper for years and you want a desktop power-tool, OmniFocus is the right shape. If you're starting out, it's a lot of app.
      </p>
      <p>Best for: long-time GTD practitioners on Apple devices who want maximum control.</p>

      <h2>Notion / Obsidian — endlessly configurable, endlessly distracting</h2>
      <p>
        Both can host a GTD system. Both let you build databases and link notes. But neither is a task manager — they're document tools you turn into one. The risk is the same as with Todoist, amplified: you spend more time tweaking your template than capturing tasks. If you love the building, great. If you want to actually <em>do</em> GTD, you'll probably bounce off.
      </p>

      <h2>TickTick, Microsoft To Do, Apple Reminders</h2>
      <p>
        Each of these is a fine simple list manager. None of them is GTD-aware. You can use them, but the gap between what they offer and what GTD asks of a tool is wide enough that you'll be doing the methodology entirely in your head.
      </p>

      <h2>Things Done. — built around the method, not retrofitted to it</h2>
      <p>
        We built <Link to="/" className="text-primary hover:underline font-medium">Things Done.</Link> because we wanted a calm app where the GTD lists already exist as views, sequential projects work the way David Allen describes them (only the first incomplete step appears in Next Actions), and the weekly review is a guided wizard you actually finish. There's a free plan that's generous enough for most personal use, and a $4/month Pro tier that adds AI assistance and removes limits.
      </p>
      <p>
        We're biased, obviously. The honest pitch: if you've tried Things 3, Todoist, or OmniFocus and felt like the tool wasn't speaking GTD back to you, we're worth a look. If you're happy with your current setup, stay there.
      </p>

      <h2>How to actually choose</h2>
      <p>Before downloading anything, answer three questions:</p>
      <ol>
        <li><strong>How quickly can I capture?</strong> If adding a task takes more than two seconds, you won't do it when it counts. Open each app and time yourself adding ten tasks in a row. The fastest one wins a lot of points.</li>
        <li><strong>Does the app know what GTD is?</strong> Look for native Waiting For, sequential projects, and a real weekly review. If you have to invent these with tags and saved searches, the app is fighting you.</li>
        <li><strong>Is the app calm?</strong> GTD's whole point is reducing background noise. An app that nags you with notifications, gamification, or "engagement" features works against the methodology.</li>
      </ol>
      <p>
        Once you've picked, commit to it for at least three weeks. Most people quit a productivity tool in week one because their old habits are stronger than the new system. That's not the app's fault — it's the universal cost of changing a workflow.
      </p>

      <h2>The harder truth</h2>
      <p>
        No app makes you a good GTD practitioner. The methodology is a set of habits — capture, clarify, review — and the app is just a place to keep the lists. The best GTD app is the one you'll <em>actually open</em> every day, do a weekly review in every Sunday, and trust completely.
      </p>
      <p>
        If you're new to GTD, start with our <Link to="/blog/getting-things-done-method-beginners-guide" className="text-primary hover:underline font-medium">beginner's guide</Link> before you spend an hour comparing apps. The method matters more than the tool. Then, when you're ready, try one app for three weeks before reconsidering.
      </p>

      <blockquote>
        <p>Pick the app you'll still open in week three. That's the only review that matters.</p>
      </blockquote>

      <p>
        If you'd like to give Things Done a try, it's <Link to="/auth" className="text-primary hover:underline font-medium">free to start</Link> and built around the GTD lists from day one. See what it covers on the <Link to="/features" className="text-primary hover:underline font-medium">features page</Link>.
      </p>
    </div>
  );
}

/* Article 8: How to Do a Weekly Review */

function WeeklyReviewArticle() {
  return (
    <div className="prose-custom">
      <p className="lead">
        The weekly review is the keystone habit of Getting Things Done. Skip it and your system slowly stops being trustworthy — items go stale, projects drift, and the quiet anxiety of <Link to="/blog/the-hidden-cost-of-open-loops" className="text-primary hover:underline font-medium">open loops</Link> creeps back in. Do it consistently and your whole week feels lighter.
      </p>
      <p>
        Most people don't skip the weekly review because it's hard. They skip it because they don't have a clear, repeatable process. Here's the one we use — adapted from David Allen's classic version, modernized slightly for digital tools, and timeboxed to 30 minutes.
      </p>

      <h2>Why the weekly review is non-negotiable</h2>
      <p>
        GTD works because you trust your system. You can only trust your system if you reset it regularly. The weekly review is that reset. It's where you:
      </p>
      <ul>
        <li>Empty every inbox you have, not just the one in your task app.</li>
        <li>Re-confirm a clear next action exists for every active project.</li>
        <li>Catch waiting-for items that need a follow-up.</li>
        <li>Look forward at your calendar so the coming week doesn't surprise you.</li>
        <li>Reconnect with your someday/maybe list, which often holds the most important things.</li>
      </ul>
      <p>Thirty minutes a week is the price of mind-like-water. It's a bargain.</p>

      <h2>Before you start: set the conditions</h2>
      <p>
        A successful weekly review depends on doing it the same time, same place, every week. Pick a slot — Sunday evening, Friday afternoon, Monday morning — and put it on your calendar as a recurring event. Treat it as inviolable as a meeting with your CEO.
      </p>
      <p>
        Close email. Put your phone face down. Have your task app open and a notepad nearby. Brew something warm. The ritual matters more than you think — the more sacred it feels, the more likely you'll keep doing it.
      </p>

      <h2>Step 1 — Get clear (10 minutes)</h2>
      <p>
        Empty everything that's still floating. Process all the inputs that have been sitting unprocessed: email inbox, browser tabs, sticky notes, voice memos, things on the corner of your desk, the random Notion page you've been adding stray thoughts to.
      </p>
      <p>
        For each item, apply the GTD clarify question: <em>Is this actionable?</em> If yes, identify the next physical action and put it in the right list. If no, it's reference, someday, or trash. If it'll take less than two minutes, just do it now — that's <Link to="/blog/the-two-minute-rule" className="text-primary hover:underline font-medium">the two-minute rule</Link> in action.
      </p>
      <p>
        By the end of step 1, every external inbox should be at zero — including your task app's inbox. This is the part that feels the hardest the first few times. It gets faster.
      </p>

      <h2>Step 2 — Get current (15 minutes)</h2>
      <p>Now walk through your active lists in the right order:</p>
      <ol>
        <li><strong>Review your calendar — last week.</strong> Anything trigger a follow-up, a thank-you, or a new task? Capture it.</li>
        <li><strong>Review your calendar — next two weeks.</strong> What's coming up? Do you need to prepare anything? Capture those actions now while you're thinking about it.</li>
        <li><strong>Review your Next Actions list.</strong> Are these still the right next steps? Mark anything done that you forgot to check off. Delete what's no longer relevant.</li>
        <li><strong>Review your Waiting For list.</strong> For each item, ask: do I need to nudge someone? If yes, send the message now or schedule it.</li>
        <li><strong>Review every active Project.</strong> This is the heart of the weekly review. For each project, the question is simple: <em>Is there a clear, defined next action?</em> If not, define one. If the project has stalled, decide whether to revive it, defer it to someday, or kill it.</li>
      </ol>
      <p>
        If you're using a GTD-native app, this list-walk is built into the review wizard so you don't have to remember the order. If you're not, just keep the sequence above on a sticky note next to your screen.
      </p>

      <h2>Step 3 — Get creative (5 minutes)</h2>
      <p>
        End the review by looking at your Someday/Maybe list. This is the list of things you've decided not to commit to yet — book ideas, business concepts, trips, side projects. Anything spark for you this week? Promote it to an active project. Anything feel dead? Delete it without guilt.
      </p>
      <p>
        Allen's original version also includes a quick scan of your Areas of Focus (career, health, relationships, etc.) to ask: <em>am I making progress in each of these?</em> If a whole area has been quiet for a month, that's a signal. Capture an action.
      </p>

      <h2>Common failure modes (and fixes)</h2>
      <p>Three things derail most weekly reviews:</p>
      <ul>
        <li><strong>Doing it occasionally instead of weekly.</strong> Same calendar slot, every week. Treat it like brushing your teeth.</li>
        <li><strong>Letting it sprawl past 45 minutes.</strong> A 30-minute timebox is a feature. If you can't finish, that's a sign your projects list has gotten too big — prune it during the review itself.</li>
        <li><strong>Trying to do real work during the review.</strong> The weekly review is for organizing the system, not executing it. If you find yourself diving into a deep task, pull back. Capture a next action and move on.</li>
      </ul>

      <h2>Make the review effortless</h2>
      <p>
        We built the <Link to="/features" className="text-primary hover:underline font-medium">weekly review wizard</Link> in Things Done specifically to remove the willpower cost: it walks you through every step in order, surfaces stale projects automatically, and on the Pro plan an AI coach suggests next actions for projects you've been stuck on. The whole thing takes 25–30 minutes.
      </p>
      <p>
        But you don't need our app to start. The simplest version is a recurring 30-minute calendar block on Sunday evening, a notepad, and the seven-step list above. Do that for a month. You'll feel the difference by week three.
      </p>

      <blockquote>
        <p>
          "You will only get out of GTD what you put into your weekly review."
          <br />
          <span className="text-sm">— David Allen</span>
        </p>
      </blockquote>

      <p>
        Ready to make the weekly review a real habit? <Link to="/auth" className="text-primary hover:underline font-medium">Try Things Done. free</Link> and let the wizard do the remembering for you.
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
  "getting-things-done-method-beginners-guide": GtdBeginnersGuideArticle,
  "how-to-build-a-productivity-system": ProductivitySystemArticle,
  "best-gtd-apps": BestGtdAppsArticle,
  "how-to-do-a-weekly-review": WeeklyReviewArticle,
};

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;
  const Content = slug ? ARTICLE_CONTENT[slug] : undefined;

  if (!article || !Content) return <NotFound />;

  const url = `${SITE_URL}/blog/${article.slug}`;
  const imageUrl = article.heroImage.startsWith("http")
    ? article.heroImage
    : `${SITE_URL}${article.heroImage}`;

  const jsonLd = [
    articleJsonLd({
      headline: article.title,
      description: article.description,
      url,
      image: imageUrl,
      datePublished: article.date,
      authorName: article.author,
    }),
    breadcrumbJsonLd([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Blog", url: `${SITE_URL}/blog` },
      { name: article.title },
    ]),
  ];

  return (
    <>
      <SEOHead
        title={`${article.title} — Things Done.`}
        description={article.description}
        canonical={url}
        ogImage={imageUrl}
        ogType="article"
        jsonLd={jsonLd}
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
