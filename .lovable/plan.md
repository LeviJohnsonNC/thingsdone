

# Remaining High-Impact Features to Implement

From the original plan, items 1-3 (Search, Undo, Shortcuts) are done. Here's what's left plus new ideas worth building:

---

## Batch 1: Quick Wins

### A. Better Empty State CTAs (Plan item #7)
Each view's empty state should guide the user to the right action instead of being passive.

- **Inbox empty**: "All clear! Your inbox is empty." + "Capture something" button
- **Next empty**: "Process your inbox to surface next actions" + "Go to Inbox" button  
- **Focus empty**: "Swipe right on any item to star it for focus" (instructional)
- **Someday empty**: Keep current (fine as-is)
- **Waiting empty**: "Assign a 'waiting on' contact to track delegated items"

Files: Update empty states in `InboxView`, `NextView`, `FocusView`, `WaitingView`, `ScheduledView`

### B. Productivity Stats Dashboard (Plan item #6)
New `/stats` route showing:
- Items completed per day (last 14 days) — bar chart
- Current state distribution — pie/donut chart  
- Review streak (consecutive weeks with a review)
- "Capture rate" — items added vs completed

Uses `recharts` (already installed). Query completed items with `completed_at` timestamps.

Files: New `src/pages/StatsView.tsx`, add route to `App.tsx`, add nav link to sidebar/more menu

### C. Natural Language Date Parsing (Plan item #4)
Parse dates from quick-add input: "Call mom tomorrow", "Report due Friday", "Dentist next Tuesday at 2pm"

- Install `chrono-node` for parsing
- On submit, extract date references → set `scheduled_date` or `due_date`
- Show a small preview chip below input when a date is detected
- Apply to `QuickAddBar`, `GlobalQuickAdd`, and `QuickAddFAB`

Files: Update `QuickAddBar.tsx`, `GlobalQuickAdd.tsx`, `QuickAddFAB.tsx`

---

## Batch 2: Power Features

### D. Batch Operations / Multi-Select (Plan item #5)
- Desktop: Shift+Click to select multiple items; checkbox appears on selection
- Mobile: Long-press to enter selection mode
- Floating action bar with "Complete", "Move to…", "Trash" buttons
- Clear selection after action

Files: New `src/components/BatchActionBar.tsx`, update `ItemRow.tsx`, update list views

---

## Recommended Order

| # | Feature | Effort | Impact |
|---|---------|--------|--------|
| A | Empty State CTAs | Low | Medium |
| B | Stats Dashboard | Medium | High |
| C | Natural Language Dates | Medium | High |
| D | Batch Operations | High | High |

I'd suggest implementing **all four** since credits are free — starting with A (quick), then B and C in parallel, then D.

