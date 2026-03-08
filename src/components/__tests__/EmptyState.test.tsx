import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "../EmptyState";
import { Inbox } from "lucide-react";

describe("EmptyState", () => {
  it("renders icon, title, and description", () => {
    render(
      <EmptyState icon={Inbox} title="All clear" description="Nothing to do." />
    );
    expect(screen.getByText("All clear")).toBeInTheDocument();
    expect(screen.getByText("Nothing to do.")).toBeInTheDocument();
  });

  it("does not render action button when no action provided", () => {
    render(
      <EmptyState icon={Inbox} title="Empty" description="No items." />
    );
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders action button and fires callback", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        icon={Inbox}
        title="Empty"
        description="No items."
        actionLabel="Add item"
        onAction={onClick}
      />
    );
    const btn = screen.getByRole("button", { name: "Add item" });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
