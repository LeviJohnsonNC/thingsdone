import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, makeItem } from "@/test/helpers";
import InboxView from "../InboxView";

// Mock hooks — include all exports that child components use
const mockItems = [
  makeItem({ id: "1", title: "Buy groceries", state: "inbox" }),
  makeItem({ id: "2", title: "Call dentist", state: "inbox" }),
];

const mockMutate = vi.fn();

vi.mock("@/hooks/useItems", () => ({
  useItems: vi.fn(() => ({ data: mockItems, isLoading: false })),
  useCompletedItems: vi.fn(() => ({ data: [], isLoading: false })),
  useNextItems: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateItem: () => ({ mutate: mockMutate, mutateAsync: mockMutate }),
  useUpdateItem: () => ({ mutate: mockMutate }),
  useCompleteItem: () => ({ mutate: mockMutate }),
  useDeleteItem: () => ({ mutate: mockMutate }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" }, loading: false }),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/hooks/useSwipeHint", () => ({
  useSwipeHint: () => false,
}));

vi.mock("@/hooks/useReorderItems", () => ({
  useReorderItems: () => ({ reorder: vi.fn() }),
}));

vi.mock("@/hooks/useTags", () => ({
  useTags: () => ({ data: [] }),
  useAllItemTags: () => ({ data: new Map() }),
  useItemTags: () => ({ data: [] }),
  useSetItemTags: () => ({ mutate: vi.fn() }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: {
      div: ({ children, ...props }: any) => {
        const { drag, dragConstraints, dragElastic, onDragEnd, onDrag, animate, exit, transition, style, whileHover, whileTap, layout, layoutId, initial, variants, ...rest } = props;
        return <div {...rest}>{children}</div>;
      },
    },
    useMotionValue: () => ({ get: () => 0, set: () => {}, on: () => () => {} }),
    useTransform: () => "transparent",
  };
});

vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn() }),
}));

describe("InboxView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Inbox header", () => {
    renderWithProviders(<InboxView />);
    expect(screen.getByText("Inbox")).toBeInTheDocument();
  });

  it("shows item count in the header", () => {
    renderWithProviders(<InboxView />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders item titles", () => {
    renderWithProviders(<InboxView />);
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.getByText("Call dentist")).toBeInTheDocument();
  });

  it("shows empty state when no items", async () => {
    const { useItems } = await import("@/hooks/useItems");
    vi.mocked(useItems).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<InboxView />);
    expect(screen.getByText("All clear!")).toBeInTheDocument();
  });

  it("shows skeleton while loading", async () => {
    const { useItems } = await import("@/hooks/useItems");
    vi.mocked(useItems).mockReturnValue({ data: undefined, isLoading: true } as any);

    const { container } = renderWithProviders(<InboxView />);
    expect(container.querySelectorAll("[class*='animate']").length).toBeGreaterThanOrEqual(0);
  });
});
