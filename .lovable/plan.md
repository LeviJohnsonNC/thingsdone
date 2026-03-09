

# AI Usage Limits: Pricing & Enforcement Plan

## Current State
- **No AI limits exist.** Any authenticated user can call the `review-ai` edge function unlimited times.
- The `UpgradePrompt` has an `ai_review` trigger type but it's never wired up.
- No tracking of AI usage anywhere in the database.

## What We're Building

### Limits
| Feature | Free | Pro |
|---|---|---|
| Weekly Review wizard | Yes | Yes |
| AI suggestions per review step | 3 reviews/month | Unlimited |
| Brain dump → AI task generation | No | Yes |
| AI review summary (step 7) | Counts toward 3/month | Unlimited |

**Definition of "AI review"**: Each time a user clicks any "Get AI Suggestions" or "Generate AI Summary" button, that counts as 1 AI call. Free users get 3 total per calendar month.

### Database
- Add `ai_reviews_used` (integer, default 0) and `ai_reviews_reset_at` (timestamptz) columns to `user_settings` table.
- Reset logic: if `ai_reviews_reset_at` is before the start of the current month, reset count to 0 and update the reset timestamp.

### Edge Function (`review-ai`)
- Before calling the AI gateway, check the user's subscription status and `ai_reviews_used` count.
- If free user and count >= 3, return a 403 with `{ error: "ai_limit_reached" }`.
- If free user and step 1 with `brain_dump` provided, return a 403 with `{ error: "pro_only_feature" }`.
- On success, increment `ai_reviews_used` in `user_settings`.

### Frontend Changes

**`useReviewAI.ts`**
- Handle 403 responses: show upgrade prompt for `ai_limit_reached`, show toast for `pro_only_feature`.

**`useUsageLimits.ts`**
- Add `aiReviewsUsed`, `aiReviewLimit` (3 for free, Infinity for pro), and `canUseAI` to the returned object.
- Fetch from `user_settings`.

**Review step components** (`ClearAndInboxStep`, `StateReviewStep`, `ProjectReviewStep`, `ReviewSummaryStep`)
- Pass `canUseAI` and `isPro` props down.
- Disable AI buttons when `!canUseAI`, show "X/3 used" counter on the button.
- Hide brain dump "Turn into tasks" button entirely for free users (or show it locked with upgrade prompt).

**Pricing & Marketing Copy Updates**

`PricingPage.tsx`:
- Free: change "Weekly Review wizard" → "Weekly Review wizard (manual)"
- Pro: change "AI-powered weekly reviews" → "Unlimited AI-powered reviews"
- Add: "AI brain dump capture" to Pro

`UpgradePrompt.tsx`:
- Wire up `ai_review` trigger with message: "You've used 3/3 free AI reviews this month."

`SubscriptionSection.tsx`:
- Add AI usage bar for free users: "AI Reviews: X/3 this month"

`FeaturesPage.tsx`:
- Update the AI assistant feature block to mention "3 free AI reviews/month, unlimited with Pro"

### Files to Edit
| File | Change |
|---|---|
| `user_settings` (migration) | Add `ai_reviews_used`, `ai_reviews_reset_at` |
| `supabase/functions/review-ai/index.ts` | Add limit check + increment logic |
| `src/hooks/useReviewAI.ts` | Handle 403 errors, show upgrade prompt |
| `src/hooks/useUsageLimits.ts` | Add AI usage tracking fields |
| `src/components/review/ClearAndInboxStep.tsx` | Gate brain dump behind Pro, show AI usage |
| `src/components/review/StateReviewStep.tsx` | Show AI usage counter, disable when exhausted |
| `src/components/review/ProjectReviewStep.tsx` | Same |
| `src/components/review/ReviewSummaryStep.tsx` | Same |
| `src/pages/ReviewView.tsx` | Pass `canUseAI`/`isPro` to step components |
| `src/pages/PricingPage.tsx` | Update feature lists |
| `src/components/UpgradePrompt.tsx` | Update message |
| `src/components/SubscriptionSection.tsx` | Add AI usage bar |
| `src/pages/FeaturesPage.tsx` | Update AI feature copy |

