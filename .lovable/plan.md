

## Current State: No Onboarding

After signup, users land directly in an empty Inbox view with:
- No explanation of what GTD is or how the app works
- No guidance on what to do first
- No sample data to demonstrate value
- Empty states that don't guide action ("Your mind is clear" when user has never used the app)

This is a critical drop-off point — users who don't understand the system within 60 seconds will churn.

---

## Critique: What's Missing

| Gap | Impact |
|-----|--------|
| **No value demonstration** | Users don't see why this is better than their current system |
| **No "aha moment"** | No guided action that shows the capture → clarify → organize flow |
| **GTD jargon** | Terms like "Inbox," "Next," "Someday" assume knowledge |
| **Empty canvas paralysis** | Blank screens don't inspire action |
| **No progress/reward** | No celebration when users complete their first action |

---

## Recommended Onboarding Flow

### Phase 1: First-Run Welcome Modal
A single dialog when `user_settings` has no prior data:

1. **Welcome screen** — "Let's get your mind clear in 2 minutes"
2. **Quick capture exercise** — "Type 3 things on your mind right now" (pre-fills inbox)
3. **Show the magic** — User taps one item, sees Clarify slide up, picks a state
4. **Celebration** — "You just did GTD. That's it."

### Phase 2: Contextual Empty States
Replace passive empty states with action-oriented ones:
- **Inbox empty (new user):** "Add your first thought" with prominent input
- **Next empty:** "Clarify inbox items to see actions here"
- **Projects empty:** "Projects are multi-step goals. Create one when ready."

### Phase 3: Progress Nudges
- Badge on Review nav item after 7 days
- Toast: "You've captured 10 items! Ready for your first Weekly Review?"

---

## Technical Implementation

### Database
- Add `has_completed_onboarding` boolean to `user_settings` table

### New Components
- `src/components/onboarding/OnboardingModal.tsx` — Multi-step wizard
- `src/components/onboarding/OnboardingStep.tsx` — Shared step layout
- `src/hooks/useOnboarding.ts` — Track state & completion

### Integration Points
- Wrap `AppLayout` to show modal when `!hasCompletedOnboarding`
- Update `EmptyState` components with contextual first-run messages
- Create 3 seed items during onboarding ("Example: Call mom", "Example: Research vacation spots", "Example: Buy groceries")

### Flow Screens
```text
┌─────────────────────────────┐
│  Welcome to Things Done.    │
│                             │
│  Let's clear your mind      │
│  in under 2 minutes.        │
│                             │
│       [ Get Started ]       │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  What's on your mind?       │
│                             │
│  ┌───────────────────────┐  │
│  │ Type anything...      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ Another thing...      │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │ One more...           │  │
│  └───────────────────────┘  │
│                             │
│       [ Continue ]          │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Now let's clarify one.     │
│                             │
│  Tap "Call mom" below       │
│                             │
│  ┌───────────────────────┐  │
│  │ ○ Call mom            │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  🎉 You just did GTD!       │
│                             │
│  Capture → Clarify → Do     │
│                             │
│  You're ready. Go explore.  │
│                             │
│       [ Start Using App ]   │
└─────────────────────────────┘
```

---

## Summary

Build a **2-minute onboarding wizard** that:
1. Captures 3 real items from the user's mind
2. Guides them through clarifying one item
3. Marks onboarding complete and celebrates

This creates immediate value, teaches the core loop, and hooks users before they can bounce.

