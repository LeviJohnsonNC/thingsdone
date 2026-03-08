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
}

export const useAppStore = create<AppState>((set) => ({
  selectedAreaId: null,
  setSelectedAreaId: (id) => set({ selectedAreaId: id }),
  editingItemId: null,
  setEditingItemId: (id) => set({ editingItemId: id }),
  clarifyItemId: null,
  setClarifyItemId: (id) => set({ clarifyItemId: id, editingItemId: id }),
  moreMenuOpen: false,
  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),
}));
