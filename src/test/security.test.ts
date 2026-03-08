/**
 * Security audit tests — documents and validates security properties
 * of edge functions and data access patterns.
 *
 * These are structural/documentation tests that verify security invariants
 * by reading the actual source code, NOT by making live network calls.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

function readFunction(name: string): string {
  return readFileSync(
    join(process.cwd(), `supabase/functions/${name}/index.ts`),
    "utf-8"
  );
}

function readConfig(): string {
  return readFileSync(
    join(process.cwd(), "supabase/config.toml"),
    "utf-8"
  );
}

// ── Auth checks on every edge function ──────────────────────────────

describe("Edge function authentication", () => {
  const functionsWithAuth = [
    "review-ai",
    "generate-test-data",
    "create-checkout",
    "check-subscription",
    "customer-portal",
    "push-item-to-calendar",
    "google-calendar-auth",
    "sync-calendar-events",
    "google-calendar-refresh",
    "activate-scheduled-items",
  ];

  for (const fn of functionsWithAuth) {
    it(`${fn} rejects requests without Authorization header`, () => {
      const src = readFunction(fn);
      // Must check for Authorization header
      expect(src).toMatch(/Authorization/);
      // Must return 401 for unauthorized
      expect(src).toMatch(/401/);
    });
  }

  it("google-calendar-callback is the only function without bearer auth (uses OAuth code flow)", () => {
    const src = readFunction("google-calendar-callback");
    // This function uses query params (code + state), not bearer tokens
    expect(src).toMatch(/code/);
    expect(src).toMatch(/state/);
  });
});

// ── Functions that call paid APIs must have auth ────────────────────

describe("Paid API call protection", () => {
  it("review-ai (Lovable AI) requires authentication before AI call", () => {
    const src = readFunction("review-ai");
    const authCheckPos = src.indexOf("getClaims");
    const aiCallPos = src.indexOf("ai.gateway.lovable.dev");
    expect(authCheckPos).toBeGreaterThan(-1);
    expect(aiCallPos).toBeGreaterThan(-1);
    expect(authCheckPos).toBeLessThan(aiCallPos);
  });

  it("generate-test-data (Lovable AI) requires admin email check before AI call", () => {
    const src = readFunction("generate-test-data");
    const adminCheckPos = src.indexOf("ADMIN_EMAIL");
    const aiCallPos = src.indexOf("ai.gateway.lovable.dev");
    expect(adminCheckPos).toBeGreaterThan(-1);
    expect(aiCallPos).toBeGreaterThan(-1);
    expect(adminCheckPos).toBeLessThan(aiCallPos);
  });

  it("create-checkout (Stripe) requires user auth before Stripe call", () => {
    const src = readFunction("create-checkout");
    const authPos = src.indexOf("getUser(token)");
    const stripePos = src.indexOf("stripe.checkout.sessions.create");
    expect(authPos).toBeGreaterThan(-1);
    expect(stripePos).toBeGreaterThan(-1);
    expect(authPos).toBeLessThan(stripePos);
  });

  it("check-subscription (Stripe) requires user auth before Stripe call", () => {
    const src = readFunction("check-subscription");
    const authPos = src.indexOf("getUser(token)");
    const stripePos = src.indexOf("stripe.customers.list");
    expect(authPos).toBeGreaterThan(-1);
    expect(stripePos).toBeGreaterThan(-1);
    expect(authPos).toBeLessThan(stripePos);
  });

  it("customer-portal (Stripe) requires user auth before Stripe call", () => {
    const src = readFunction("customer-portal");
    const authPos = src.indexOf("getUser(token)");
    const stripePos = src.indexOf("billingPortal.sessions.create");
    expect(authPos).toBeGreaterThan(-1);
    expect(stripePos).toBeGreaterThan(-1);
    expect(authPos).toBeLessThan(stripePos);
  });

  it("push-item-to-calendar requires auth before Google API call", () => {
    const src = readFunction("push-item-to-calendar");
    const authPos = src.indexOf("getUser(");
    const googlePos = src.indexOf("googleapis.com/calendar");
    expect(authPos).toBeGreaterThan(-1);
    expect(googlePos).toBeGreaterThan(-1);
    expect(authPos).toBeLessThan(googlePos);
  });

  it("sync-calendar-events requires auth before Google API call", () => {
    const src = readFunction("sync-calendar-events");
    const authPos = src.indexOf("getUser(");
    const googlePos = src.indexOf("googleapis.com/calendar");
    expect(authPos).toBeGreaterThan(-1);
    expect(googlePos).toBeGreaterThan(-1);
    expect(authPos).toBeLessThan(googlePos);
  });
});

// ── Data scoping (user isolation) ──────────────────────────────────

describe("Data scoping and user isolation", () => {
  it("activate-scheduled-items scopes updates to authenticated user", () => {
    const src = readFunction("activate-scheduled-items");
    expect(src).toMatch(/user_id/);
    expect(src).toMatch(/getClaims|getUser/);
  });

  it("push-item-to-calendar scopes token lookup to user.id", () => {
    const src = readFunction("push-item-to-calendar");
    expect(src).toMatch(/\.eq\("user_id",\s*user\.id\)/);
  });

  it("google-calendar-refresh scopes token lookup to userId from claims", () => {
    const src = readFunction("google-calendar-refresh");
    expect(src).toMatch(/\.eq\("user_id",\s*userId\)/);
  });
});

// ── CORS headers ──────────────────────────────────────────────────

describe("CORS and OPTIONS handling", () => {
  const allFunctions = [
    "review-ai",
    "generate-test-data",
    "create-checkout",
    "check-subscription",
    "customer-portal",
    "push-item-to-calendar",
    "google-calendar-auth",
    "sync-calendar-events",
    "google-calendar-refresh",
    "activate-scheduled-items",
  ];

  for (const fn of allFunctions) {
    it(`${fn} handles OPTIONS preflight`, () => {
      const src = readFunction(fn);
      expect(src).toMatch(/OPTIONS/);
    });
  }
});

// ── Config: verify_jwt is false (handled in code) ─────────────────

describe("Config security", () => {
  it("all functions use verify_jwt = false (auth handled in code)", () => {
    const config = readConfig();
    // Every function should have verify_jwt = false since we validate in code
    const matches = config.match(/verify_jwt\s*=\s*false/g);
    // We have at least 10 functions configured
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(10);
  });

  it("no function has verify_jwt = true (deprecated approach)", () => {
    const config = readConfig();
    expect(config).not.toMatch(/verify_jwt\s*=\s*true/);
  });
});

// ── Input validation ──────────────────────────────────────────────

describe("Input validation", () => {
  it("review-ai validates step number", () => {
    const src = readFunction("review-ai");
    expect(src).toMatch(/Invalid step/);
  });

  it("generate-test-data restricts to admin email", () => {
    const src = readFunction("generate-test-data");
    expect(src).toMatch(/ADMIN_EMAIL/);
    expect(src).toMatch(/Forbidden/);
  });

  it("google-calendar-callback validates code and state params", () => {
    const src = readFunction("google-calendar-callback");
    expect(src).toMatch(/!code\s*\|\|\s*!userId/);
  });
});

// ── No secrets in client code ─────────────────────────────────────

describe("No secrets in client code", () => {
  it("supabase client only uses anon key (not service role)", () => {
    const src = readFileSync(
      join(process.cwd(), "src/integrations/supabase/client.ts"),
      "utf-8"
    );
    expect(src).not.toMatch(/SERVICE_ROLE/i);
    expect(src).not.toMatch(/STRIPE_SECRET/i);
  });
});
