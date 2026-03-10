import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEOHead, SITE_URL } from "@/components/SEOHead";
import { BLOG_ARTICLES } from "@/lib/blogData";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  return (
    <>
      <SEOHead
        title="Blog — Things Done. | Productivity Tips & GTD® Guides"
        description="Practical guides on Getting Things Done®, task management, and building a productivity system you actually trust."
        canonical={`${SITE_URL}/blog`}
      />

      {/* Hero */}
      <section className="bg-hero-bg px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl text-foreground sm:text-[2.5rem]">
            The Things Done. Blog
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-foreground/70">
            Practical ideas for getting — and staying — on top of your work and life.
          </p>
        </motion.div>
      </section>

      {/* Article grid */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="grid gap-8">
          {BLOG_ARTICLES.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
              >
                {/* Hero image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold text-foreground sm:text-2xl group-hover:text-primary transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {article.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {new Date(article.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      · {article.readingTime}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
