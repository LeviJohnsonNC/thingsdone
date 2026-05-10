/**
 * Typed JSON-LD builders for SEO structured data.
 * Use with the SEOHead `jsonLd` prop. Pass single objects or arrays.
 */

export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Things Done.",
  url: "https://www.things-done.app",
  logo: "https://www.things-done.app/og-image.png",
  description:
    "Independent GTD task manager built to reduce cognitive load. Capture, clarify, organize, review, do.",
};

export function breadcrumbJsonLd(
  trail: { name: string; url?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      ...(t.url ? { item: t.url } : {}),
    })),
  };
}

export function articleJsonLd(args: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  wordCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": args.url },
    headline: args.headline,
    description: args.description,
    image: args.image,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    author: { "@type": "Organization", name: args.authorName },
    publisher: {
      "@type": "Organization",
      name: "Things Done.",
      logo: {
        "@type": "ImageObject",
        url: "https://www.things-done.app/og-image.png",
      },
    },
    ...(args.wordCount ? { wordCount: args.wordCount } : {}),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function blogIndexJsonLd(
  articles: { title: string; description: string; url: string; date: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Things Done. Blog",
    url: "https://www.things-done.app/blog",
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      description: a.description,
      url: a.url,
      datePublished: a.date,
    })),
  };
}
