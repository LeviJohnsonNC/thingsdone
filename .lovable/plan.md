

# SEO Fixes Round 2 — Critique & Plan

## Critique of the Request

**Items already done (from Round 1) that the user may not realize:**

- **Item 3 (FAQPage JSON-LD)**: Already implemented at `PricingPage.tsx` lines 142-149. The FAQ array generates the schema dynamically. The user's requested text mostly matches what's already there. No change needed unless we want to tweak wording.
- **Item 4 (BreadcrumbList schema)**: Already implemented at `BlogArticlePage.tsx` lines 633-641. Dynamic per-article title. Done.

**Items that are genuinely needed:**

- **Item 1 (Hero text contrast)**: Real problem. `HomeHeroSection.tsx` line 12 still has `initial={{ opacity: 0, y: 20 }}` — the hero was excluded from the Round 1 fix because it uses `animate` not `whileInView`. But `opacity: 0` on initial render is still invisible to Googlebot/screen readers until JS runs. Needs fixing.
- **Item 2 (FAQ DOM rendering)**: Real problem. Radix `AccordionContent` unmounts collapsed content by default. Need to use the `forceMount` prop so answers are always in the DOM, then use CSS to hide them visually when collapsed.
- **Item 5 (Features page word count)**: Currently ~633 words per user. Need ~170+ more words distributed across the 6 feature blocks.
- **Item 6 (Product screenshot images)**: The homepage only has SVG-based `ProductMockup` components — no `<img>` tags. We don't have real screenshot PNG files in the repo. We can render the `ProductMockup` components as before but also add `<img>` tags using the existing `og-image.png` and blog hero images as product visuals, with proper alt text, width/height, and lazy loading.
- **Item 7 (External outbound links)**: Easy. Add 1-2 authoritative external links per blog article (GTD Wikipedia, Zeigarnik effect research, David Allen's site).

**Also noticed:** `FeaturesPage.tsx` hero (line 90-91) and `PricingPage.tsx` hero (line 164) both have `initial={{ opacity: 0 }}` — same problem as the homepage hero. Should fix those too.

---

## Plan

### 1. Fix hero animation opacity (HomeHeroSection, FeaturesPage, PricingPage)

Change `initial={{ opacity: 0, ... }}` to `initial={{ opacity: 1, y: 0 }}` for all `animate`-based (not `whileInView`) hero sections. The text/product visual block in the hero section animates on mount — keep `animate` but start from a visible state so the content is readable before JS hydrates.

**Files:** `HomeHeroSection.tsx` (lines 12, 41), `FeaturesPage.tsx` (line 90), `PricingPage.tsx` (line 164)

### 2. Force-mount FAQ accordion answers

Add `forceMount` prop to each `AccordionContent` in `PricingPage.tsx` so answer text is always in the DOM. Update the `AccordionContent` component in `accordion.tsx` to accept `forceMount` and apply `data-[state=closed]:hidden` CSS class so collapsed answers are visually hidden but present in the HTML source.

**Files:** `accordion.tsx` (add hidden class for closed state when forceMount is used), `PricingPage.tsx` (add `forceMount` to AccordionContent)

### 3. Skip items 3 & 4 (already implemented)

FAQPage JSON-LD and BreadcrumbList schema are already in place from Round 1. No changes needed.

### 4. Expand Features page to 800+ words

Add 1-2 sentences to each of the 6 feature `body` strings, focusing on GTD keywords (next actions, weekly review, productivity system, project management, inbox zero). Target ~170 additional words.

**Files:** `FeaturesPage.tsx`

### 5. Add product images to homepage

Add 2-3 `<img>` elements to the homepage using:
- `og-image.png` as a hero-area product screenshot
- Blog hero images (already exist in `src/assets/blog/`) repurposed as below-fold product visuals

Each `<img>` will have descriptive `alt` text, explicit `width`/`height`, and `loading="lazy"` for below-fold placement. Add them to `HowItWorksSection.tsx` or `HomeHeroSection.tsx`.

**Files:** `HomeHeroSection.tsx` or `HowItWorksSection.tsx`, possibly `ProductPhilosophySection.tsx`

### 6. Add external outbound links to blog articles

Add authoritative external links to each article:
- **WhyYourToDoListArticle**: Link to [Wikipedia GTD article](https://en.wikipedia.org/wiki/Getting_Things_Done) when mentioning David Allen's methodology
- **OpenLoopsArticle**: Link to [Wikipedia Zeigarnik effect](https://en.wikipedia.org/wiki/Zeigarnik_effect) and the Baumeister & Masicampo research
- **ChaosToCalm**: Link to [David Allen's official site](https://gettingthingsdone.com)
- **TwoMinuteRuleArticle**: Link to [Wikipedia GTD](https://en.wikipedia.org/wiki/Getting_Things_Done)

**Files:** `BlogArticlePage.tsx`

---

## File Summary

| File | Changes |
|------|---------|
| `HomeHeroSection.tsx` | Fix initial opacity to 1 |
| `FeaturesPage.tsx` | Fix hero opacity, expand feature text |
| `PricingPage.tsx` | Fix hero opacity, add `forceMount` to FAQ |
| `accordion.tsx` | Support `forceMount` with CSS-hidden closed state |
| `HowItWorksSection.tsx` | Add `<img>` product screenshots |
| `BlogArticlePage.tsx` | Add external outbound links |

No database changes. No new dependencies.

