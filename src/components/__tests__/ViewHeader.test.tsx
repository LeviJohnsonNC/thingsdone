import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ViewHeader } from "../ViewHeader";

describe("ViewHeader", () => {
  it("renders the title", () => {
    render(<ViewHeader title="Inbox" />);
    expect(screen.getByRole("heading", { name: "Inbox" })).toBeInTheDocument();
  });

  it("shows count badge when count > 0", () => {
    render(<ViewHeader title="Next" count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("hides count badge when count is 0", () => {
    render(<ViewHeader title="Next" count={0} />);
    expect(screen.queryByText("0")).toBeNull();
  });

  it("hides count badge when count is undefined", () => {
    render(<ViewHeader title="Next" />);
    // No numeric badge should appear
    const heading = screen.getByRole("heading");
    expect(heading.textContent).toBe("Inbox" || "Next");
  });

  it("renders children", () => {
    render(
      <ViewHeader title="Test">
        <button>Filter</button>
      </ViewHeader>
    );
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
  });
});
