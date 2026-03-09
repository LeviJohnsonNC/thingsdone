export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  author: string;
  tags: string[];
  heroImage?: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "why-your-to-do-list-doesnt-work",
    title: "Why Your To-Do List Doesn't Work (And What to Do Instead)",
    description:
      "Most productivity systems fail because they treat all tasks equally. Here's how the GTD method fixes that — and why your brain will thank you.",
    date: "2026-03-09",
    readingTime: "8 min read",
    author: "Things Done.",
    tags: ["Productivity", "GTD", "Getting Started"],
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
  },
  {
    slug: "from-chaos-to-calm",
    title: "From Chaos to Calm: One Month of Actually Trusting My System",
    description:
      "I was drowning in browser tabs, sticky notes, and guilt. Then I committed to GTD for 30 days. Here's what changed — and what surprised me.",
    date: "2026-03-07",
    readingTime: "6 min read",
    author: "Things Done.",
    tags: ["Personal Story", "Inspiration"],
  },
  {
    slug: "the-two-minute-rule",
    title: "The Two-Minute Rule: The Smallest GTD Hack With the Biggest Impact",
    description:
      "If it takes less than two minutes, do it now. This simple rule clears more tasks than any app ever could.",
    date: "2026-03-06",
    readingTime: "5 min read",
    author: "Things Done.",
    tags: ["GTD", "Quick Tips", "Tactics"],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
