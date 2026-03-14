import heroTodoList from "@/assets/blog/hero-todo-list.jpg";
import heroOpenLoops from "@/assets/blog/hero-open-loops.jpg";
import heroChaosToCalm from "@/assets/blog/hero-chaos-to-calm.jpg";
import heroTwoMinuteRule from "@/assets/blog/hero-two-minute-rule.jpg";
import heroGtdGuide from "@/assets/blog/hero-gtd-beginners-guide.png";
import heroProductivitySystem from "@/assets/blog/hero-productivity-system.png";

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
    title: "Why Your To-Do List Doesn't Work (And What to Do Instead)",
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
    title: "The Hidden Cost of Open Loops: Why Unfinished Tasks Drain You",
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
    title: "From Chaos to Calm: One Month of Actually Trusting My System",
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
    title: "The Two-Minute Rule: The Smallest GTD® Hack With the Biggest Impact",
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
    title: "The Getting Things Done (GTD) Method: A Beginner's Guide That Actually Makes Sense",
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
    title: "How to Build a Productivity System That Actually Sticks",
    description:
      "Overwhelmed by tasks and to-do lists? Learn how to build a simple productivity system that actually sticks — with practical steps you can start using today.",
    date: "2026-03-14",
    readingTime: "9 min read",
    author: "Things Done.",
    tags: ["Productivity", "Deep Dive", "Getting Started"],
    heroImage: heroProductivitySystem,
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
