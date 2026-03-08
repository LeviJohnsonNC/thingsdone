import { describe, it, expect } from "vitest";
import { applyItemFilters, type ItemFilters } from "../ItemFilterBar";
import { makeItem } from "@/test/helpers";

describe("applyItemFilters", () => {
  const defaultFilters: ItemFilters = { timeEstimate: "all", energy: "all", tagIds: [] };

  it("returns empty array for undefined items", () => {
    expect(applyItemFilters(undefined, defaultFilters)).toEqual([]);
  });

  it("returns all items with default filters", () => {
    const items = [makeItem({ id: "1" }), makeItem({ id: "2" })];
    expect(applyItemFilters(items, defaultFilters)).toHaveLength(2);
  });

  it("filters by time estimate", () => {
    const items = [
      makeItem({ id: "1", time_estimate: 15 }),
      makeItem({ id: "2", time_estimate: 30 }),
      makeItem({ id: "3", time_estimate: null }),
    ];
    const filters: ItemFilters = { ...defaultFilters, timeEstimate: "15" };
    const result = applyItemFilters(items, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by energy level", () => {
    const items = [
      makeItem({ id: "1", energy: "high" }),
      makeItem({ id: "2", energy: "low" }),
    ];
    const filters: ItemFilters = { ...defaultFilters, energy: "high" };
    const result = applyItemFilters(items, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters by tag IDs", () => {
    const items = [makeItem({ id: "1" }), makeItem({ id: "2" })];
    const tagMap = new Map([
      ["1", ["tag-a", "tag-b"]],
      ["2", ["tag-c"]],
    ]);
    const filters: ItemFilters = { ...defaultFilters, tagIds: ["tag-a"] };
    const result = applyItemFilters(items, filters, tagMap);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("requires all selected tags to match", () => {
    const items = [makeItem({ id: "1" })];
    const tagMap = new Map([["1", ["tag-a"]]]);
    const filters: ItemFilters = { ...defaultFilters, tagIds: ["tag-a", "tag-b"] };
    const result = applyItemFilters(items, filters, tagMap);
    expect(result).toHaveLength(0);
  });

  it("combines multiple filters", () => {
    const items = [
      makeItem({ id: "1", time_estimate: 15, energy: "high" }),
      makeItem({ id: "2", time_estimate: 15, energy: "low" }),
      makeItem({ id: "3", time_estimate: 30, energy: "high" }),
    ];
    const filters: ItemFilters = { timeEstimate: "15", energy: "high", tagIds: [] };
    const result = applyItemFilters(items, filters);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
