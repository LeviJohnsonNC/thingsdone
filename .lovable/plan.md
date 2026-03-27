

# Landing Page Redesign — Instruct.ai-Inspired

## What we're stealing (adapted for Things Done)

The key elements from Instruct.ai that make it feel premium and dynamic:

1. **Full-bleed hero with atmospheric background image** — watercolor/painterly texture behind centered text, instead of a flat solid color
2. **Centered, vertical hero layout** — large serif headline centered on screen, subtitle below, CTA pill button above the headline, and an interactive input area (we'll adapt this as a quick-capture demo)
3. **Feature cards grid** — rounded cards with illustrations/icons, subtle hover states, category tabs
4. **Tabbed "Integrate / Delegate / Automate" section** — a 3-step value prop with tabs that switch between large background visuals. We'll adapt this as "Capture / Organize / Review"
5. **Clean bottom CTA** — minimal, dark-on-white, two buttons side-by-side
6. **Smooth scroll-triggered animations** — actual opacity/translate animations (your current ones are all `initial={{ opacity: 1, y: 0 }}` which means no animation at all)

## Plan Structure

### Step 1: Fix all animations site-wide
Every `motion.div` currently has `initial={{ opacity: 1, y: 0 }}` which produces zero animation. Change all marketing components to use real values like `initial={{ opacity: 0, y: 20 }}`.

### Step 2: New Hero Section (`HomeHeroSection.tsx`)
Replace the current 2-column layout with a centered, vertical layout:
- Soft watercolor/gradient background using CSS (radial gradients in muted blues/greens to mimic the Instruct painterly look, no external image needed)
- Small pill CTA at top: "Get started free →"
- Large centered serif headline: "Capture everything. Know what to do next."
- Subtitle below
- A decorative "quick capture" input mockup (not functional — just visual, like Instruct's text area) showing a task being typed with a blinking cursor animation
- Below: category pills (Inbox, Next, Projects, Review) as a visual feature preview

### Step 3: Feature Showcase Cards (replace HowItWorksSection)
Replace the current alternating text+mockup steps with a **card grid** (2x2 or 2x3):
- Each card: rounded-xl, subtle border, icon + title + short description + small illustration (reuse ProductMockup compact variants)
- Hover: slight scale + shadow lift
- Keep the 4 existing steps (Capture, Clarify, Organize, Review) as cards

### Step 4: Tabbed Value Prop Section (replace ProductPhilosophySection)
Create a new 3-tab interactive section inspired by Instruct's "Integrate/Delegate/Automate":
- Tabs: "Capture" / "Organize" / "Review"
- Each tab shows: heading, paragraph, and a large ProductMockup visual
- Tabs switch content with crossfade animation
- Large rounded container with subtle background

### Step 5: Weekly Review Section — keep but restyle
Keep the content but match the new aesthetic:
- Add real scroll animations
- Slightly larger padding, more breathing room

### Step 6: Bottom CTA (restyle HomeCTASection)
- Clean, minimal: centered headline + two buttons side by side ("Get started free" primary + "Learn more" outline)
- Remove the heavy background, keep it white/clean

## Files Modified

| File | Change |
|------|--------|
| `src/components/marketing/HomeHeroSection.tsx` | Full rewrite — centered vertical layout with gradient bg, capture mockup |
| `src/components/marketing/HowItWorksSection.tsx` | Rewrite as feature card grid |
| `src/components/marketing/ProductPhilosophySection.tsx` | Rewrite as tabbed value prop section |
| `src/components/marketing/WeeklyReviewSection.tsx` | Restyle + fix animations |
| `src/components/marketing/HomeCTASection.tsx` | Restyle — cleaner, two-button layout |
| `src/index.css` | Add new CSS for hero gradient, typing cursor animation |
| `src/pages/HomePage.tsx` | Potentially reorder sections |

## Technical Details

- All animations use Framer Motion `whileInView` with real `initial={{ opacity: 0, y: 30 }}` values
- Hero background: CSS radial gradients layered to create a soft watercolor effect (no external assets)
- Typing animation: CSS `@keyframes` with a blinking cursor on a mockup input
- Tabbed section: React `useState` + `AnimatePresence` for crossfade between tab content
- No new dependencies needed — Framer Motion + Tailwind handle everything
- SEO: keep all sr-only images and semantic markup from current implementation

