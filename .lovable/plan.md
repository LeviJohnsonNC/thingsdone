

# SEO Fixes — Implementation Plan

## Scope

12 items touching ~15 files. No database changes needed.

---

## 1. Domain replacement: `thingsdone.lovable.app` → `things-done.app`

**Files with hardcoded domain (11 files):**

| File | Occurrences |
|------|-------------|
| `index.html` | canonical, og:image, og:url, twitter:image (5) |
| `src/components/SEOHead.tsx` | DEFAULT_OG_IMAGE (1) |
| `src/pages/HomePage.tsx` | jsonLd url, canonical (2) |
| `src/pages/FeaturesPage.tsx` | canonical (1) |
| `src/pages/PricingPage.tsx` | canonical (1) |
| `src/pages/BlogPage.tsx` | canonical (1) |
| `src/pages/BlogArticlePage.tsx` | canonical, jsonLd url (2) |
| `public/sitemap.xml` | all `<loc>` entries (9) |
| `public/robots.txt` | Sitemap line (1) |
| `supabase/functions/create-checkout/index.ts` | fallback origin (1) |
| `supabase/functions/customer-portal/index.ts` | fallback origin (1) |

Approach: Extract a `SITE_URL` constant in `SEOHead.tsx` (`https://things-done.app`) and use it in all page-level SEO calls. For static files and edge functions, find-and-replace directly.

## 2. Fix `robots.txt`
Update Sitemap line to `https://things-done.app/sitemap.xml`.

## 3. Fix `sitemap.xml`
- Replace all `<loc>` domains
- Add `<lastmod>2026-03-09</lastmod>` to every entry
- Remove the `/auth` entry

## 4. Add `lang="en"` to `<html>` tag
In `index.html`, change `<html lang="en">` — already has `lang="en"` per the provided code. Will verify and ensure it's present.

## 5. Add `<meta name="robots" content="index, follow">`
Add to `SEOHead.tsx` so it's set on every page that uses `SEOHead`.

## 6. Add `og:locale` meta tag
Add `setMeta("property", "og:locale", "en_US")` inside `SEOHead.tsx`.

## 7. Fix animation-dependent content visibility
Update all homepage marketing sections to use `initial={{ opacity: 1, y: 0 }}` instead of `opacity: 0` for `whileInView` animations. This ensures Googlebot sees content without scrolling. The animation still enhances the experience but content is never hidden.

**Files:**
- `HomeHeroSection.tsx` — uses `animate` not `whileInView`, keep as-is (above fold)
- `HowItWorksSection.tsx` — change `initial` from `opacity: 0` to `opacity: 1`
- `ProductPhilosophySection.tsx` — same
- `WeeklyReviewSection.tsx` — same
- `HomeCTASection.tsx` — same

## 8. Expand Features page content
Replace the short `body` strings in the `FEATURES` array with 2-3 sentence descriptions (aim for 800+ total words). Add H2 group headings ("Capture & Organize", "Focus & Execute", "Review & Improve") to structure the feature blocks into logical sections.

## 9. Pricing page FAQ + FAQPage schema
The pricing page already has 8 FAQ items and FAQPage JSON-LD. The user's requested questions overlap but add some new ones. Will merge the user's 5 requested Q&As into the existing FAQ array (adding any that aren't already covered), ensuring the JSON-LD stays in sync.

## 10. Internal cross-links in blog articles
Add contextual `<Link>` elements within each article's JSX body:
- `WhyYourToDoListArticle` — link to `/blog/the-hidden-cost-of-open-loops` and `/features`
- `OpenLoopsArticle` — link to `/blog/why-your-to-do-list-doesnt-work` and `/features`
- `ChaosToCalm` — link to `/blog/the-two-minute-rule` and `/pricing`
- `TwoMinuteRuleArticle` — link to `/blog/from-chaos-to-calm` and `/features`

## 11. BreadcrumbList schema on blog articles
In `BlogArticlePage.tsx`, add a second JSON-LD script with `BreadcrumbList` schema. Merge it into the `jsonLd` prop as an array (SEOHead already handles arrays since PricingPage passes one). Dynamic per-article title at position 3.

## 12. Text contrast on homepage
The homepage uses `text-foreground` (high contrast) for headings and `text-muted-foreground` for body text. The `muted-foreground` color in the CSS is `hsl(215.4 16.3% 46.9%)` — approximately #6B7280 on #FAFBFC background, which is ~4.6:1 contrast (passes AA for body text). The real issue is when `opacity: 0` is the initial state. Fixing item #7 resolves this. Will also verify and slightly darken `muted-foreground` if needed to ensure safe AA compliance.

---

## File change summary

| File | Changes |
|------|---------|
| `index.html` | Domain swap, verify `lang="en"` |
| `public/robots.txt` | Domain swap |
| `public/sitemap.xml` | Domain swap, add lastmod, remove /auth |
| `src/components/SEOHead.tsx` | Add SITE_URL constant, add robots meta, add og:locale |
| `src/pages/HomePage.tsx` | Use SITE_URL |
| `src/pages/FeaturesPage.tsx` | Use SITE_URL, expand feature descriptions, add H2 groupings |
| `src/pages/PricingPage.tsx` | Use SITE_URL, merge new FAQ items |
| `src/pages/BlogPage.tsx` | Use SITE_URL |
| `src/pages/BlogArticlePage.tsx` | Use SITE_URL, add cross-links in 4 articles, add BreadcrumbList schema |
| `src/components/marketing/HowItWorksSection.tsx` | Fix initial opacity |
| `src/components/marketing/ProductPhilosophySection.tsx` | Fix initial opacity |
| `src/components/marketing/WeeklyReviewSection.tsx` | Fix initial opacity |
| `src/components/marketing/HomeCTASection.tsx` | Fix initial opacity |
| `supabase/functions/create-checkout/index.ts` | Domain swap |
| `supabase/functions/customer-portal/index.ts` | Domain swap |

No database migrations. No new dependencies.

