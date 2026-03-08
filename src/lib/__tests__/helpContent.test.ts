import { describe, it, expect } from "vitest";
import { helpTopics } from "../helpContent";

describe("helpContent", () => {
  it("has 12 help topics", () => {
    expect(helpTopics.length).toBe(12);
  });

  it("has 6 GTD topics and 6 app topics", () => {
    const gtd = helpTopics.filter((t) => t.section === "gtd");
    const app = helpTopics.filter((t) => t.section === "app");
    expect(gtd).toHaveLength(6);
    expect(app).toHaveLength(6);
  });

  it("every topic has required fields", () => {
    for (const topic of helpTopics) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.description).toBeTruthy();
      expect(topic.content.length).toBeGreaterThan(50);
      expect(topic.icon).toBeDefined();
    }
  });

  it("all topic IDs are unique", () => {
    const ids = helpTopics.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("GTD topics cover the core methodology", () => {
    const gtdIds = helpTopics.filter((t) => t.section === "gtd").map((t) => t.id);
    expect(gtdIds).toContain("what-is-gtd");
    expect(gtdIds).toContain("capture");
    expect(gtdIds).toContain("clarify");
    expect(gtdIds).toContain("next-actions");
    expect(gtdIds).toContain("weekly-review");
  });

  it("app topics cover key app features", () => {
    const appIds = helpTopics.filter((t) => t.section === "app").map((t) => t.id);
    expect(appIds).toContain("app-quick-capture");
    expect(appIds).toContain("app-clarify");
    expect(appIds).toContain("app-focus-next");
    expect(appIds).toContain("app-projects-areas");
  });

  it("no content contains raw unintended markdown markers", () => {
    // Ensure we don't have #### or deeper headings (unsupported)
    for (const topic of helpTopics) {
      expect(topic.content).not.toMatch(/^####/m);
    }
  });
});
