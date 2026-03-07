

## Inline Item Editor (Replace Side Drawer)

Based on the screenshots, the edit/create UI should expand **inline** within the item list rather than opening a side sheet. The layout matches a Nirvana-style pattern: clicking an item (or creating a new one) expands an editing area directly below the item row, with the main fields on the left and metadata selectors on the right.

### Layout Design

```text
┌─────────────────────────────────────────────────────────┐
│ ★  [Title input]                        │ ⏱ time    ▾ │
│    [Tags input, comma separated]    [+] │ ⚡ energy  ▾ │
│    ┌─────────────────────────────┐      │ 🏁 due     ▾ │
│    │ Notes textarea              │      │               │
│    │                             │      │ 📥 Inbox    ▾ │
│    └─────────────────────────────┘      │ → Standalone▾ │
│    [Save Changes]  [Cancel]             │               │
└─────────────────────────────────────────────────────────┘
```

### Changes

**1. New component: `src/components/ItemEditor.tsx`**
- An inline editor component that replaces `ClarifySheet` visually
- Two-column layout: left side has title, tags, notes, save/cancel buttons; right side has time, energy, due date, state, project selectors
- Receives `itemId` (for editing) or `null` (for creating new)
- All the same logic currently in `ClarifySheet` (save fields, tags, calendar toggle, complete/delete) moves here
- Star toggle button on the left of the title
- Save Changes button commits pending changes (title, notes); Cancel closes the editor
- Renders as a bordered card that expands inline

**2. Update `ItemRow.tsx`**
- Instead of `onClick={() => setClarifyItemId(item.id)}`, toggle an `editingItemId` in the store
- When `editingItemId === item.id`, render `<ItemEditor itemId={item.id} />` directly below the row
- Keep swipe gestures unchanged

**3. Update `appStore.ts`**
- Rename `clarifyItemId` → `editingItemId` (or keep both for backward compat and alias)
- Add `isCreatingItem: boolean` state for new item creation mode

**4. Update `QuickAddBar.tsx`**
- After creating a new item, set `editingItemId` to the new item's ID so the inline editor opens immediately

**5. Remove `ClarifySheet.tsx`** usage
- Remove `<ClarifySheet />` from `AppLayout.tsx`
- Delete or repurpose the file (logic moves to `ItemEditor`)

**6. Update all views** (InboxView, NextView, FocusView, etc.)
- No changes needed if `ItemRow` handles rendering the editor internally

### Key Details
- The editor is a single card with `border rounded-lg` styling, matching the calm minimal aesthetic
- Right-side selectors use compact dropdown triggers (icon + label + chevron)
- Mobile: stack the two columns vertically (right-side metadata moves below)
- Cancel closes editor without saving pending title/notes changes
- Clicking another item closes the current editor and opens the new one

