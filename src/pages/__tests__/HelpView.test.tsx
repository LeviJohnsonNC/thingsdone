import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/helpers";
import HelpView from "../HelpView";
import { helpTopics } from "@/lib/helpContent";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("HelpView", () => {
  it("renders Help Center heading", () => {
    renderWithProviders(<HelpView />);
    expect(screen.getByText("Help Center")).toBeInTheDocument();
  });

  it("renders both section headings", () => {
    renderWithProviders(<HelpView />);
    expect(screen.getByText("Getting Things Done®")).toBeInTheDocument();
    expect(screen.getByText("Using Things Done.")).toBeInTheDocument();
  });

  it("renders all 12 topic cards", () => {
    renderWithProviders(<HelpView />);
    for (const topic of helpTopics) {
      expect(screen.getByText(topic.title)).toBeInTheDocument();
    }
  });

  it("opens dialog when clicking a topic card", () => {
    renderWithProviders(<HelpView />);
    fireEvent.click(screen.getByText("What is GTD®?"));
    // Dialog should now show the topic content - check for a known phrase
    expect(screen.getByText(/Getting Things Done® \(GTD®\)/)).toBeInTheDocument();
  });

  it("back button calls navigate(-1)", () => {
    renderWithProviders(<HelpView />);
    // The back button is the ArrowLeft icon button
    const buttons = screen.getAllByRole("button");
    const backBtn = buttons[0]; // first button is the back arrow
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
