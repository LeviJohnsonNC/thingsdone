import { create } from "zustand";

interface AppState {
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  // Keep backward compat alias
  clarifyItemId: string | null;
  setClarifyItemId: (id: string | null) => void;
  moreMenuOpen: boolean;
  setMoreMenuOpen: (open: boolean) => void;
  // Weekly Review Wizard
  weeklyReviewOpen: boolean;
  setWeeklyReviewOpen: (open: boolean) => void;
  weeklyReviewStep: number;
  setWeeklyReviewStep: (step: number) => void;
  reviewStats: { processed: number; completed: number; projectsReviewed: number };
  incrementReviewStat: (key: "processed" | "completed" | "projectsReviewed") => void;
  resetReviewState: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAreaId: null,
  setSelectedAreaId: (id) => set({ selectedAreaId: id }),
  clarifyItemId: null,
  setClarifyItemId: (id) => set({ clarifyItemId: id }),
  moreMenuOpen: false,
  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),
  weeklyReviewOpen: false,
  setWeeklyReviewOpen: (open) => set({ weeklyReviewOpen: open }),
  weeklyReviewStep: 0,
  setWeeklyReviewStep: (step) => set({ weeklyReviewStep: step }),
  reviewStats: { processed: 0, completed: 0, projectsReviewed: 0 },
  incrementReviewStat: (key) =>
    set((s) => ({
      reviewStats: { ...s.reviewStats, [key]: s.reviewStats[key] + 1 },
    })),
  resetReviewState: () =>
    set({
      weeklyReviewStep: 0,
      reviewStats: { processed: 0, completed: 0, projectsReviewed: 0 },
    }),
}));
