import { describe, it, expect } from "vitest";
import {
  ENERGY_OPTIONS,
  TIME_ESTIMATE_OPTIONS,
  ITEM_STATE_OPTIONS,
} from "../types";

describe("type constants", () => {
  it("ENERGY_OPTIONS has 3 levels", () => {
    expect(ENERGY_OPTIONS).toHaveLength(3);
    expect(ENERGY_OPTIONS.map((e) => e.value)).toEqual(["low", "medium", "high"]);
  });

  it("TIME_ESTIMATE_OPTIONS has 6 options", () => {
    expect(TIME_ESTIMATE_OPTIONS).toHaveLength(6);
    expect(TIME_ESTIMATE_OPTIONS[0].value).toBe(5);
    expect(TIME_ESTIMATE_OPTIONS[5].value).toBe(240);
  });

  it("ITEM_STATE_OPTIONS doesn't include inbox or completed", () => {
    const values = ITEM_STATE_OPTIONS.map((o) => o.value);
    expect(values).not.toContain("inbox");
    expect(values).not.toContain("completed");
    expect(values).toContain("next");
    expect(values).toContain("someday");
  });

  it("TIME_ESTIMATE_OPTIONS are in ascending order", () => {
    const values = TIME_ESTIMATE_OPTIONS.map((o) => o.value);
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});
