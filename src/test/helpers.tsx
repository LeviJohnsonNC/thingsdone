import { ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import type { Item, Project, Area } from "@/lib/types";

// Shared mock for useAuth
export const mockUser = { id: "user-123", email: "test@example.com" } as any;

// Wrapper that provides QueryClient + Router
export function createWrapper(initialRoute = "/") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialRoute]}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

export function renderWithProviders(
  ui: ReactNode,
  options?: RenderOptions & { route?: string }
) {
  const { route = "/", ...rest } = options ?? {};
  return render(ui, { wrapper: createWrapper(route), ...rest });
}

// Factory helpers
export function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: "item-1",
    user_id: "user-123",
    title: "Test item",
    state: "inbox",
    notes: "",
    area_id: null,
    project_id: null,
    due_date: null,
    scheduled_date: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sort_order: 0,
    sort_order_project: 0,
    is_focused: false,
    time_estimate: null,
    energy: null,
    waiting_on: null,
    google_event_id: null,
    ...overrides,
  };
}

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "proj-1",
    user_id: "user-123",
    title: "Test project",
    state: "active",
    type: "sequential",
    notes: "",
    area_id: null,
    due_date: null,
    scheduled_date: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sort_order: 0,
    is_focused: false,
    ...overrides,
  };
}

export function makeArea(overrides: Partial<Area> = {}): Area {
  return {
    id: "area-1",
    user_id: "user-123",
    name: "Test area",
    sort_order: 0,
    created_at: new Date().toISOString(),
    theme: null as unknown as string,
    ...overrides,
  };
}
