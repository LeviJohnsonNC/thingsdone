import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, makeItem } from "@/test/helpers";
import { ItemRow } from "../ItemRow";
import { useAppStore } from "@/stores/appStore";

// Mock hooks
const mockCompleteItem = { mutate: vi.fn() };
const mockUpdateItem = { mutate: vi.fn() };

vi.mock("@/hooks/useItems", () => ({
  useCompleteItem: () => mockCompleteItem,
  useUpdateItem: () => mockUpdateItem,
  useToggleFocus: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "user-123" }, loading: false }),
}));

// Mock framer-motion
vi.mock("framer-motion", async () => {
  return {
    AnimatePresence: ({ children }: any) => children,
    motion: {
      div: ({ children, ...props }: any) => {
        const {
          drag, dragConstraints, dragElastic, onDragEnd, onDrag,
          animate, exit, transition, style, whileHover, whileTap,
          layout, layoutId, initial, variants, ...rest
        } = props;
        return <div {...rest}>{children}</div>;
      },
    },
    useMotionValue: () => ({
      get: () => 0,
      set: () => {},
      on: () => () => {},
    }),
    useTransform: () => "transparent",
  };
});

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: Object.assign(vi.fn(), { success: vi.fn() }),
}));

describe("ItemRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.setState({
      editingItemId: null,
      selectedItemIds: [],
    });
  });

  it("renders the item title", () => {
    const item = makeItem({ title: "Buy groceries" });
    renderWithProviders(<ItemRow item={item} />);
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("shows due date when present", () => {
    const item = makeItem({ title: "Task", due_date: "2026-03-15" });
    renderWithProviders(<ItemRow item={item} />);
    // toLocaleDateString may render as Mar 14 or Mar 15 depending on timezone
    const dateEl = screen.getByText(/Mar 1[45]/);
    expect(dateEl).toBeInTheDocument();
  });

  it("shows time estimate when present", () => {
    const item = makeItem({ title: "Task", time_estimate: 30 });
    renderWithProviders(<ItemRow item={item} />);
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("shows time estimate in hours for >= 60 min", () => {
    const item = makeItem({ title: "Task", time_estimate: 120 });
    renderWithProviders(<ItemRow item={item} />);
    expect(screen.getByText("2h")).toBeInTheDocument();
  });

  it("shows checklist progress when present", () => {
    const item = makeItem({
      title: "Task",
      checklist: [
        { id: "1", text: "Step 1", checked: true },
        { id: "2", text: "Step 2", checked: false },
      ] as any,
    });
    renderWithProviders(<ItemRow item={item} />);
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("applies dimmed styling when dimmed prop is true", () => {
    const item = makeItem({ title: "Dimmed task" });
    const { container } = renderWithProviders(<ItemRow item={item} dimmed />);
    expect(container.querySelector(".opacity-50")).toBeInTheDocument();
  });

  it("highlights focused items with a filled star", () => {
    const item = makeItem({ title: "Focused task", is_focused: true });
    const { container } = renderWithProviders(<ItemRow item={item} />);
    const star = container.querySelector(".fill-focus-gold");
    expect(star).toBeInTheDocument();
  });

  it("shows unfilled star for non-focused items", () => {
    const item = makeItem({ title: "Normal task", is_focused: false });
    const { container } = renderWithProviders(<ItemRow item={item} />);
    const star = container.querySelector(".fill-focus-gold");
    expect(star).not.toBeInTheDocument();
  });
});
