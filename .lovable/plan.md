

## Add Help Center Page

A new `/help` route with a grid-based help center, accessible from the sidebar (above Settings) and the mobile More menu. Content is entirely static -- no database needed.

### Content Structure

**Section 1: GTD Methodology** (6 topics)

1. **What is GTD?** -- Core philosophy: your mind is for having ideas, not holding them. The 5 steps (Capture, Clarify, Organize, Reflect, Engage). Mental overhead vs. trusted system.

2. **Capture Everything** -- Why 100% capture matters. The inbox as a safety net. Capture tools and triggers. The goal: nothing lives only in your head.

3. **Clarify: The Two-Minute Rule** -- Processing inbox items one at a time. "Is it actionable?" decision tree. If < 2 minutes, do it now. If not actionable: trash, reference, or someday. If actionable: delegate or defer.

4. **Next Actions** -- Why vague tasks paralyze. Every project needs a concrete physical next action. "Call Mike about the proposal" vs. "Handle proposal." Actions should start with a verb.

5. **Projects & Outcomes** -- A project = any outcome requiring 2+ actions. Define the desired outcome clearly. The project list is just a tracking list; actions live elsewhere. Sequential vs. parallel thinking.

6. **The Weekly Review** -- The keystone habit. Steps: clear inboxes, review action lists, review project list, review someday/maybe, review calendar. Why it matters: trust in the system decays without it.

**Section 2: Using Things Done.** (6 topics)

1. **Quick Capture** -- How to use the FAB / quick-add bar. Type and hit enter. Everything lands in Inbox first.

2. **Clarifying Items** -- Opening the clarify sheet. Setting state (next, waiting, someday, scheduled). Adding notes, energy, time estimates, due dates, context tags.

3. **Focus & Next Views** -- Focus = starred items for today. Next = all actionable items across projects. How sequential projects surface only the first action.

4. **Projects & Areas** -- Creating projects, reordering items within them. Areas of Focus as a global filter. Assigning items to projects.

5. **Scheduled, Waiting & Someday** -- Scheduled items auto-activate. Waiting tracks delegated work with contacts. Someday is the parking lot for ideas.

6. **Weekly Review in the App** -- Walking through the guided review wizard. Brain dump, inbox zero, state review, project review, summary. Review history.

### Files to create

**`src/pages/HelpView.tsx`**
- Two sections with headers, each containing a grid of clickable cards
- Cards use Lucide icons, title, and short description
- Clicking a card opens a detail view (either inline expand or a sub-route `/help/:topic`)
- I'll use inline expand with a dialog or sheet to keep it simple -- one page, no sub-routes
- Each topic's content is a static React component with formatted text, bullet lists, and tips
- Back button to previous page

**`src/lib/helpContent.ts`**
- All help content as a typed array of objects: `{ id, section, icon, title, description, content: string }` where content is JSX-compatible markdown-like text
- Keeps content separate from presentation

### Files to modify

- **`src/App.tsx`** -- Add `/help` route
- **`src/components/layout/DesktopSidebar.tsx`** -- Add `HelpCircle` icon button above Settings
- **`src/components/layout/MobileMoreMenu.tsx`** -- Add Help item above Settings

### Design
- Page header: "Help Center" with back arrow
- Section headers: "Getting Things Done" and "Using Things Done."
- Card grid: 2 columns on mobile, 3 on desktop
- Cards: bordered, light hover state, icon + title + one-line description
- Detail: Dialog with the topic title and scrollable body content
- Icon: `HelpCircle` from Lucide

