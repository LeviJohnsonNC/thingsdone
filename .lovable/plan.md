

## Waiting View & Contacts Feature

### What exists today
- Items table has `waiting_on` (text) and `state` supports `"waiting"`
- ItemEditor shows a free-text "Waiting On" input when state is "waiting"
- No dedicated Waiting view/page
- No contacts table — `waiting_on` is just free text
- Desktop sidebar and mobile More menu don't have a Waiting nav entry

### What we'll build

**1. Database: `contacts` table**

New table `contacts` with columns: `id` (uuid), `user_id` (uuid), `name` (text), `created_at`, `sort_order` (int). RLS: users can CRUD own contacts.

**2. Hook: `useContacts`**

`src/hooks/useContacts.ts` — `useContacts()` for fetching, `useCreateContact()` and `useDeleteContact()` for mutations. Invalidates `["contacts"]` query key.

**3. Waiting View page**

`src/pages/WaitingView.tsx` — Lists all items with `state = "waiting"`, grouped by the `waiting_on` value (contact name). Uses `useItems("waiting")` which already works. Each group shows the contact name as a header. Items without a `waiting_on` value go into an "Unassigned" group.

**4. Navigation updates**

- **Desktop sidebar** (`DesktopSidebar.tsx`): Add "Waiting" entry in the Action group, between Scheduled and Someday, using the hourglass/clock icon from Lucide (`Clock` or `Hourglass`).
- **Mobile More menu** (`MobileMoreMenu.tsx`): Add "Waiting" entry between Scheduled and Someday.
- **Routing** (`App.tsx`): Add `/waiting` route pointing to `WaitingView`.

**5. ItemEditor: Replace free-text with contacts dropdown**

In `ItemEditor.tsx`, replace the current free-text `waiting_on` input (lines 481-501) with a `Select` dropdown populated from `useContacts()`. The dropdown appears when state is "waiting". The value saved to `waiting_on` remains a text string (the contact's name), keeping the schema simple — no foreign key needed.

Add the dropdown in the Project + Area row as a third column: **Project | Area | Waiting On** (only visible when state is "waiting").

**6. Settings: Contacts section**

In `SettingsView.tsx`, add a "Contacts" section below "Context Tags" with the same pattern: list existing contacts with delete buttons, plus an input + add button for new ones.

### Files changed
- `src/App.tsx` — add `/waiting` route
- `src/components/layout/DesktopSidebar.tsx` — add Waiting nav item
- `src/components/layout/MobileMoreMenu.tsx` — add Waiting nav item
- `src/components/ItemEditor.tsx` — replace free-text with contacts Select
- `src/pages/SettingsView.tsx` — add Contacts section

### Files created
- `src/pages/WaitingView.tsx`
- `src/hooks/useContacts.ts`

### Migration
```sql
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own contacts"
  ON public.contacts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

