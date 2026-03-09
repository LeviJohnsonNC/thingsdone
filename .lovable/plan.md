

# Next Revenue-Driving Update: In-App Upgrade Moments (Soft Paywalls)

## The Problem

Right now, the only upgrade triggers are:
1. Hitting a hard limit (items/projects/areas) — shows a banner
2. Running out of AI reviews — shows upgrade prompt
3. Going to Settings manually

These are all **reactive**. The user has to hit a wall. There's no proactive demonstration of Pro value while they're happily using the app.

## The Highest-Impact Change: **Pro Feature Teasing at Point of Use**

Instead of hiding Pro features entirely, **show them but lock them** — so free users constantly see what they're missing in context, right when they'd want it.

### What to Build

**1. Recurring Tasks — Locked for Free Users**
The `RecurrenceSelector` already exists in the `ItemEditor`. Currently it renders for everyone. Instead:
- Free users see the recurrence option but it shows a lock icon and "Pro" badge
- Tapping it opens the `UpgradePrompt` instead of the selector
- This is the highest-value teaser because recurring tasks are a daily-use feature

**2. "Pro" Badges on Gated Features in the Item Editor**
Add small `Pro` badges next to:
- Recurrence selector (lock it for free users)
- Brain dump in weekly review (already done)
This creates a constant, non-annoying reminder that Pro exists.

**3. Approaching-Limit Nudges (not just over-limit)**
Currently `OverLimitBanner` only shows when you're *over* the limit. Add a gentle nudge when you're at **80%+ capacity** (e.g., 25/30 items):
- A subtle, non-dismissable counter in the sidebar/nav: "25/30 items"
- When you hit 27+, a soft yellow banner: "You're almost at your free limit. Upgrade for unlimited."

This creates urgency *before* the hard wall.

**4. Post-Weekly-Review Upgrade CTA**
After finishing a weekly review, the summary step is a high-engagement moment. For free users, add a contextual CTA:
- "You completed your review! Unlock unlimited AI suggestions and brain dump with Pro — $4/mo"
- This catches users at peak satisfaction with the product.

### Files to Edit

| File | Change |
|---|---|
| `src/components/ItemEditor.tsx` | Lock recurrence selector for free users, show Pro badge |
| `src/components/OverLimitBanner.tsx` | Add approaching-limit variant (80%+ threshold) |
| `src/components/layout/DesktopSidebar.tsx` | Add usage counter near bottom of sidebar |
| `src/components/layout/MobileBottomNav.tsx` | Optional: subtle usage indicator |
| `src/components/review/ReviewSummaryStep.tsx` | Add post-review upgrade CTA for free users |
| `src/components/UpgradePrompt.tsx` | Add new trigger type `"recurring"` with appropriate message |
| `src/hooks/useUsageLimits.ts` | Add `isApproachingLimit` boolean (≥80% of any limit) |

### Why This Wins

- **Zero friction for Pro users** — nothing changes for them
- **Free users see value constantly** — every time they edit an item, they see "Pro" on recurrence
- **Urgency builds naturally** — approaching-limit nudges create FOMO without being aggressive
- **Catches high-intent moments** — post-review CTA targets users who are already engaged

