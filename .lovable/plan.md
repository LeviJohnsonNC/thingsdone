

## Critique of the Build Spec

The spec has strong design instincts but several points conflict with the existing app or are impractical:

**Good ideas to adopt:**
- GTD state as prominent pill selector (not buried in a dropdown) -- this is the single best insight
- Completion circle as the "done" affordance instead of a separate Complete button
- Segmented controls for Time Estimate (small option set, no need for dropdown)
- Properties grid with labeled rows below a divider
- Footer with Save/Cancel left, Delete right (safer layout)
- Context tags inline near the title
- Removing the duplicate title (ItemRow shows it, then ItemEditor repeats it)

**Things to skip or modify:**
- **"Single page, no sidebar"**: The editor is inline below item rows. Changing to a standalone page breaks the app's flow. Keep it inline but adopt the single-column layout internally.
- **Energy field**: No `energy` column exists in the database. Adding it requires a migration. Worth doing but should be called out.
- **Waiting On field**: No `waiting_on` column exists. Same -- needs migration.
- **"Reference" state**: Doesn't exist in the current `ItemState` type or DB. GTD purists use it but the app currently has `inbox | next | scheduled | someday | waiting | completed | trash`. Skip adding Reference for now.
- **DM Sans font**: The app uses Inter per the design system. Changing fonts is a separate concern.
- **Off-white page background**: Already using `#FAFBFC` per design system.
- **Segmented control for Energy**: Good idea, but needs DB column first.

---

## Plan: Redesign ItemEditor Component

### Database Migration
Add two columns to `items` table:
- `energy` (text, nullable) -- values: `low`, `medium`, `high`
- `waiting_on` (text, nullable) -- free text, who you're waiting on

### Update `src/lib/types.ts`
- Add `EnergyLevel` type and `ENERGY_OPTIONS` constant

### Rewrite `src/components/ItemEditor.tsx`
Single-column layout (no more two-column split). Structure top to bottom:

1. **GTD State Pill Selector** -- horizontal row of pill toggles above the card body. States: Inbox, Next, Waiting For, Someday. Each pill has a distinct accent color. Active pill gets tinted bg + colored border.

2. **Main Card** with:
   - **Title row**: Completion circle (left, accent-colored border, hover fill) + title input (borderless, text-xl) + star toggle (right)
   - **Notes**: Borderless auto-expanding textarea, indented past the circle
   - **Context Tags**: Inline chips with `x` to remove + `+` button popover to add tags
   - **Divider**
   - **Properties Grid** (labeled rows):
     - Time Est: segmented control (`— | 5m | 15m | 30m | 1h | 2h | 4h`)
     - Energy: segmented control (`— | Low | Med | High`) with colored dots
     - Due: date picker button
     - Scheduled: date picker button
     - Project: select dropdown
     - Area: select dropdown
     - Google Calendar toggle (conditional, only when date set + connected)
     - Waiting On: text input (conditional, only when state = "waiting")
   - **Footer**: `bg-slate-50` bar. Left: dark Save + outline Cancel. Right: muted Delete button (red on hover, de-emphasized by default)

3. **Remove duplicate title**: The ItemRow already shows the title. When the editor is open, no need to show it twice. The editor's title input IS the editable title.

### Update `src/components/ItemRow.tsx`
- No changes needed structurally -- it already renders `<ItemEditor>` inline via AnimatePresence

### Files to change
- **Migration**: Add `energy` and `waiting_on` columns to `items`
- **Edit** `src/lib/types.ts` -- add energy type + options
- **Rewrite** `src/components/ItemEditor.tsx` -- new single-column layout with all the above
- **No other files need changes** -- ItemRow, hooks, views all stay the same

