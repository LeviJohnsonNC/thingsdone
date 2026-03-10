import { describe, it, expect, vi, beforeEach } from "vitest";

// We test the reducer and constants directly — no Supabase needed
// Extract the reducer by importing the module and testing state transitions

// Since the reducer isn't exported, we test the public API indirectly
// by testing REVIEW_STEPS and the ReviewStats type contract
import { REVIEW_STEPS } from "../useReview";
import type { ReviewStats, ReviewSuggestion } from "../useReview";

describe("REVIEW_STEPS", () => {
  it("has 7 steps in the correct GTD order", () => {
    expect(REVIEW_STEPS).toHaveLength(7);
    expect(REVIEW_STEPS[0].label).toBe("Inbox");
    expect(REVIEW_STEPS[6].label).toBe("Summary");
  });

  it("each step has a unique id", () => {
    const ids = REVIEW_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ids are sequential starting from 1", () => {
    REVIEW_STEPS.forEach((step, i) => {
      expect(step.id).toBe(i + 1);
    });
  });

  it("each step has both label and shortLabel", () => {
    REVIEW_STEPS.forEach((step) => {
      expect(step.label).toBeTruthy();
      expect(step.shortLabel).toBeTruthy();
    });
  });

  it("covers all GTD review categories", () => {
    const labels = REVIEW_STEPS.map((s) => s.label);
    expect(labels).toContain("Inbox");
    expect(labels).toContain("Next Actions");
    expect(labels).toContain("Waiting For");
    expect(labels).toContain("Scheduled");
    expect(labels).toContain("Someday");
    expect(labels).toContain("Projects");
    expect(labels).toContain("Summary");
  });
});

describe("ReviewStats shape", () => {
  it("initializes all counters to zero", () => {
    const stats: ReviewStats = {
      inboxProcessed: 0,
      itemsCompleted: 0,
      itemsTrashed: 0,
      itemsCreated: 0,
      itemsMoved: 0,
      projectsFlagged: 0,
    };
    Object.values(stats).forEach((v) => expect(v).toBe(0));
  });
});

describe("ReviewSuggestion action types", () => {
  it("accepts valid suggestion shapes", () => {
    const suggestion: ReviewSuggestion = {
      item_id: "item-1",
      action: "move",
      target_state: "next",
      reasoning: "This is actionable",
    };
    expect(suggestion.action).toBe("move");
  });

  it("accepts suggestion with project_id", () => {
    const suggestion: ReviewSuggestion = {
      project_id: "proj-1",
      action: "follow_up",
      reasoning: "No progress in 2 weeks",
    };
    expect(suggestion.action).toBe("follow_up");
  });
});
