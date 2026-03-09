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
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find((a) => a.slug === slug);
}
