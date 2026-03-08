

## Mobile UX Audit -- Critique & Improvement Plan

### Current Issues Found

**1. Filter bar overflows and is hard to use on small screens**
The filter bar (`ItemFilterBar`) renders Time Est + Energy + Tags all in one horizontal scroll row. On a 375px screen, the time estimate pills alone nearly fill the width. The energy and tags are off-screen with no visual hint to scroll. The scrollbar is visible and ugly.

**2. ItemEditor is too cramped on mobile**
The inline editor expands inside the list. On mobile, the side-by-side PropertyRow layouts (Time Est + Energy, Due + Scheduled, Project + Area) overflow or become unreadably tiny. The `w-[100px]` label column wastes proportionally too much space on a 375px screen. Segment buttons for time/energy are too small to reliably tap.

**3. QuickAddBar duplicates the FAB on Inbox**
On mobile, Inbox shows both the inline "Add to inbox..." bar AND the floating action button. This is redundant -- the FAB already handles quick capture. The inline bar wastes valuable vertical space on small screens.

**4. No safe area / notch handling**
The bottom nav has `safe-area-inset-bottom` as a class but it's not actually defined in CSS. On devices with home indicators (iPhone X+), the bottom nav content may be obscured.

**5. ViewHeader is plain and wastes space**
The header has no visual hierarchy or branding. The count badge is useful but the overall feel is "web app" not "native app." There's no pull-to-refresh or any gestural affordance.

**6. Empty states don't guide action**
Empty states just show a message. They don't include a CTA button (e.g., "Add your first task") which would improve discoverability, especially for new users.

**7. App.css has dead Vite boilerplate**
The file contains `#root { max-width: 1280px; padding: 2rem; }` which could interfere with layout (though it doesn't seem imported). Should be cleaned up.

**8. No haptic/visual feedback on swipe completion**
When swiping right to complete or left to star, the item just disappears. There's no success toast, no haptic-like animation, no satisfying "done" moment.

**9. Bottom nav touch targets are borderline**
The bottom nav buttons have `min-h-[52px]` but the actual tap area for each icon+label is narrow (20% of screen width). The icons are only 20px. This is functional but not generous.

**10. No sticky header pattern**
The ViewHeader scrolls away on long lists, losing context. On mobile, a sticky header with the count would be more useful.

**11. More menu feels disconnected**
The "More" sheet has useful items (Scheduled, Someday, Logbook, Settings) but no visual hierarchy. The area selector at the top is unexpected here. Signed-in user info is missing.

---

### Proposed Plan (Priority Order)

#### A. Fix ItemEditor mobile layout (high impact)
- Stack Time Est + Energy vertically instead of side-by-side on mobile
- Stack Due + Scheduled vertically on mobile
- Stack Project + Area vertically on mobile
- Reduce label column width on mobile or switch to stacked label-above-control layout
- Increase segment button tap targets to 44px height

#### B. Fix FilterBar for mobile
- Hide the scrollbar visually (`scrollbar-hide` utility)
- Add a subtle fade/gradient on the right edge to hint at more content
- Consider collapsing filters into a single filter icon that opens a bottom sheet on mobile

#### C. Hide inline QuickAddBar on mobile (Inbox)
- On mobile, rely solely on the FAB for capture (zero friction, one tap)
- Keep the inline bar on desktop where screen real estate is abundant

#### D. Add safe area insets
- Add proper CSS env() variables for `safe-area-inset-bottom` on the bottom nav and FAB
- Add `safe-area-inset-top` consideration for notched devices

#### E. Make ViewHeader sticky
- Add `sticky top-0 z-10` to the ViewHeader so it stays visible during scroll

#### F. Improve empty states with CTAs
- Add an action button to each empty state (e.g., "Capture something" on Inbox, "Star an item" on Focus)

#### G. Add swipe completion feedback
- After completing via swipe, briefly show a success animation or toast
- Add a subtle scale/fade-out animation on the item row before removal

#### H. Clean up App.css
- Remove all dead Vite boilerplate CSS

#### I. Polish bottom nav
- Slightly increase icon sizes (h-5 -> h-6)
- Ensure proper safe-area padding

#### J. Improve More menu
- Show user email at the bottom
- Add subtle section dividers

### Files to modify:
- `src/components/ItemEditor.tsx` -- responsive stacking
- `src/components/ItemFilterBar.tsx` -- mobile-friendly filter UX
- `src/components/QuickAddBar.tsx` -- conditional mobile hide
- `src/pages/InboxView.tsx` -- hide QuickAddBar on mobile
- `src/components/ViewHeader.tsx` -- sticky positioning
- `src/components/layout/MobileBottomNav.tsx` -- safe area + sizing
- `src/components/layout/AppLayout.tsx` -- safe area
- `src/components/ItemRow.tsx` -- swipe feedback
- `src/components/EmptyState.tsx` -- add CTA prop
- `src/index.css` -- safe area utilities, scrollbar-hide
- `src/App.css` -- remove dead code
- `src/components/layout/MobileMoreMenu.tsx` -- polish

