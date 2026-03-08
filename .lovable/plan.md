

## Critique of the Plan

The brief is thorough and well-articulated. A few observations before implementation:

**What's strong:**
- Clear page structure with a logical narrative arc (promise, proof, workflow, differentiation, trust, CTA)
- Specific copy provided for every section -- reduces ambiguity
- Product-led visual approach is the right call
- Typography guidance is sensible (serif for emotional headlines, sans for everything else)

**What needs adjustment:**
- **Hero visual**: A layered multi-frame product mockup built purely in CSS/React is feasible and actually looks better than screenshots at this stage. We can build styled "app frame" components (similar to the existing `AppPreviewSection`) showing real-ish UI. This is swappable later for actual screenshots.
- **Section count**: 5 sections plus nav/footer is a lot of new component code. To keep this manageable and reviewable, I'll split into focused component files.
- **"See how it works" CTA** in the Weekly Review section: This should link to `/features` rather than being a dead link.
- **Step numbering in "How it works"**: Adding visible step numbers (01, 02, 03, 04) creates visual rhythm and reinforces the sequential nature of GTD.

---

## Implementation Plan

### Files to create (6 new components)

**`src/components/marketing/HomeHeroSection.tsx`**
- Split layout: text left, product mockup right (desktop); stacked on mobile
- Serif headline: "Capture everything. Know what to do next."
- Sans-serif subhead, CTA button, microcopy
- Product mockup: a styled app frame showing a simplified task list UI (built in React/Tailwind, not an image), designed to be replaceable later
- Remove the full-viewport-height centering and scroll indicator; use generous but not excessive padding (py-20 to py-28)

**`src/components/marketing/HowItWorksSection.tsx`**
- Section heading (sans-serif, larger) + intro line
- 4 step blocks with step numbers (01-04), title, body text
- Each block has a placeholder area for a product visual (styled app frame crops showing inbox, item editor, project list, review UI)
- Desktop: alternating image/text rows; Mobile: stacked
- Subtle background alternation (hero-bg vs background)

**`src/components/marketing/ProductPhilosophySection.tsx`**
- "Built for people who think in systems, not just lists."
- 3 cards in a row (desktop) / stacked (mobile)
- Each card: small icon or mini UI crop, heading, short body
- Light card styling with border, no heavy shadows

**`src/components/marketing/WeeklyReviewSection.tsx`**
- Dedicated spotlight for Weekly Review as differentiator
- Large product mockup (styled app frame showing review steps)
- Heading + body text + "See how it works" link to `/features`
- Offset layout with visual prominence

**`src/components/marketing/HomeCTASection.tsx`**
- "Build a system you can trust" (serif headline)
- Body text + CTA button
- Cleaner, more conclusive feel than current version

**`src/components/marketing/ProductMockup.tsx`**
- Reusable component that renders a styled app frame with configurable content (task rows, review steps, project list, etc.)
- Takes a `variant` prop to show different views
- Built from Tailwind-styled divs, easily replaceable with real screenshots later

### Files to modify

**`src/pages/HomePage.tsx`**
- Replace imports: swap old sections for new ones
- New section order: HomeHeroSection, HowItWorksSection, ProductPhilosophySection, WeeklyReviewSection, HomeCTASection
- Update document.title to: "Things Done. — Capture everything. Know what to do next."

**`src/index.css`**
- Darken `--muted-foreground` slightly for better body text readability (from 55% lightness to ~45%)
- Add a CSS variable for step-number color if needed

**`src/components/marketing/MarketingNav.tsx`**
- Add "Sign In" to NAV_LINKS array so it appears inline on desktop (currently it's a separate outlined button, which is fine -- keep it)
- No major changes needed; the nav is already clean

### Files to delete

- `src/components/marketing/HeroSection.tsx` (replaced by HomeHeroSection)
- `src/components/marketing/ValuePropsSection.tsx` (replaced by HowItWorksSection)
- `src/components/marketing/AppPreviewSection.tsx` (replaced by WeeklyReviewSection + ProductMockup)
- `src/components/marketing/CTAFooterSection.tsx` (replaced by HomeCTASection)

### Typography approach
- Serif (`font-display`) used only for: hero headline, weekly review section headline, final CTA headline
- All other headings: sans-serif, `text-2xl font-semibold` or `text-xl font-semibold`
- Body text: `text-foreground` (not muted) for primary paragraphs; `text-muted-foreground` only for secondary/supporting text
- Hero headline: tighter line-height (`leading-[1.08]`)

### Visual rhythm
- Alternate section backgrounds: `bg-background` and `bg-hero-bg`
- Sections use `py-20 md:py-28` instead of `py-24` for tighter pacing
- Max-width `max-w-5xl` (up from `max-w-4xl`) for slightly wider content area

