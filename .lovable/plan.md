## Goal

Replace the current homepage with a calm, premium, GTD-native landing page. Warm cream / sand / moss / clay / amber palette, large editorial typography, spacious composition, real product UI in the visuals (not abstract diagrams), and premium image placeholders that already look finished before final artwork lands.

Scope is **homepage only**. `/features`, `/pricing`, `/about`, `/blog`, marketing nav, and footer stay as they are for now (we can do those in a later pass).

## Section structure (7, down from 10)

```text
1. Hero               — "Your brain is not a storage unit."
2. Problem            — Most task apps make you rebuild GTD by hand.
3. GTD-native         — A real place for every open loop.
                        (Capture → Clarify → Do flow folded in as the section spine,
                         plus the 7 GTD module vignettes)
4. Sequential         — Sequential projects only show the next move.
5. Weekly Review +    — The Weekly Review is built in.
   Coach                (AI Coach shown as the answer to "the part people abandon",
                         not framed as a separate AI feature)
6. Editorial vignette — "What changes in a week."
                        (Replaces the four audience cards — one quiet before/after
                         moment instead of a persona grid)
7. Final CTA          — Start with a clear head.

+ Active-development line: single sentence above the footer, not a section.
```

## Design system additions

Add a marketing token layer in `src/index.css` so the homepage can live in the warm palette without polluting the app's calm blue UI:

- `--warm-cream`, `--warm-sand`, `--warm-paper`, `--ink`, `--ink-soft`, `--moss`, `--moss-deep`, `--clay`, `--amber`, `--hairline` (HSL values, light + dark variants)
- Marketing-only shadow + border tokens: `--shadow-tactile`, `--border-hairline`
- New Tailwind utilities wired through `tailwind.config.ts` (e.g. `bg-cream`, `bg-sand`, `text-ink`, `border-hairline`)
- Editorial type pair via `@fontsource`: **Instrument Serif** (display headlines) + **Inter** (body, already in use). Loaded in `src/main.tsx`, wired through `tailwind.config.ts` as `font-display` and `font-sans`.

App UI (calm blue) is unchanged. The marketing tokens scope only to homepage components.

## Image placeholders

A single reusable `<MarketingImagePlaceholder>` component, used everywhere a real visual will eventually land:

- Warm sand surface, hairline border, soft tactile shadow, subtle paper-grain via a quiet SVG noise layer set very low opacity
- Caption label (small caps, ink) and an internal label tag (e.g. `Hero — Loose Thought to Next Action`)
- Variants for hero (large, ~16:10), module (square-ish vignette), wide (flow / sequential), card (audience-style)
- Looks intentional empty — page will not feel "unfinished" before real artwork lands

User will supply real images later; the placeholder receives an optional `src` prop and swaps in cleanly when provided.

## New component files

Created under `src/components/marketing/home/` to keep clean separation from the existing v1 marketing components (which stay on disk in case we want to revert):

- `HeroV2.tsx`
- `ProblemV2.tsx`
- `GtdNativeSection.tsx` (includes the Capture→Clarify→Do flow as its spine)
- `SequentialProjectSection.tsx`
- `WeeklyReviewCoachSection.tsx`
- `EditorialVignetteSection.tsx`
- `FinalCtaSection.tsx`
- `ActiveDevelopmentLine.tsx` (one-line strip, not a section)
- `MarketingImagePlaceholder.tsx` (shared)
- `SectionShell.tsx` (shared spacing/container primitive so every section breathes consistently)

`src/pages/HomePage.tsx` is rewritten to compose these. SEO metadata + JSON-LD stays; the H1 changes to the new hero headline.

## Copy commitments

- **Hero H1:** Your brain is not a storage unit.
- **Hero sub:** GTD-native task management. Capture every open loop, clarify the next action, and keep your system alive with a guided Weekly Review.
- **Hero CTAs:** Start free / See how it works
- **Microcopy:** Free to start. No card. Built for real GTD practice.
- All other section headlines as written in the brief, with Section 7 retitled **"The part of GTD people actually abandon."** so "AI" lives in body copy, not the H2.
- Active-development line: one sentence in running prose, dated, no chip strip.

## Mobile

Not a stack of the desktop layout. Each section gets a deliberate small-screen composition: hero visual moves below headline and gets full-bleed, GTD module vignettes become a horizontally-scrollable rail (snap), sequential project becomes a vertical reveal, Weekly Review becomes a vertical numbered rail. Verified at 375 / 414 / 768.

## Out of scope (deliberate, for later passes)

- Marketing nav restyle, footer restyle, `/features`, `/pricing`, `/about`, blog
- Real images (user will supply)
- Active development chip section (replaced by single line)
- Audience persona grid (replaced by editorial vignette)
- Reference feature, calendar sync, contacts — not surfaced on the homepage per the brief

## Technical details

- Fonts: `bun add @fontsource/instrument-serif`; import `@fontsource/instrument-serif/400.css` and `/400-italic.css` in `src/main.tsx`. Map to `fontFamily.display` in `tailwind.config.ts`. Inter is already loaded.
- Tokens: extend `:root` and `.dark` in `src/index.css` with the warm palette HSL triples; extend `theme.extend.colors` in `tailwind.config.ts` (cream, sand, paper, ink, ink-soft, moss, moss-deep, clay, amber, hairline).
- Placeholders use an inline SVG `<filter id="grain"><feTurbulence/></filter>` referenced by `feImage` for the paper texture; opacity ~0.04 so it never reads as noise.
- Sections use a shared `SectionShell` with vertical padding scale `py-24 md:py-32 lg:py-40` and a max-width-7xl container with generous gutters. This is the single biggest contributor to the "spacious" feel.
- Motion: subtle only. Hero headline + sub fade up on mount, sections fade in once on scroll into view via Framer Motion (already in the project). No parallax, no marquee, no scroll-jacking. Respect `prefers-reduced-motion`.
- The old marketing v1 components stay in `src/components/marketing/` untouched and unimported — easy revert.

## Build / verify

- Confirm the homepage renders top-to-bottom with no console errors
- Verify type scale and color tokens render correctly in light + dark
- Screenshot at 1440 desktop and 390 mobile via Playwright; confirm no overlap, no cut text, consistent breathing room across sections
- Confirm placeholders look intentional (not "TODO")
- Confirm app UI (`/inbox`, `/next`, settings) is visually unchanged — no token leakage

## Follow-ups after you approve

1. I build the structure with placeholders.
2. You supply images per placeholder label.
3. I swap them in and do a polish pass.
