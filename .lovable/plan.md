

## Add Review History Page

Reviews are already persisted to the database with summary, reflection, and stats. The `useReviewHistory` hook exists but has no UI. We need a page to browse past reviews.

### New file: `src/pages/ReviewHistoryView.tsx`
- List of completed reviews, ordered by `completed_at` descending
- Each review card shows: date completed, stats (items processed/completed/created/moved), and a truncated summary
- Clicking a card expands it to show full summary text and reflection text
- Empty state if no past reviews
- Back link to `/review`

### Modified files
- **`src/App.tsx`** — add `/review/history` route inside `ProtectedRoutes`
- **`src/pages/ReviewView.tsx`** — add a "View Past Reviews" link on the review page (near the top or on the summary step)
- **`src/components/layout/DesktopSidebar.tsx`** — optionally add a subtle link or make the sidebar "Weekly Review" entry have a submenu

### Implementation details
- Use the existing `useReviewHistory()` hook from `useReview.ts`
- Use Accordion or Collapsible from shadcn for expand/collapse of individual reviews
- Display stats from the `stats` JSONB column
- Format dates with `date-fns`
- Mobile-friendly card layout

