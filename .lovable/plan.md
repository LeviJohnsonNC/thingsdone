

# App Improvement Critique: Highest-Impact Features

After reviewing the entire codebase, here are the most impactful improvements — ranked by "value to users × conversion potential":

---

## 🔴 Critical Gaps (High Impact)

### 1. Global Search / Quick Find (Cmd+K)
**Problem**: No way to quickly find items across all states, projects, or tags. Users with 50+ items have no discoverability.

**Impact**: Power users expect this. It's table stakes for any productivity app.

**Implementation**:
- Create `SearchModal.tsx` using `cmdk` (already installed)
- Index: items, projects, areas by title/notes
- Recent searches, fuzzy matching
- Keyboard shortcut: `Cmd+K` / `Ctrl+K`

**Files**: New `src/components/SearchModal.tsx`, update `AppLayout.tsx` to listen for shortcut

---

### 2. Undo on Destructive Actions
**Problem**: Swiping to complete shows a toast, but there's no "Undo" button. Same for trash. Accidents happen.

**Impact**: Critical UX safety net. Reduces anxiety about using swipe gestures.

**Implementation**:
- Add an "Undo" button to the toast when completing/trashing items
- Store the previous state for 5 seconds
- On undo, revert the item

**Files**: Update `ItemRow.tsx` swipe handlers, add undo logic to toast

---

### 3. Keyboard Shortcuts for Power Users
**Problem**: No keyboard shortcuts at all. Power users can't quickly add items, navigate views, or complete tasks.

**Impact**: High retention for productivity enthusiasts.

**Shortcuts**:
- `N` — New item (open quick add)
- `Cmd+1-5` — Navigate to Inbox/Next/Focus/etc.
- `E` — Edit selected item
- `C` — Complete selected item
- `Esc` — Close editor/modal

**Files**: New `src/hooks/useKeyboardShortcuts.ts`, integrate into `AppLayout.tsx`

---

## 🟡 High-Value Features

### 4. Natural Language Input for Quick Add
**Problem**: "Call mom tomorrow at 3pm" doesn't parse. Users have to manually set dates.

**Impact**: Huge quality-of-life improvement. Reduces friction to capture.

**Implementation**:
- Use `chrono-node` for natural language date parsing
- Parse on submit: extract date/time, apply to `scheduled_date` or `due_date`
- Show preview chip when date is detected

**Files**: Update `QuickAddBar.tsx` and `QuickAddFAB.tsx`

---

### 5. Batch Operations (Multi-Select)
**Problem**: Can't select multiple items to bulk-move, bulk-trash, or bulk-complete.

**Impact**: Inbox zero gets painful with 20+ items.

**Implementation**:
- Add checkbox on long-press (mobile) or Shift+Click (desktop)
- Floating action bar appears with: "Move to...", "Complete", "Trash"
- Clear selection on action

**Files**: Update `ItemRow.tsx`, new `BatchActionBar.tsx`, update list views

---

### 6. Productivity Stats Dashboard
**Problem**: No way to see trends — how many items completed this week vs last week, review streak, etc.

**Impact**: Gamification increases engagement. Shows ROI of the app.

**Implementation**:
- New `/stats` route or section in Settings
- Charts: items completed (7d/30d), review streak, state distribution
- Use `recharts` (already installed)

**Files**: New `src/pages/StatsView.tsx`, add to navigation

---

## 🟢 Polish & Delight

### 7. Empty State CTAs
**Problem**: Empty states say "nothing here" but don't guide action. E.g., empty Next should say "Process your inbox first."

**Impact**: Better onboarding, reduces confusion.

### 8. Drag Item to Project (Sidebar)
**Problem**: Can't drag an inbox item directly onto a project in the sidebar to assign it.

**Impact**: Faster organization workflow.

### 9. Quick Add Shows Recently Used Projects/Tags
**Problem**: When adding an item, there's no quick way to assign to the last-used project.

**Impact**: Reduces taps/clicks for repeat capture.

---

## Recommended Priority Order

| # | Feature | Effort | Impact | Revenue |
|---|---------|--------|--------|---------|
| 1 | **Global Search (Cmd+K)** | Medium | ⭐⭐⭐⭐⭐ | — |
| 2 | **Undo on Actions** | Low | ⭐⭐⭐⭐⭐ | — |
| 3 | **Keyboard Shortcuts** | Medium | ⭐⭐⭐⭐ | — |
| 4 | **Natural Language Input** | Medium | ⭐⭐⭐⭐ | Pro? |
| 5 | **Batch Operations** | High | ⭐⭐⭐⭐ | — |
| 6 | **Stats Dashboard** | Medium | ⭐⭐⭐ | Pro |

---

## My Recommendation: Implement #1, #2, and #3

These three features together would make the app feel **professional-grade**:
1. **Global Search** — expected by every productivity app user
2. **Undo** — critical safety net, easy win
3. **Keyboard Shortcuts** — power user magnet, differentiator

All three are achievable in one session and don't require database changes.

