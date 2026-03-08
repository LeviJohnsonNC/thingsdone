import { describe, it, expect } from "vitest";
import { cn } from "../utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-3")).toBe("px-2 py-3");
  });

  it("handles conditional classes", () => {
    expect(cn("px-2", false && "hidden", "py-3")).toBe("px-2 py-3");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles empty input", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined and null", () => {
    expect(cn(undefined, null, "px-2")).toBe("px-2");
  });
});
