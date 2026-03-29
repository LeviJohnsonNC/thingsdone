import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, makeItem } from "@/test/helpers";
import NextView from "../NextView";

const mockNextItems = [
  makeItem({ id: "1", title: "Write tests", state: "next", time_estimate: 30, energy: "high" }),
  makeItem({ id: "2", title: "Deploy feature", state: "next" }),
];

const mockMutate = vi.fn();

vi.mock("@/hooks/useItems", () => ({
  useItems: vi.fn(() => ({ data: [], isLoading: false })),
  useNextItems: vi.fn(() => ({ data: mockNextItems, isLoading: false })),
  useCompletedItems: vi.fn(() => ({ data: [], isLoading: false })),
  useCreateItem: () => ({ mutate: mockMutate, mutateAsync: mockMutate }),
  useUpdateItem: () => ({ mutate: mockMutate }),
  useCompleteItem: () => ({ mutate: mockMutate }),
  useDeleteItem: () => ({ mutate: mockMutate }),
  useToggleFocus: () => ({ mutate: mockMutate }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" }, loading: false }),
}));

vi.mock("@/hooks/useTags", () => ({
  useTags: () => ({ data: [] }),
  useAllItemTags: () => ({ data: new Map() }),
  useItemTags: () => ({ data: [] }),
  useSetItemTags: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/hooks/useReorderItems", () => ({
  useReorderItems: () => ({ reorder: vi.fn() }),
}));

vi.mock("@/hooks/useSwipeHint", () => ({
  useSwipeHint: () => false,
}));

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

describe("NextView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Next header", () => {
    renderWithProviders(<NextView />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows item count", () => {
    renderWithProviders(<NextView />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders next action items", () => {
    renderWithProviders(<NextView />);
    expect(screen.getByText("Write tests")).toBeInTheDocument();
    expect(screen.getByText("Deploy feature")).toBeInTheDocument();
  });

  it("shows empty state when no items", async () => {
    const { useNextItems } = await import("@/hooks/useItems");
    vi.mocked(useNextItems).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<NextView />);
    expect(screen.getByText("No next actions")).toBeInTheDocument();
  });

  it("shows Go to Inbox action in empty state", async () => {
    const { useNextItems } = await import("@/hooks/useItems");
    vi.mocked(useNextItems).mockReturnValue({ data: [], isLoading: false } as any);

    renderWithProviders(<NextView />);
    expect(screen.getByText("Go to Inbox")).toBeInTheDocument();
  });
});
