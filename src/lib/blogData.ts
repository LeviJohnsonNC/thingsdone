import heroTodoList from "@/assets/blog/hero-todo-list.jpg";
import heroOpenLoops from "@/assets/blog/hero-open-loops.jpg";
import heroChaosToCalm from "@/assets/blog/hero-chaos-to-calm.jpg";
import heroTwoMinuteRule from "@/assets/blog/hero-two-minute-rule.jpg";
import heroGtdGuide from "@/assets/blog/hero-gtd-beginners-guide.png";
import heroProductivitySystem from "@/assets/blog/hero-productivity-system.png";
import heroBestGtdApps from "@/assets/blog/hero-best-gtd-apps.jpg";
import heroWeeklyReview from "@/assets/blog/hero-weekly-review.jpg";

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  author: string;
  tags: string[];
  heroImage: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "why-your-to-do-list-doesnt-work",
    title: "Why Your To-Do List Doesn't Work",
    description:
      "Most productivity systems fail because they treat all tasks equally. Here's how the GTD® method fixes that — and why your brain will thank you.",
    date: "2026-03-09",
    readingTime: "8 min read",
    author: "Things Done.",
    tags: ["Productivity", "GTD®", "Getting Started"],
    heroImage: heroTodoList,
  },
  {
    slug: "the-hidden-cost-of-open-loops",
    title: "The Hidden Cost of Open Loops",
    description:
      "That nagging feeling you can't shake? It's not anxiety — it's cognitive debt. Here's the science behind why uncaptured tasks exhaust your brain.",
    date: "2026-03-08",
    readingTime: "7 min read",
    author: "Things Done.",
    tags: ["Psychology", "Productivity", "Deep Dive"],
    heroImage: heroOpenLoops,
  },
  {
    slug: "from-chaos-to-calm",
    title: "From Chaos to Calm in 30 Days of GTD",
    description:
      "I was drowning in browser tabs, sticky notes, and guilt. Then I committed to GTD® for 30 days. Here's what changed — and what surprised me.",
    date: "2026-03-07",
    readingTime: "6 min read",
    author: "Things Done.",
    tags: ["Personal Story", "Inspiration"],
    heroImage: heroChaosToCalm,
  },
  {
    slug: "the-two-minute-rule",
    title: "The Two-Minute Rule for GTD",
    description:
      "If it takes less than two minutes, do it now. This simple rule clears more tasks than any app ever could.",
    date: "2026-03-06",
    readingTime: "5 min read",
    author: "Things Done.",
    tags: ["GTD®", "Quick Tips", "Tactics"],
    heroImage: heroTwoMinuteRule,
  },
  {
    slug: "getting-things-done-method-beginners-guide",
    title: "The GTD Method: A Beginner's Guide",
    description:
      "Learn the Getting Things Done (GTD) method step by step. This beginner's guide breaks down David Allen's 5-step productivity system so you can stop forgetting tasks and start getting things done.",
    date: "2026-03-14",
    readingTime: "10 min read",
    author: "Things Done.",
    tags: ["GTD®", "Getting Started", "Productivity"],
    heroImage: heroGtdGuide,
  },
  {
    slug: "how-to-build-a-productivity-system",
    title: "How to Build a Productivity System",
    description:
      "Overwhelmed by tasks and to-do lists? Learn how to build a simple productivity system that actually sticks — with practical steps you can start using today.",
    date: "2026-03-14",
    readingTime: "9 min read",
    author: "Things Done.",
    tags: ["Productivity", "Deep Dive", "Getting Started"],
    heroImage: heroProductivitySystem,
  },
  {
    slug: "best-gtd-apps",
    title: "Best GTD Apps in 2026",
    description:
      "An honest comparison of the best GTD apps in 2026 — what to look for, what to avoid, and how to pick one that actually fits Getting Things Done.",
    date: "2026-05-09",
    readingTime: "11 min read",
    author: "Things Done.",
    tags: ["GTD®", "App Comparison", "Buying Guide"],
    heroImage: heroBestGtdApps,
  },
  {
    slug: "how-to-do-a-weekly-review",
    title: "How to Do a Weekly Review (The David Allen Way) — A 30-Minute Walkthrough",
    description:
      "A step-by-step walkthrough of the GTD weekly review — the keystone habit that keeps your system trustworthy week after week.",
    date: "2026-05-10",
    readingTime: "9 min read",
    author: "Things Done.",
    tags: ["GTD®", "Weekly Review", "Habits"],
    heroImage: heroWeeklyReview,
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
