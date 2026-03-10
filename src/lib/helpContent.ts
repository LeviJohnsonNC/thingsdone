import {
  Brain, Inbox, Timer, ArrowRight, FolderOpen, ClipboardList,
  Zap, SlidersHorizontal, Star, Layers, Calendar, BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface HelpTopic {
  id: string;
  section: "gtd" | "app";
  icon: LucideIcon;
  title: string;
  description: string;
  content: string;
}

export const helpTopics: HelpTopic[] = [
  // ── GTD Methodology ──────────────────────────────────────
  {
    id: "what-is-gtd",
    section: "gtd",
    icon: Brain,
    title: "What is GTD®?",
    description: "The core philosophy behind Getting Things Done.",
    content: `**Getting Things Done (GTD)** is a personal productivity methodology created by David Allen. The core insight is simple: your mind is for *having* ideas, not *holding* them.

When you try to keep track of tasks, commitments, and ideas in your head, you create **mental overhead** — a background anxiety that drains your focus and energy. GTD solves this by giving you a **trusted system** outside your brain where everything is captured and organized.

## The 5 Steps of GTD

1. **Capture** — Collect everything that has your attention into a single inbox. Tasks, ideas, reminders, commitments — all of it.

2. **Clarify** — Process each item: What is it? Is it actionable? What's the next concrete step?

3. **Organize** — Put clarified items where they belong: next actions, projects, waiting for, someday/maybe, or calendar.

4. **Reflect** — Regularly review your system to keep it current and trustworthy. The Weekly Review is the keystone habit.

5. **Engage** — With a clear system, you can confidently choose what to work on right now based on context, time, energy, and priority.

## Why it works

GTD doesn't ask you to prioritize harder or work faster. It asks you to **externalize** your commitments so your brain can stop worrying about what you might be forgetting. When you trust your system, you can focus fully on the task at hand.`,
  },
  {
    id: "capture",
    section: "gtd",
    icon: Inbox,
    title: "Capture Everything",
    description: "Why 100% capture matters and how to build the habit.",
    content: `The first step of GTD is **capturing** — getting everything out of your head and into a trusted collection point.

## Why 100% capture matters

If you only capture *some* things, your brain knows the system is incomplete. It will keep trying to remind you of the things you didn't capture, which defeats the purpose. The goal is simple: **nothing lives only in your head.**

## What to capture

- Tasks and to-dos
- Ideas and half-formed thoughts
- Commitments you've made to others
- Things you're waiting on
- Things you want to do "someday"
- Anything that has your attention

## The inbox as a safety net

Your inbox is not a to-do list — it's a **collection bucket**. Everything goes in, and nothing needs to be organized yet. The only rule is: capture it quickly, and trust that you'll process it later.

## Tips for building the capture habit

- **Capture immediately** — Don't tell yourself "I'll remember." You won't.
- **Lower the friction** — The easier it is to capture, the more you'll do it.
- **Don't clarify while capturing** — Just get it down. Processing comes next.
- **Review your inbox regularly** — Capture only works if you trust yourself to come back and process what you've collected.`,
  },
  {
    id: "clarify",
    section: "gtd",
    icon: Timer,
    title: "Clarify: The Two-Minute Rule",
    description: "How to process inbox items and decide what's actionable.",
    content: `Once you've captured items into your inbox, the next step is **clarifying** — deciding what each item actually means and what to do with it.

## Process one item at a time

Go through your inbox from top to bottom. For each item, ask: **"Is this actionable?"**

## The decision tree

**If it's NOT actionable:**
- **Trash it** — If it's no longer relevant, delete it.
- **Someday/Maybe** — If it's interesting but not now, park it for later.
- **Reference** — If it's useful information but requires no action, file it.

**If it IS actionable:**
- **Does it take less than 2 minutes?** → Do it right now. It's faster than organizing it.
- **Should someone else do it?** → Delegate it and track it as "Waiting For."
- **Does it need to happen on a specific date?** → Schedule it.
- **Otherwise** → Define the next physical action and put it on your Next Actions list.

## The Two-Minute Rule

This is one of GTD's most powerful ideas. If something takes less than two minutes to complete, **do it immediately** rather than adding it to your system. The overhead of tracking it would be greater than just doing it.

## What "clarify" really means

Clarifying is about turning vague stuff ("handle the proposal") into concrete next actions ("email Sarah the revised draft by Friday"). The clearer the action, the less resistance you'll feel when it's time to do it.`,
  },
  {
    id: "next-actions",
    section: "gtd",
    icon: ArrowRight,
    title: "Next Actions",
    description: "Why concrete next steps eliminate procrastination.",
    content: `A **next action** is the single, concrete, physical thing you can do to move something forward. It's the most important concept in GTD after capture.

## Why vague tasks paralyze you

Compare these two tasks:

- ❌ "Handle proposal"
- ✅ "Call Mike to discuss the revised pricing section of the Q3 proposal"

The first one requires you to *think* before you can *act*. That thinking creates friction, which leads to procrastination. The second one is clear enough that you can just do it.

## Rules for good next actions

- **Start with a verb** — Call, email, draft, buy, research, schedule.
- **Be specific** — Include enough detail that you know exactly what to do.
- **Make it physical** — "Decide about the project" isn't physical. "Write a list of pros and cons for the project" is.
- **One step only** — A next action is the *very next* thing, not the whole plan.

## Every project needs a next action

If a project doesn't have a defined next action, it's stuck. When you review your projects, the first question to ask is: "What's the very next thing I can do to move this forward?"

## Context matters

Next actions are most useful when organized by context — where you are, what tools you have, how much time and energy you have. This lets you scan a short, relevant list instead of a giant master list.`,
  },
  {
    id: "projects-outcomes",
    section: "gtd",
    icon: FolderOpen,
    title: "Projects & Outcomes",
    description: "How to think about multi-step outcomes in GTD.",
    content: `In GTD, a **project** is any outcome that requires more than one action step to complete. That's it — no minimum size, no complexity threshold.

## Examples of projects

- "Plan team offsite" (many steps)
- "Get new tires on the car" (research → schedule → drop off)
- "Set up new phone" (a few steps, but more than one)

## Define the outcome

Every project should have a clearly defined **desired outcome** — what "done" looks like. This isn't a task; it's a description of the end state.

- ❌ "Website redesign" (too vague)
- ✅ "New marketing website is live with updated copy and pricing page"

## The project list is a tracking list

Your project list exists so nothing falls through the cracks. The actual *work* lives in your next actions. The project list is just an index that reminds you: "These things are in motion, and each one needs a next action."

## Sequential vs. parallel projects

- **Sequential projects** have steps that must happen in order. Only the first incomplete action matters right now.
- **Parallel projects** have independent actions that can happen in any order.

Things Done treats projects as **sequential** by default — only the first incomplete action appears in your Next view. This keeps your action lists focused and prevents overwhelm.

## Review your projects regularly

During your Weekly Review, scan every active project and ask:
1. Is this still relevant?
2. Is the outcome still clear?
3. What's the next action?`,
  },
  {
    id: "weekly-review",
    section: "gtd",
    icon: ClipboardList,
    title: "The Weekly Review",
    description: "The keystone habit that keeps your system trustworthy.",
    content: `The **Weekly Review** is the single most important habit in GTD. Without it, your system gradually becomes outdated, and your brain stops trusting it — which puts you right back to keeping everything in your head.

## Why it matters

Your trusted system is only trustworthy if it's **current**. The Weekly Review is when you bring everything up to date so you can start the next week with a clear mind and a system you trust completely.

## The Weekly Review steps

1. **Clear your inboxes** — Process every captured item. Get to inbox zero.

2. **Review your action lists** — Scan Next Actions, Waiting For, and Scheduled items. Cross off completed items. Add new ones.

3. **Review your project list** — For each active project, confirm:
   - Is this still active?
   - Is the outcome still clear?
   - What's the next action?

4. **Review Someday/Maybe** — Anything ready to activate? Anything to delete?

5. **Review your calendar** — Look back at the past week (anything incomplete?) and forward (anything to prepare for?).

6. **Brain dump** — Capture any new loose ends or ideas that come up during the review.

## How often?

Once a week, ideally at the same time. Many people do Friday afternoon or Sunday evening. The key is consistency — it should become automatic.

## How long?

A typical Weekly Review takes 30–60 minutes. It may feel like a lot, but it saves hours of anxiety and dropped balls during the week.

## The payoff

After a complete Weekly Review, you should feel **clear and current**. You know what's on your plate, nothing important is forgotten, and you can start the week with confidence.`,
  },

  // ── Using Things Done ────────────────────────────────────
  {
    id: "app-quick-capture",
    section: "app",
    icon: Zap,
    title: "Quick Capture",
    description: "How to add tasks to your inbox in seconds.",
    content: `Things Done is designed to make capturing effortless. The goal is zero friction between having a thought and getting it into your system.

## How to capture

**On mobile:**
Tap the **+ button** (floating action button) at the bottom of the screen. Type your thought, hit enter, and it's saved to your Inbox.

**On desktop:**
Use the **quick-add bar** at the top of most views. Type and press Enter.

## Everything lands in Inbox first

No matter where you are in the app, newly captured items always go to your **Inbox**. This is intentional — capture now, organize later.

You don't need to decide the priority, project, or due date at capture time. Just get it down. You'll clarify it during your next processing session.

## Tips

- **Capture liberally** — When in doubt, capture it. You can always delete it later.
- **Keep titles short but clear** — "Call dentist" is better than "I need to remember to call the dentist about that appointment thing."
- **Don't over-organize at capture time** — The inbox is a holding pen, not a filing system.`,
  },
  {
    id: "app-clarify",
    section: "app",
    icon: SlidersHorizontal,
    title: "Clarifying Items",
    description: "How to process and organize tasks from your inbox.",
    content: `Once items are in your Inbox, the next step is **clarifying** — turning each one into a properly organized, actionable item.

## Opening the clarify view

Tap or click any item to open its detail sheet. Here you can see and edit everything about the item.

## Setting the state

Each item has a **state** that determines where it lives in the app:

- **Inbox** — Unclarified, waiting to be processed
- **Next** — A clear, actionable task ready to do
- **Scheduled** — Will become active on a specific date
- **Waiting** — Delegated to someone; you're tracking it
- **Someday** — Interesting but not now

## Adding context

Make your items more useful by adding:

- **Notes** — Additional details, links, or context
- **Time estimate** — How long will this take? (5 min, 15 min, 30 min, 1 hour, 2+ hours)
- **Energy level** — Is this a high-focus task or something you can do on autopilot?
- **Due date** — When must this be completed?
- **Scheduled date** — When should this become active?
- **Tags** — Custom context labels (e.g., @phone, @computer, @errands)
- **Project** — Which project does this belong to?
- **Area of Focus** — Which life/work area does this relate to?

## Processing your inbox

Work through your inbox from top to bottom. For each item:
1. Decide if it's actionable
2. Set the appropriate state
3. Add any helpful context
4. Move to the next item

The goal is **inbox zero** — not "do everything," but "decide on everything."`,
  },
  {
    id: "app-focus-next",
    section: "app",
    icon: Star,
    title: "Focus & Next Views",
    description: "How to decide what to work on right now.",
    content: `Things Done gives you two views for deciding what to work on: **Focus** and **Next**.

## Focus view

Focus shows only the items you've **starred** — your handpicked shortlist for today or this moment. Think of it as your "doing now" list.

- Star items by swiping right on them or toggling the star in the detail view
- Keep this list small — 3 to 5 items is ideal
- Review and update your Focus list at the start of each day

## Next view

Next is your **complete list of actionable items** across all projects and areas. It aggregates:

- All items with state "next"
- The **first incomplete action** from each sequential project (this is key!)
- Scheduled items whose date has arrived

## How sequential projects work

Things Done treats projects as sequential by default. If a project has 5 actions, only the **first incomplete one** (lowest sort order) appears in your Next view. This prevents your Next list from being overwhelmed with tasks you can't do yet.

When you complete the first action, the second one automatically appears in Next.

## Choosing what to work on

When looking at your Next list, consider:
- **Context** — What can you do given where you are and what tools you have?
- **Time available** — Use time estimates to find tasks that fit your current window
- **Energy** — Match task energy levels to your current state
- **Priority** — Focus items first, then scan Next

## Using Area filters

Use the Area of Focus filter (in the sidebar or More menu) to narrow your Next view to a specific area of your life or work.`,
  },
  {
    id: "app-projects-areas",
    section: "app",
    icon: Layers,
    title: "Projects & Areas",
    description: "How to organize work into projects and areas of focus.",
    content: `Things Done uses **Projects** and **Areas of Focus** to give your tasks structure without adding complexity.

## Projects

A project is any outcome that requires more than one action. In Things Done:

- Navigate to the **Projects** view to see all active projects
- Tap **+ New Project** to create one
- Give it a clear outcome-oriented title
- Add items to a project from the item detail view

## Inside a project

Each project has its own list of actions. You can:
- **Reorder items** by dragging them — the order matters because Things Done surfaces only the first incomplete action in your Next view
- **Add notes** to the project for reference
- **Set a project type** — sequential (default) or parallel
- **Set due dates** and **scheduled dates** at the project level

## Project states

Projects can be:
- **Active** — In progress, with a next action
- **Someday** — Parked for later
- **Completed** — Done and moved to the logbook

## Areas of Focus

Areas are the broad categories of your life and work — like "Health," "Career," "Family," or "Side Project." They are not projects; they don't have actions. They are a **filter lens**.

- Create Areas in **Settings**
- Assign items and projects to an Area
- Use the **Area filter** in the sidebar to see only items and projects in a specific area

## Why areas matter

Areas help you during the Weekly Review: "Am I giving enough attention to each area of my life?" They also help during daily work: "Right now I want to focus on my work area — show me only those tasks."`,
  },
  {
    id: "app-scheduled-waiting-someday",
    section: "app",
    icon: Calendar,
    title: "Scheduled, Waiting & Someday",
    description: "How to manage deferred and delegated work.",
    content: `Not everything needs action right now. Things Done gives you three states for items that are deferred:

## Scheduled

Items with a **scheduled date** are things you want to deal with later. They sit in the Scheduled view until their date arrives, at which point they **automatically activate** and appear in your Next view.

Use scheduled items for:
- Follow-up tasks ("Check on this next Monday")
- Reminders ("Renew insurance before March 1")
- Time-sensitive work that isn't relevant yet

## Waiting

Waiting items are things you've **delegated to someone else** and need to track. Each waiting item can have a **contact** assigned — the person you're waiting on.

Use waiting items for:
- "Waiting for Sarah to send the report"
- "Waiting for the vendor to confirm pricing"
- "Waiting for approval from the team"

Review your Waiting list regularly (especially during the Weekly Review) to follow up on stalled items.

## Someday / Maybe

Someday is your **parking lot for ideas** — things that are interesting but not committed. No due date, no pressure.

Examples:
- "Learn to play guitar"
- "Research trip to Japan"
- "Build a reading list app"

During each Weekly Review, scan your Someday list:
- Anything ready to activate? Move it to Next or create a project.
- Anything no longer interesting? Delete it.
- New ideas? Add them here instead of cluttering your active lists.`,
  },
  {
    id: "app-weekly-review",
    section: "app",
    icon: BookOpen,
    title: "Weekly Review in the App",
    description: "How to use the guided review wizard to stay current.",
    content: `Things Done includes a **guided Weekly Review wizard** that walks you through each step of the GTD review process.

## Starting a review

Navigate to **Weekly Review** from the sidebar or More menu. If you haven't completed a review recently, you'll see a prompt to start one.

## The review steps

## 1. Clear & Brain Dump
First, get everything out of your head. The app provides a text area where you can dump loose thoughts, and each one gets captured as a new inbox item. Then, process your inbox to zero.

## 2. State Review
Review items in each state:
- **Next** — Are these still relevant? Any completed?
- **Waiting** — Any items to follow up on?
- **Scheduled** — Dates still correct?
- **Someday** — Anything to activate or remove?

## 3. Project Review
Go through each active project:
- Is the project still active?
- Is the outcome still clear?
- Does it have a next action?
- Are the actions in the right order?

## 4. Summary
See a summary of what you reviewed and any actions taken. Add a reflection note about how the week went.

## Review history

After completing a review, it's saved to your **Review History** (accessible from the Weekly Review page). You can see past reviews, stats, and reflections.

## How often?

Aim for once per week. The sidebar shows how many days it's been since your last review — if the number turns gold, it's been 7+ days and it's time.

## Tips

- **Block 30–45 minutes** on your calendar for the review
- **Do it consistently** — same day, same time each week
- **Don't skip it** — the review is what makes the whole system trustworthy`,
  },
];
