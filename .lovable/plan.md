

# Landing Page Level-Up: Richer Background, Better Motion, Visual Variety

## The Problem

Comparing our site to instruct.ai, three gaps stand out:

1. **Background is too flat** -- instruct.ai has a watercolor/marble texture that feels organic and alive. Ours is barely-visible radial gradients on a near-white background. It looks empty.
2. **Motion is uniform** -- every element fades up the same way (opacity 0 to 1, y 20 to 0). No stagger, no scale, no variety. Instruct uses different animation types for different elements.
3. **Everything looks the same** -- all sections use the same card style, same rounded borders, same spacing. Instruct varies its sections visually (full-bleed background, dark sections, asymmetric layouts, gradient cards).

## What We'll Change

### 1. Hero Background -- SVG Noise Texture + Animated Gradient Orbs
- Add a subtle SVG noise/grain texture overlay to the hero (inline SVG filter, no external asset)
- Make the gradient orbs **slowly animate** using CSS keyframes (drift/pulse) so the background feels alive, not static
- Increase gradient opacity (from 0.08 to ~0.15) so the color is actually visible
- Add a soft top-edge gradient fade from the nav into the hero

### 2. Motion Variety Across Sections
- **Hero**: Staggered fade-up with slight scale (0.97 to 1) on the headline for a zoom-in feel
- **HowItWorksSection cards**: Staggered entrance with alternating directions -- odd cards slide from left, even from right
- **ProductPhilosophySection**: Tab content transitions use horizontal slide (not vertical), and the mockup scales in from 0.95
- **WeeklyReviewSection**: Parallax-lite effect -- the mockup moves slightly slower than the text on scroll (using Framer Motion `useScroll` + `useTransform`)
- **CTA**: Scale-in animation instead of the same fade-up

### 3. Visual Variety Between Sections
- **HowItWorksSection**: Give each card a **unique accent color gradient** on its icon background (blue, green, amber, purple) instead of all using `bg-primary/10`. Add a faint matching gradient stripe at the top of each card.
- **ProductPhilosophySection**: Switch to a **dark/inverted background** (dark card bg with light text) to break the monotony of all-white sections. This creates the visual rhythm instruct.ai achieves.
- **WeeklyReviewSection**: Add a subtle background pattern (CSS dot grid or diagonal lines) behind the section to distinguish it.
- **CTA Section**: Add a gradient border glow effect on the primary button (animated shimmer on hover).

## Files Modified

| File | Change |
|------|--------|
| `src/index.css` | Add animated orb keyframes, SVG noise texture class, dot-grid pattern, gradient button shimmer |
| `src/components/marketing/HomeHeroSection.tsx` | Animated gradient orbs (CSS animation classes), noise overlay div, scale+fade headline animation |
| `src/components/marketing/HowItWorksSection.tsx` | Per-card accent colors, alternating slide directions, gradient stripe on cards |
| `src/components/marketing/ProductPhilosophySection.tsx` | Dark/inverted section bg, horizontal tab transitions, mockup scale animation |
| `src/components/marketing/WeeklyReviewSection.tsx` | Dot-grid background, parallax-lite scroll effect on mockup |
| `src/components/marketing/HomeCTASection.tsx` | Scale-in animation, gradient shimmer on CTA button |

## Technical Details

- **Noise texture**: Inline SVG `<filter>` with `feTurbulence` rendered as a fixed overlay at low opacity (~0.03). No external images needed.
- **Animated orbs**: CSS `@keyframes` with `translate` and opacity changes over 8-12s, `infinite alternate`. Applied to existing gradient divs.
- **Parallax-lite**: Framer Motion `useScroll({ target: ref })` + `useTransform(scrollYProgress, [0,1], [30, -30])` on the mockup container. Lightweight, no scroll listeners.
- **Dark section**: Uses existing CSS variables (`--card`, `--card-foreground`) but overrides them locally with a Tailwind `dark` class variant or inline HSL values (e.g., `bg-[hsl(222,47%,8%)]` with `text-[hsl(210,40%,96%)]`).
- **Card accent colors**: Array of HSL tuples mapped per card index, applied to icon container and a 2px top gradient strip.
- No new dependencies required.

