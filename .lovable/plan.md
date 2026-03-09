

# GTD App Critique and Gap Analysis

## What You Have (Strong Foundation)

| GTD Principle | Implementation | Rating |
|---|---|---|
| **Capture** | Quick-add bar, FAB, inbox view | 9/10 |
| **Clarify** | ClarifySheet + inline ItemEditor with state selection | 8/10 |
| **Organize** | Projects, Areas, Tags, Contexts, Energy, Time Est. | 9/10 |
| **Next Actions** | Sequential project filtering, Focus/Next/Scheduled/Waiting/Someday | 9/10 |
| **Weekly Review** | AI-assisted 7-step review with history | 9/10 |
| **Calendar Integration** | Google Calendar sync | 8/10 |
| **Logbook** | Completed items grouped by date with search | 7/10 |
| **Filtering** | Time estimate, energy, tags | 8/10 |

## What's Missing for 10/10

### 1. Reference Material / Filing System (Critical GTD Gap)
GTD explicitly says: "If it's not actionable, it's either trash, someday/maybe, or **reference**." There's no way to store reference material — notes, documents, links that aren't tasks but need to be retrievable. Currently items are either actionable or trash/completed.

**Solution**: Add a "Reference" state or a separate reference notes system. Could be as simple as allowing items to be filed as `reference` state with a dedicated view, or a lightweight notes/files section.

### 2. Checklists / Sub-tasks Within Items
GTD projects have next actions, but individual actions sometimes have checklists (e.g., "Pack for trip" has a list of items). No way to add sub-steps to an item.

**Solution**: Add a simple checklist field to items — an array of `{text, checked}` stored as JSON in a `checklist` column.

### 3. "Is it actionable?" Clarify Decision Tree
The clarify flow lets you change state, but doesn't guide the GTD decision tree: "Is it actionable? → Yes: Is it a project or single action? → Single action: Do it (2-min), delegate (waiting), or defer (next/scheduled)." The onboarding touches this but the daily clarify flow doesn't.

**Solution**: Add an optional guided clarify mode that walks through the GTD decision tree question-by-question when processing inbox items.

### 4. Recurring Items / Habits
GTD practitioners have recurring tasks (weekly reports, monthly reviews, daily habits). No recurrence support exists.

**Solution**: Add `recurrence_rule` (e.g., "weekly", "monthly", "daily") to items. When completed, auto-create the next occurrence.

### 5. Natural Language Input / Smart Parsing
"Call mom tomorrow at 3pm" should auto-parse into title "Call mom", scheduled_date = tomorrow, time = 3pm. Currently requires manual field entry.

**Solution**: Parse common patterns from quick-add input (dates, tags with `@`, projects with `#`).

### 6. "Tickler File" / Deferred Review Dates
GTD's tickler system lets you defer something until a specific date when it should reappear. `scheduled_date` exists but there's no "hide until" concept — scheduled items are always visible in the Scheduled view.

**Solution**: Already partially implemented via `scheduled_date` + activation. This is mostly covered.

### 7. Project Outcome / Purpose Field
GTD emphasizes defining the desired outcome for every project. Projects only have `title` and `notes`. A dedicated "desired outcome" field would reinforce GTD thinking.

**Solution**: Add `desired_outcome` text field to projects, displayed prominently on the project detail page.

### 8. Contexts as First-Class GTD Concept
In GTD, contexts (`@phone`, `@computer`, `@errands`, `@office`) are a primary organizing principle — you choose what to do based on context. Tags serve this role but they're not emphasized or pre-seeded.

**Solution**: Pre-seed common GTD contexts during onboarding. Add a context-grouped view option in the Next view.

### 9. Two-Minute Rule Nudge
When clarifying an item, if time_estimate is set to 5 min, the app should nudge: "This is quick — do it now instead of filing it."

**Solution**: Show an inline prompt in the clarify/editor flow when time_estimate <= 5.

### 10. Project Support Material
GTD projects often have support material (files, links, reference docs). The `notes` field is insufficient for this.

**Solution**: Allow file attachments or link collections on projects (using backend storage).

---

## Recommended Priority (Highest Impact First)

### Phase 1: Core GTD Completeness
1. **Checklists on items** — Simple sub-task checklist JSON field + UI
2. **Project desired outcome** — Add `desired_outcome` column + UI on project detail
3. **Reference material state** — Add `reference` as an ItemState with its own view
4. **Recurring items** — Add `recurrence_rule` column + auto-recreation on complete

### Phase 2: Smart Workflow
5. **Two-minute rule nudge** — Inline prompt in ItemEditor when time_estimate = 5
6. **Natural language quick-add parsing** — Parse dates, contexts, projects from input
7. **Context-grouped Next view** — Group Next items by tag/context

### Phase 3: Polish
8. **Pre-seed GTD contexts in onboarding** — @phone, @computer, @errands, @home, @office
9. **Guided clarify decision tree** — Optional step-by-step clarify mode
10. **Project support material** — File attachments via backend storage

---

## Technical Summary

| Change | DB Migration | New Components | Existing Edits |
|---|---|---|---|
| Checklists | Add `checklist JSONB` to items | ChecklistEditor | ItemEditor, ClarifySheet |
| Project outcome | Add `desired_outcome TEXT` to projects | — | ProjectDetailView |
| Reference state | No migration needed (state is text) | ReferenceView | types.ts, sidebar, nav |
| Recurring items | Add `recurrence_rule TEXT` to items | RecurrenceSelector | useCompleteItem, ItemEditor |
| 2-min nudge | None | TwoMinuteNudge | ItemEditor |
| NLP quick-add | None | — | QuickAddBar, QuickAddFAB |
| Context grouping | None | — | NextView |
| Seed contexts | None | — | OnboardingModal |

