import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parseNaturalDate } from "../parseNaturalDate";

describe("parseNaturalDate", () => {
  beforeEach(() => {
    // Pin "today" to 2026-03-10 so tests are deterministic
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 10)); // month is 0-indexed
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns input unchanged when no date is found", () => {
    const result = parseNaturalDate("Buy groceries");
    expect(result).toEqual({ cleanTitle: "Buy groceries" });
    expect(result.scheduledDate).toBeUndefined();
    expect(result.dateLabel).toBeUndefined();
  });

  it("parses 'tomorrow' and labels it correctly", () => {
    const result = parseNaturalDate("Call dentist tomorrow");
    expect(result.scheduledDate).toBe("2026-03-11");
    expect(result.dateLabel).toBe("Tomorrow");
    expect(result.cleanTitle).toBe("Call dentist");
  });

  it("parses 'today' and labels it correctly", () => {
    const result = parseNaturalDate("Fix bug today");
    expect(result.scheduledDate).toBe("2026-03-10");
    expect(result.dateLabel).toBe("Today");
    expect(result.cleanTitle).toBe("Fix bug");
  });

  it("parses a specific date and uses formatted label", () => {
    const result = parseNaturalDate("Meeting March 20");
    expect(result.scheduledDate).toBe("2026-03-20");
    expect(result.dateLabel).toBe("Fri, Mar 20");
    expect(result.cleanTitle).toBe("Meeting");
  });

  it("preserves leftover prepositions when date is removed", () => {
    const result = parseNaturalDate("Meeting on March 20");
    expect(result.scheduledDate).toBe("2026-03-20");
    // "on" is not part of the chrono match, so it stays
    expect(result.cleanTitle).toBe("Meeting on");
  });

  it("strips the date text and collapses extra whitespace", () => {
    const result = parseNaturalDate("Submit report by next Friday");
    expect(result.cleanTitle).not.toContain("  ");
    expect(result.scheduledDate).toBeDefined();
  });

  it("handles date at the start of the string", () => {
    const result = parseNaturalDate("Tomorrow buy milk");
    expect(result.scheduledDate).toBe("2026-03-11");
    expect(result.cleanTitle).toBe("buy milk");
  });

  it("handles date as the entire string (falls back to input)", () => {
    const result = parseNaturalDate("tomorrow");
    expect(result.scheduledDate).toBe("2026-03-11");
    // When cleaned title is empty, it falls back to the original input
    expect(result.cleanTitle).toBe("tomorrow");
  });

  it("handles empty string input", () => {
    const result = parseNaturalDate("");
    expect(result.cleanTitle).toBe("");
    expect(result.scheduledDate).toBeUndefined();
  });
});
