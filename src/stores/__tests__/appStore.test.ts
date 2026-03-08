import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../appStore";

describe("appStore", () => {
  beforeEach(() => {
    // Reset store between tests
    useAppStore.setState({
      selectedAreaId: null,
      editingItemId: null,
      clarifyItemId: null,
      moreMenuOpen: false,
    });
  });

  it("sets selected area id", () => {
    useAppStore.getState().setSelectedAreaId("area-1");
    expect(useAppStore.getState().selectedAreaId).toBe("area-1");
  });

  it("sets editing item id", () => {
    useAppStore.getState().setEditingItemId("item-1");
    expect(useAppStore.getState().editingItemId).toBe("item-1");
  });

  it("setClarifyItemId also sets editingItemId", () => {
    useAppStore.getState().setClarifyItemId("item-2");
    expect(useAppStore.getState().clarifyItemId).toBe("item-2");
    expect(useAppStore.getState().editingItemId).toBe("item-2");
  });

  it("clears area id with null", () => {
    useAppStore.getState().setSelectedAreaId("area-1");
    useAppStore.getState().setSelectedAreaId(null);
    expect(useAppStore.getState().selectedAreaId).toBeNull();
  });

  it("toggles more menu", () => {
    useAppStore.getState().setMoreMenuOpen(true);
    expect(useAppStore.getState().moreMenuOpen).toBe(true);
    useAppStore.getState().setMoreMenuOpen(false);
    expect(useAppStore.getState().moreMenuOpen).toBe(false);
  });
});
