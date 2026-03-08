

## Critique

The spec is excellent — clear, well-structured, and tonally consistent. A few adjustments:

1. **No `react-helmet`** — This is a Vite SPA, not SSR. Per-page `<title>` changes can use a simple `useEffect` with `document.title`. OG meta tags are static (set in `index.html`) since crawlers won't execute JS anyway. Don't add a dependency for this.

2. **Screenshots/illustrations are placeholder-only for now** — We can't take real app screenshots programmatically. I'll use styled placeholder blocks with Lucide icons and descriptive text that you can swap for real images later.

3. **Framer Motion is already installed** — The spec says "use IntersectionObserver + CSS transitions, not a heavy animation library." But Framer Motion is already a project dependency and the project convention. I'll use it for scroll-triggered fade-ins to stay consistent.

4. **`text-wrap: balance` utility** — This is a native CSS property now supported in modern browsers. Tailwind v3 has `text-balance` built in, so no custom CSS needed.

5. **JetBrains Mono** — Skipping this for now. There are only a couple of spots where it'd apply (the "$4" price). Not worth the font load.

6. **The routing change is the trickiest part** — Currently `/*` catches everything and requires auth. We need to carve out `/`, `/features`, `/pricing` as public routes that redirect to `/inbox` if authenticated. The `ProtectedRoutes` wildcard moves to `/app/*` or we restructure the route matching order.

7. **PricingCard reuse with UpgradePrompt** — Good idea from the spec. I'll extract a shared `PricingCard` component used by both the Pricing page and the existing `UpgradePrompt` dialog.

---

## Implementation Plan

This is a large build. I'll break it into 4 implementation rounds to stay within quality bounds.

### Round 1: Foundation (fonts, tokens, layout shell, routing)

**Files changed:** `index.html`, `src/index.css`, `tailwind.config.ts`, `src/App.tsx`
**Files created:** `src/components/marketing/MarketingLayout.tsx`, `src/components/marketing/MarketingNav.tsx`, `src/components/marketing/MarketingFooter.tsx`

- Add Instrument Serif font link to `index.html`
- Add `--hero-bg` and `--pricing-highlight` CSS tokens; add `.font-display` class
- Add `hero-bg` and `pricing-highlight` to Tailwind config colors
- Create `MarketingNav` — fixed, frosted glass, wordmark + links + Sign In ghost button, mobile hamburger
- Create `MarketingFooter` — minimal single-row
- Create `MarketingLayout` — wraps nav + children + footer
- Update `App.tsx` routing: public routes for `/`, `/features`, `/pricing` render inside `MarketingLayout`; authenticated users on those routes redirect to `/inbox`; protected routes remain unchanged

### Round 2: Home Page

**Files created:** `src/pages/HomePage.tsx`, `src/components/marketing/HeroSection.tsx`, `src/components/marketing/ValuePropsSection.tsx`, `src/components/marketing/AppPreviewSection.tsx`, `src/components/marketing/CTAFooterSection.tsx`

- `HeroSection` — full-viewport, Instrument Serif headline "Clear your mind. Own your day.", sub-headline, primary CTA, trust line, scroll indicator
- `ValuePropsSection` — 2x2 grid with Lucide icons, headlines, descriptions (Capture, Next, Never drop, Review)
- `AppPreviewSection` — styled placeholder frame with descriptive text (swap for real screenshot later)
- `CTAFooterSection` — Instrument Serif headline + CTA button
- Scroll-triggered fade-in via Framer Motion `whileInView`

### Round 3: Features Page

**Files created:** `src/pages/FeaturesPage.tsx`, `src/components/marketing/FeatureBlock.tsx`

- Hero with Instrument Serif headline
- 6 alternating feature blocks (Capture, Organize, Projects, Focus, Calendar, AI Coach)
- Each block: headline, body text, placeholder image area
- "Coming Soon" badge on AI Coach
- Alternating layout (text left/image right, then reversed)

### Round 4: Pricing Page + Auth tweaks + SEO

**Files created:** `src/pages/PricingPage.tsx`, `src/components/marketing/PricingCard.tsx`, `src/components/marketing/FAQSection.tsx`
**Files changed:** `src/pages/Auth.tsx`, `src/components/UpgradePrompt.tsx`, `index.html`

- `PricingCard` — reusable component for Free and Pro tiers with feature lists, CTAs, recommended badge
- `PricingPage` — two cards side by side, FAQ accordion below
- Refactor `UpgradePrompt` to use `PricingCard` internally
- Auth page: add wordmark, "Back to home" link
- Update `index.html` meta tags with new copy and description

### Implementation Order

```text
Round 1 → Round 2 → Round 3 → Round 4
```

Each round is a self-contained, shippable increment.

