# SEO Rebuild Plan — Get Things Done. ranking on Google

## Why we're invisible right now

I fetched the live HTML for `/blog/getting-things-done-method-beginners-guide` to see what Googlebot actually receives. The good news: Lovable prerenders the body content. The bad news, in order of impact:

1. **The prerendered `<head>` is empty.** No `<title>`, no `<meta description>`, no canonical, no OG tags on any route except `/`. Our `SEOHead` component sets these via `useEffect` after JS runs — Googlebot's first pass sees the static `index.html` head (the home page title) on every URL. That single bug is enough to suppress rankings for every page except the homepage.
2. **Thin topical footprint.** 6 blog posts, 1 product page, 1 features page. For competitive terms ("GTD app", "getting things done app", "best task manager for GTD"), Google needs more depth and more interlinking before it trusts us as an authority.
3. **No JSON-LD on articles.** `Article`, `BreadcrumbList`, `FAQPage`, and `HowTo` schema are missing. These don't directly rank you but they win SERP real estate (rich snippets) and signal topical clarity.
4. **One month is genuinely short.** New domains sit in a "sandbox" period. We can't shortcut that, but we can make sure that when Google does start crawling seriously, every page is technically clean and content-rich.
5. **No backlink signals.** Nothing we ship in code fixes this — flagged at the bottom as off-platform work.

## What we'll build

### Part 1 — Fix the head metadata problem (highest impact)

The cleanest SPA fix without a build-time prerenderer is to **inline per-route SEO tags into `index.html` via a route-aware static fallback**, plus harden the runtime `SEOHead` so the `<head>` is never blank during the crawl window.

Concretely:

