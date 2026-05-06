# Diagnosis: "Loads forever until I clear browser data"

## Root cause

Two bugs combine to create exactly the symptom you described:

### Bug 1 — Marketing pages are blocked by auth loading state

In `src/App.tsx`, every public marketing route (including `/`, the home page) is wrapped in `PublicRoute`:

```ts
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;        // <-- renders NOTHING while auth resolves
  if (user) return <Navigate to="/inbox" replace />;
  return <>{children}</>;
}
```

While `loading === true`, the page renders **a blank white screen** — no spinner, no fallback, nothing. There is no good reason for the marketing/landing page to wait on auth at all (the redirect-if-signed-in is a nice-to-have, not a hard gate).

### Bug 2 — Auth init can hang on a stale/invalid refresh token

Your console logs show:
```
POST /auth/v1/token?grant_type=refresh_token → 400
"Invalid Refresh Token: Refresh Token Not Found"
```

`AuthProvider` does:
```ts
supabase.auth.getSession().then(({ data: { session } }) => {
  setLoading(false);
});
```

When the refresh token in `localStorage` is invalid/expired, the Supabase client retries the refresh internally. In some cases (slow network, retry backoff, browser throttling background tabs), `getSession()` and the `INITIAL_SESSION` event both stall for a long time before resolving. There is **no timeout** and **no fallback** — `loading` stays `true` indefinitely.

Combine the two: blank page that "loads forever" until you clear site data (which deletes the bad refresh token from localStorage, so the next load skips the refresh attempt and resolves instantly).

This is also why the bug is intermittent: it only triggers when the cached session is stale. After a successful sign-in or right after clearing data, it works fine — until the refresh token expires or gets invalidated server-side again.

## The fix

Three small, surgical changes — all in frontend code:

### 1. Don't block marketing pages on auth loading (`src/App.tsx`)

Change `PublicRoute` so it renders children immediately and only redirects once auth has resolved AND a user is present:

```ts
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/inbox" replace />;
  return <>{children}</>;
}
```

The home page now appears instantly regardless of auth state. Signed-in users are still bounced to `/inbox` once auth resolves (a brief flash of the marketing page is acceptable and matches what most SaaS sites do).

### 2. Add a hard timeout + bad-token recovery in `AuthProvider` (`src/hooks/useAuth.tsx`)

- Wrap `getSession()` so that after ~3 seconds we force `loading = false` even if Supabase hasn't responded.
- Listen for the `TOKEN_REFRESHED` failure path: if `getSession()` resolves with no session but `localStorage` still has Supabase auth keys, call `supabase.auth.signOut({ scope: 'local' })` to purge the stale tokens so the next page load is clean.

```ts
useEffect(() => {
  let cancelled = false;
  const timeout = setTimeout(() => {
    if (!cancelled) setLoading(false);   // never hang the UI
  }, 3000);

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });

  supabase.auth.getSession()
    .then(({ data: { session }, error }) => {
      if (cancelled) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (error || !session) {
        // purge any stale tokens left in localStorage
        supabase.auth.signOut({ scope: 'local' }).catch(() => {});
      }
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
    clearTimeout(timeout);
    subscription.unsubscribe();
  };
}, []);
```

### 3. Add a visible loading fallback to protected routes

Right now `AuthPage` and the auth gate elsewhere return `null` while loading. For protected routes keep the existing spinner; for `AuthPage` (which also returns `null`) render the auth screen immediately and let it work — same pattern as marketing.

## Files changed

| File | Change |
|------|--------|
| `src/App.tsx` | `PublicRoute` and `AuthPage` no longer return `null` while loading; render children immediately, redirect after auth resolves |
| `src/hooks/useAuth.tsx` | 3s timeout fallback, purge stale tokens via `signOut({ scope: 'local' })` when getSession returns no session/errors |

## Why this fully fixes the symptom

- Even if Supabase's auth init is slow or hangs, the home page renders within one paint (no auth gate).
- Even if a stale refresh token is sitting in localStorage, it gets cleaned up on the very next visit instead of accumulating until you manually clear site data.
- The 3s timeout guarantees the protected-route spinner can't get stuck either; worst case the user sees a brief unauthenticated state and gets redirected to `/auth`.

No backend / DB / RLS changes. No new dependencies.