
## GTD Flow — Phase 1 MVP Implementation Plan

### 1. Backend Setup (Lovable Cloud)
- Enable Lovable Cloud with Supabase
- Set up email/password authentication
- Create all Phase 1 database tables: `areas`, `tags`, `projects`, `items`, `item_tags` with the schema from the spec
- Enable RLS on all tables with user-scoped policies
- Add performance indexes and `updated_at` triggers

### 2. Auth Flow
- Login and signup pages with email/password
- Protected routes — redirect to login if unauthenticated
- Clean, minimal auth UI matching the calm blue color palette

### 3. Responsive Layout Shell
- **Mobile (<768px):** Bottom tab bar with Inbox, Focus, Next, Projects, More
- **Desktop (≥768px):** Left sidebar with all navigation items grouped (Collect, Action, Organize, Archive)
- Global **Area of Focus** filter dropdown at top of sidebar/nav
- Custom color palette: light gray background (#FAFBFC), calm blue accent (#4A90D9), gold stars (#F5A623)
- Inter font, generous whitespace, Nirvana-inspired clean aesthetic

### 4. Inbox View + Quick Add
- Pinned quick-add bar at top: text input + submit, creates items with state='inbox'
- Floating "+" button (bottom-right on mobile) for global quick capture
- Item count badge on Inbox nav tab
- Tapping an item opens the Clarify Sheet
- Friendly empty state: "Your mind is clear. Nothing to process."

### 5. Clarify Sheet (Item Detail/Edit)
- Bottom sheet on mobile, side panel on desktop
- Editable title, state selector chips (Next/Scheduled/Someday/Trash)
- Star/Focus toggle, project assignment dropdown, area dropdown
- Tag multi-select, scheduled date picker, due date picker
- Time estimate selector (5min, 15min, 30min, 1hr, 2hr, 4hr+)
- Notes textarea, complete button, delete/trash action

### 6. Focus View
- Shows all starred/focused items and projects
- Sort: overdue first → manually starred → by scheduled date
- Gold star visual treatment, empty state message

### 7. Next View
- All items with state='next' (respecting sequential project logic — only first action shown)
- Filter bar: tags, time estimate ("I have X minutes")
- Area filter inherited from global filter

### 8. Scheduled View
- Items with future scheduled dates
- Grouped by: Today, This Week, This Month, Later
- Date-based sorting within groups

### 9. Someday View
- Flat list of someday items and projects
- Sortable by date added or alphabetical

### 10. Projects
- **List view:** Project name, area tag, progress indicator (e.g. "3/7"), next action preview
- **Detail view:** Header with title, type toggle (Sequential ↔ Parallel), star, area, due date
- Progress bar, ordered action list, "Add action" button
- Sequential projects: gray out future actions, only first incomplete shows in Next view
- Projects support states: Active, Someday, Scheduled

### 11. Logbook
- Completed actions and projects grouped by completion date (Today, Yesterday, This Week, Older)
- Searchable, tap to view details, option to reactivate (back to Inbox)

### 12. Swipe Gestures & Animations
- Swipe right: mark complete (green checkmark animation, 500ms fade with undo)
- Swipe left: toggle star/focus (gold star pulse)
- Long press: context menu (Move to…, Edit, Delete)
- Smooth sheet open/close and list transition animations

### 13. Areas & Tags Management
- Create, edit, delete areas of focus
- Create, edit, delete context tags with optional colors
- Accessible from Settings or inline during item editing