- **Hoist a default route map into `index.html`**: a small inline `<script>` in `<head>` that reads `location.pathname`, looks up a static `{title, description, canonical}` from a JSON object literal, and writes the matching `<title>`/`<meta>`/`<link rel=canonical>` *synchronously before paint*. This runs before React hydrates, so prerendered HTML snapshots (which Lovable hosting captures) include the right tags. Pages covered: `/`, `/features`, `/pricing`, `/blog`, `/about`, `/legal`, plus each `/blog/<slug>`.
- **Keep `SEOHead`** for runtime updates and JSON-LD, but make it idempotent (replace, don't append duplicates) and run it in a `useLayoutEffect` so the swap happens before the next paint instead of after.
- **Add `<meta name="robots" content="index,follow">`** as a static tag in `index.html` (currently only injected at runtime).
- **Per-route `og:image`**: blog posts already have hero images — pass each article's `heroImage` URL into `SEOHead` as `ogImage` so social/Google previews aren't all the same generic graphic.

### Part 2 — Structured data (rich results)

Add JSON-LD to every meaningful page via the existing `SEOHead` `jsonLd` prop:

- **Blog index (`/blog`)**: `Blog` + `BreadcrumbList`.
- **Blog articles**: `Article` (with `author`, `datePublished`, `dateModified`, `image`, `headline`, `wordCount`) + `BreadcrumbList` + `FAQPage` for the 2-3 articles that already contain Q&A-shaped content (the GTD beginner's guide, the productivity-system post).
- **Pricing page**: `Product` with `Offer`s for Free + Pro tiers.
- **Features page**: `SoftwareApplication` with `featureList`.
- **Home**: extend the existing JSON-LD with `aggregateRating` placeholder (commented; only enable when we have real reviews — fake ratings get manual-action penalties).

### Part 3 — Content depth (topical authority)

Ship 5 new SEO-targeted blog posts aimed at high-intent, lower-competition queries. Each ≥1,500 words, with internal links to existing posts and to `/features`:

1. **"Best GTD Apps in 2026: How to Pick One That Actually Fits the Method"** — keyword: *best gtd app*. Comparative framing; honest about Things Done's positioning.
2. **"How to Do a Weekly Review (The David Allen Way) — A 30-Minute Walkthrough"** — keyword: *weekly review gtd*. Step-by-step with screenshots of our review wizard.
3. **"GTD Contexts in 2026: Why @Phone is Dead and What Replaced It"** — keyword: *gtd contexts*. Modernizes a classic concept, links to our tag system.
4. **"Inbox Zero vs GTD: They're Not the Same Thing"** — keyword: *inbox zero vs gtd*. High-volume comparison query.
5. **"Sequential vs Parallel Projects in GTD: A Practical Guide"** — keyword: *sequential projects gtd*. Showcases a feature only we do well natively.

Each post gets a hero image (use existing `imagegen` skill, premium tier), correct `Article` JSON-LD, and 3-5 contextual internal links.

### Part 4 — On-page hygiene

- **Single H1 per page audit**: home and a few marketing sections currently use `font-display` styled `<h2>`s that read as headlines visually. Verify each route has exactly one `<h1>` matching the SEO title's primary keyword.
- **Image alt text**: blog hero images use the article title as alt text — fine. The "hidden SEO images" block in `HomeHeroSection.tsx` currently points all three to `/og-image.png`. Either replace with real screenshots when we have them or remove the block (it currently risks looking like cloaking).
- **Internal link density**: blog posts link out well; marketing pages don't link to blog. Add a 3-card "Read more" strip to `/features` and `/pricing` pulling from the most relevant blog posts.
- **Sitemap regen**: add the 5 new posts to `public/sitemap.xml` and bump `lastmod` on existing entries.
- **`hreflang` self-reference**: add `<link rel="alternate" hreflang="en" href="...">` and `hreflang="x-default"` so we're explicit about language targeting.

### Part 5 — Crawl-rate signals

- **Submit updated sitemap to Google Search Console** (manual user step — flagged below).
- **Add a `lastmod` to the sitemap entry for `/`** that we bump on each marketing release. Google revisits more often when `lastmod` moves.
- **Add `<link rel="me">` and an `Organization` JSON-LD** with `sameAs` pointing to any social profiles (X, GitHub, LinkedIn) we have. Even one or two `sameAs` entries help disambiguate the brand entity.

## Technical details

- **Inline route metadata in `index.html`**: a ~2 KB script literal mapping pathnames to `{title, description}`. Blog slugs are matched via `startsWith('/blog/')` then a lookup into a flat object generated at build time. We don't need build tooling — we'll generate it once and check it in, and add a comment reminding to update when adding posts. (A future improvement is a Vite plugin that reads `blogData.ts` and templates `index.html`, but that's out of scope here.)
- **`SEOHead` changes**: switch to `useLayoutEffect`, dedupe meta tags by `[name|property]` selector before insert (it already does this — verify), and accept `ogImage` per route so blog posts pass their hero.
- **JSON-LD helpers**: add `src/lib/jsonLd.ts` with typed builders (`articleJsonLd`, `breadcrumbJsonLd`, `faqJsonLd`, `productJsonLd`) so pages stay clean.
- **New blog posts**: extend `BLOG_ARTICLES` in `src/lib/blogData.ts`, render their JSX in `BlogArticlePage.tsx` following the existing pattern, generate hero images into `src/assets/blog/`.
- **Sitemap**: hand-edited `public/sitemap.xml`; no build step needed.
- **No new dependencies.**

## Files touched (estimate)

- `index.html` — inline route metadata script + static robots/hreflang
- `src/components/SEOHead.tsx` — `useLayoutEffect`, `ogImage` plumbing
- `src/lib/jsonLd.ts` — new helpers
- `src/pages/BlogPage.tsx`, `BlogArticlePage.tsx`, `FeaturesPage.tsx`, `PricingPage.tsx`, `HomePage.tsx`, `AboutPage.tsx` — pass JSON-LD + per-route ogImage
- `src/lib/blogData.ts` — 5 new entries
- `src/pages/BlogArticlePage.tsx` — 5 new article JSX components
- `src/assets/blog/*.png` — 5 new hero images (premium tier)
- `src/components/marketing/HomeHeroSection.tsx` — fix the suspicious hidden-image block
- `public/sitemap.xml` — add 5 new URLs, bump lastmods

## What this won't fix (manual / off-platform)

These I can't do from inside the codebase. Flagging so you can act:

1. **Google Search Console**: verify the domain (you may already have done this via the `googlea00c144ba59d80a3.html` file in `/public` — confirm it's verified), submit the updated sitemap, and use "Inspect URL → Request Indexing" for the 6 most important pages. This alone often unsticks new sites.
2. **Backlinks**: the hardest part. Concrete options — submit to Product Hunt, list on alternativeto.net under "Things 3 alternatives" and "Todoist alternatives", post a launch story on Hacker News tied to the GTD-native angle, reach out to 3-5 GTD bloggers (Lifehacker, Cal Newport's audience, r/gtd) with the beginner's guide post.
3. **Page Speed**: Google uses Core Web Vitals. Once shipped, run PageSpeed Insights on the homepage and a blog post; if LCP > 2.5s on mobile we'll need to revisit (likely the hero image / Framer Motion).

## Suggested rollout order

1. Part 1 (head metadata fix) — ship immediately, this is the unlock.
2. Part 4 (on-page hygiene) + Part 2 (JSON-LD) — same PR if small.
3. Part 3 (5 new posts) — ship in batches of 2-3 per week so the sitemap shows steady fresh `lastmod` values.
4. Part 5 (Search Console resubmit) — after each batch.

Expect 4-8 weeks before meaningful organic traffic shifts; SEO is slow.
