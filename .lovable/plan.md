
## Auth Page Redesign Plan

### Overview
Redesign the sign-in/sign-up page to feel more polished, intentional, and cohesive. Move from a template-like appearance to a product-designed experience while maintaining the calm, minimal aesthetic.

### Changes

**1. Copy background image to assets**
- Copy `user-uploads://image.png` to `src/assets/auth-bg.png`
- Import and use as a full-bleed background image

**2. Rewrite Auth.tsx with refined design**

**Structure changes:**
- Remove external "Back to home" link
- Add subtle "← Home" link inside card at top-left
- Reorganize card header: small brand wordmark above, functional heading as primary
- Add proper form labels above inputs (not just placeholders)
- Improve alternate auth path styling with muted text + emphasized link
- Add subtle trust signal at bottom of card

**Visual hierarchy (sign-in mode):**
```
← Home                          [top-left, subtle]

Things Done.                    [small brand wordmark, muted]

Sign in                         [large primary heading]
Welcome back to Things Done.    [supporting text]

[Form with labeled inputs]

[Sign In button - full width]

Don't have an account? **Sign up**

🔒 Your data stays private      [subtle trust signal]
```

**Visual hierarchy (sign-up mode):**
```
← Home

Things Done.

Create your account
Start organizing work and life in one place.

[Form with labeled inputs]

[Create Account button]

Already have an account? **Sign in**

🔒 Your data stays private
```

**Styling refinements:**
- Full-viewport background image with `object-cover`
- Card: softer shadow (`shadow-xl` → custom soft shadow), backdrop blur for glass effect
- Increased spacing between subtitle and first input (add margin-top to form)
- Form labels: `text-sm font-medium` above each input
- Inputs: refined focus states with `focus-visible:ring-primary/50`
- Alternate auth: split into muted span + styled button/link
- Trust signal: small lock icon + muted text, centered at bottom

**3. Import Label component**
- Use existing `@/components/ui/label` for form field labels

### Files to modify
- `src/pages/Auth.tsx` - Complete rewrite
- Copy background image to `src/assets/auth-bg.png`
