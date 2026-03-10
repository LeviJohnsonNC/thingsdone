import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";

// Track the auth state change callback so we can trigger it in tests
let authCallback: (event: string, session: any) => void;

vi.mock("@/integrations/supabase/client", () => {
  const mockUnsubscribe = vi.fn();
  return {
    supabase: {
      auth: {
        onAuthStateChange: vi.fn((cb: any) => {
          // Store callback on the module-level variable via side effect
          authCallback = cb;
          return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
        }),
        getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
        signUp: vi.fn(() => Promise.resolve({ error: null })),
        signInWithPassword: vi.fn(() => Promise.resolve({ error: null })),
        signOut: vi.fn(() => Promise.resolve()),
      },
    },
  };
});

// Import after mock is set up
import { AuthProvider, useAuth } from "../useAuth";
import { supabase } from "@/integrations/supabase/client";

// Test component that consumes the auth context
function AuthConsumer() {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <span data-testid="user">{user?.email ?? "none"}</span>
    </div>
  );
}

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset default mock behavior
    vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null } } as any);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: null } as any);
    vi.mocked(supabase.auth.signUp).mockResolvedValue({ error: null } as any);
  });

  it("throws when used outside AuthProvider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AuthConsumer />)).toThrow(
      "useAuth must be used within AuthProvider"
    );
    spy.mockRestore();
  });

  it("starts in loading state then resolves", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // After getSession resolves with null, loading becomes false
    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  it("sets user from session on auth state change", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      authCallback("SIGNED_IN", {
        user: { id: "user-1", email: "test@example.com" },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("test@example.com");
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
  });

  it("clears user on sign out", async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Sign in
    act(() => {
      authCallback("SIGNED_IN", {
        user: { id: "user-1", email: "test@example.com" },
      });
    });

    // Then sign out
    act(() => {
      authCallback("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("none");
    });
  });

  it("signIn calls supabase signInWithPassword", async () => {
    let signInFn: any;
    function Grabber() {
      const { signIn } = useAuth();
      signInFn = signIn;
      return null;
    }

    render(
      <AuthProvider>
        <Grabber />
      </AuthProvider>
    );

    const result = await signInFn("test@test.com", "password123");
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123",
    });
    expect(result.error).toBeNull();
  });

  it("signUp calls supabase signUp with redirect", async () => {
    let signUpFn: any;
    function Grabber() {
      const { signUp } = useAuth();
      signUpFn = signUp;
      return null;
    }

    render(
      <AuthProvider>
        <Grabber />
      </AuthProvider>
    );

    const result = await signUpFn("new@test.com", "password123");
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@test.com",
      password: "password123",
      options: { emailRedirectTo: window.location.origin },
    });
    expect(result.error).toBeNull();
  });
});
