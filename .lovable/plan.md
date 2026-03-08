

## Critique of Your Plan

**What's strong:**
- The tier limits are well-reasoned and conversion-oriented — 30 items / 3 projects / 3 areas hits the right psychological boundary
- Grace period on downgrade is exactly right — never destroy data
- Server-side enforcement alongside client-side UI is correct
- The `usage_tracking` table for future AI features is smart forward planning
- Stripe Customer Portal for self-service management avoids building cancellation UI

**Issues to address:**

1. **`subscriptions.user_id` references `auth.users(id)`** — Per project rules, never FK to `auth.users`. Use a plain `uuid not null` column instead, with RLS scoping by `auth.uid()`.

2. **`usage_tracking.user_id`** — Same issue: remove the FK to `auth.users`.

3. **CHECK constraints on `status` and `feature`** — Your spec uses `CHECK (status IN (...))`. Per project guidelines, CHECK constraints cause restoration failures. Use validation triggers instead.

4. **`check-usage` as a separate edge function** — This is overkill for now. Since it's only called internally by other edge functions, make it a utility function within those edge functions or a shared helper. No need for a separate deployed function.

5. **Lovable has a built-in Stripe integration** — We should use `stripe--enable` which handles product/price creation and secret management automatically, rather than manually wiring Stripe secrets.

6. **The `subscriptions` table should allow service-role writes but block authenticated user writes** — Your spec notes this, but the SQL only has a SELECT policy. This is correct — edge functions using service role bypass RLS. Just making sure this is intentional (it is).

7. **Over-limit banner location** — Your spec mentions a "persistent but dismissible banner at the top" for downgraded users. The app uses `AppLayout` with a flex column — the banner should go above the `<Outlet>` there.

8. **Don't defer the `usage_tracking` table** — Since AI features aren't shipping yet, consider skipping the `usage_tracking` table entirely to keep the migration simpler. Add it when AI features ship. The `increment_usage` function can wait too.

---

## Implementation Plan

### Phase 1: Stripe & Database Setup

1. **Enable Stripe** via the Lovable Stripe integration tool — this creates the product, price, and stores secrets automatically.

2. **Database migration** — Create the `subscriptions` table (no FK to auth.users):
   - Plain `user_id uuid not null` with unique constraint
   - `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id` (all text)
   - `status text not null default 'free'` — validated via trigger, not CHECK
   - `current_period_start`, `current_period_end` (timestamptz)
   - `cancel_at_period_end boolean default false`
   - RLS: SELECT only for `auth.uid() = user_id` (service role handles writes)
   - Indexes on `user_id` (unique) and `stripe_customer_id`
   - Skip `usage_tracking` for now — add when AI features ship

### Phase 2: Edge Functions (3 functions)

1. **`create-checkout-session`** — Auth via JWT. Looks up or creates Stripe customer, creates checkout session with the Pro price, returns URL.

2. **`create-portal-session`** — Auth via JWT. Looks up `stripe_customer_id`, creates billing portal session, returns URL.

3. **`stripe-webhook`** — No JWT, verifies Stripe signature. Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`, `invoice.payment_succeeded`. Updates `subscriptions` table via service role.

### Phase 3: Frontend Hooks

1. **`src/hooks/useSubscription.ts`** — Queries `subscriptions` table. Returns `{ status, isPro, cancelAtPeriodEnd, currentPeriodEnd }`. If no row, returns `{ status: 'free', isPro: false }`. Adds `visibilitychange` listener to refetch when user returns from Stripe.

2. **`src/hooks/useUsageLimits.ts`** — Computes live counts of active items, active projects, and areas. Compares against limits (30/3/3 for free, Infinity for pro). Returns `{ canCreateItem, canCreateProject, canCreateArea, activeItemCount, ... }`.

### Phase 4: Upgrade Prompt & Settings UI

1. **`src/components/UpgradePrompt.tsx`** — Dialog component. Shows contextual message based on which limit was hit. Lists Pro features. "Upgrade to Pro" button calls `create-checkout-session` and opens URL in new tab.

2. **Settings page subscription section** — Add between "Account" and "Areas of Focus":
   - Free: shows usage bars + upgrade button
   - Active: shows renewal date + "Manage Subscription" button (portal)
   - Canceling: shows end date + resubscribe option
   - Past due: shows warning + "Update Payment" button

### Phase 5: Limit Enforcement

1. **`useCreateItem`** — Before insert, count active items. If at limit and not Pro, throw/return and trigger `UpgradePrompt`.

2. **`useCreateProject`** / project creation in `ProjectsView` — Same pattern for active projects.

3. **`useCreateArea`** / area creation in `SettingsView` — Same pattern for areas.

4. **Over-limit banner** — In `AppLayout`, if user is free and over any limit, show a dismissible banner above the main content.

### Phase 6: Downgrade Handling

- Items/projects/areas beyond limits remain visible and editable
- Creation is blocked until user is under limits or upgrades
- Banner in `AppLayout` when over limits

### Implementation Order

```text
1. Enable Stripe integration (tool)
2. Create subscriptions table (migration)
3. Build stripe-webhook edge function
4. Build create-checkout-session edge function
5. Build create-portal-session edge function
6. Build useSubscription + useUsageLimits hooks
7. Build UpgradePrompt component
8. Add subscription section to Settings
9. Add limit checks to create hooks (items, projects, areas)
10. Add over-limit banner to AppLayout
```

