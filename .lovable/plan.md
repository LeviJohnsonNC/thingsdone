

## Critique of Your Proposed Plan

Your plan is solid in principle. A few refinements:

**What's good:**
- Three-tier color system (overdue / due today / normal) is the right approach
- Pill/badge treatment over plain text color is more scannable — agreed
- Keeping weight/size consistent and letting color do the work — correct instinct
- Accessibility note about not relying on color alone — important

**What I'd adjust:**

1. **Skip the "Upcoming" state.** You proposed a muted gray for normal dates, but that's already what exists (`text-muted-foreground`). No change needed there — only overdue and due-today need visual treatment.

2. **The pill/badge approach adds visual noise for every single dated item.** A better middle ground: use a pill only for overdue and due-today items (the ones that need attention), and keep normal dates as plain text. This way the pills themselves become the signal.

3. **"Today" label is more useful than the date.** If something is due today, showing "Today" instead of "Mar 11" is immediately clearer. Similarly, "Overdue" or just the date in red with a small alert icon.

4. **The title turning red for overdue is heavy-handed.** Currently `ItemRow` colors the entire title red when overdue (line 203). The date badge alone should carry the urgency — the title should stay neutral so the row doesn't feel like an error.

5. **Icon choice:** A small `Clock` icon for due-today and `AlertTriangle` for overdue is more semantic than a generic warning for both.

---

## Implementation Plan

### 1. Add CSS variables for "due-today" color
In `src/index.css`, add a `--due-today` amber variable in both light and dark themes:
- Light: `36 92% 50%` (approx `#D97706`)
- Dark: `36 90% 55%` (slightly brighter for dark backgrounds)

In `tailwind.config.ts`, register `due-today: hsl(var(--due-today))`.

### 2. Update `ItemRow.tsx` date display
Replace the current plain `<span>` date with a date badge component inline:

- **Overdue:** Red pill (`bg-overdue-red/10 text-overdue-red`) with `AlertTriangle` icon (h-3 w-3) and the date text
- **Due today:** Amber pill (`bg-due-today/10 text-due-today`) with `Clock` icon (h-3 w-3) and text "Today"
- **Normal date:** Keep as-is — plain `text-muted-foreground`, no pill

Also **remove** the red title coloring on line 203 (`isOverdue && "text-overdue-red"`) so the title stays neutral and the badge carries the urgency.

### 3. Files changed
- `src/index.css` — add `--due-today` variable (2 lines)
- `tailwind.config.ts` — register `due-today` color (1 line)
- `src/components/ItemRow.tsx` — update date rendering logic and remove red title

No new components or dependencies needed. The `AlertTriangle` and `Clock` icons are already available from `lucide-react`.

