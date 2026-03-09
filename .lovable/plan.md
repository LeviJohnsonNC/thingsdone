

# Mobile Usability Improvements

After reviewing the codebase, here are the highest-impact mobile UX changes:

## 1. Context-Aware FAB (Quick Add respects current view)

**Problem**: The FAB always says "Quick Add to Inbox" regardless of which view you're on. If you're in Scheduled, tapping + should add a scheduled item.

**Change**: Pass the current view's state to `QuickAddFAB` via route detection or a prop from `AppLayout`. Update the dialog title and default state accordingly.

**Files**: `src/components/QuickAddFAB.tsx`, `src/components/layout/AppLayout.tsx`

## 2. Item Editor as Bottom Drawer on Mobile

**Problem**: The inline `ItemEditor` expands within the list, pushing content down and making it hard to interact with on small screens. On mobile, a bottom drawer (like Things 3) would be far more ergonomic — thumb-reachable, full-width, dismissible with a swipe down.

**Change**: Wrap `ItemEditor` in a `Drawer` (vaul) on mobile, keeping the inline expand on desktop. The drawer opens from the bottom with the item's properties.

**Files**: `src/components/ItemRow.tsx` (conditionally render drawer vs inline), new `src/components/ItemEditorDrawer.tsx` wrapper

## 3. Pull-to-Refresh on List Views

**Problem**: No way to manually refresh data on mobile without navigating away and back.

**Change**: Add a simple pull-to-refresh gesture at the top of list views that triggers React Query's `refetch()`. Use framer-motion drag on the scroll container.

**Files**: New `src/components/PullToRefresh.tsx`, integrate into `InboxView`, `NextView`, `FocusView`, etc.

## 4. Swipe Hint on First Use

**Problem**: Users don't know they can swipe right to complete or left to star. There's no discoverability.

**Change**: On first app use (check onboarding state), show a subtle animated hint on the first item — a brief auto-swipe animation that demonstrates the gesture, then settles back.

**Files**: `src/components/ItemRow.tsx` (add hint animation), `src/hooks/useOnboarding.ts` (track if hint shown)

## 5. Haptic Feedback on Swipe Thresholds

**Problem**: No tactile feedback when crossing the swipe threshold on mobile.

**Change**: Add `navigator.vibrate(10)` when the drag offset crosses the 80px threshold in `ItemRow`. Tiny but meaningful for perceived quality.

**Files**: `src/components/ItemRow.tsx`

## 6. Bottom Nav Badge for Overdue Items

**Problem**: The bottom nav only shows an inbox count badge. Overdue items in Next/Focus get no visual urgency signal.

**Change**: Add a small red dot indicator on the "Next" tab when there are overdue items (items with `due_date < today`).

**Files**: `src/components/layout/MobileBottomNav.tsx`

---

## Implementation Priority

1. **Context-Aware FAB** — quick win, big usability gap
2. **Item Editor as Bottom Drawer** — biggest UX lift, most code
3. **Haptic Feedback** — 2 lines of code, instant quality feel
4. **Overdue Badge on Nav** — small but important signal
5. **Swipe Hint** — discoverability for new users
6. **Pull-to-Refresh** — nice to have, moderate effort

