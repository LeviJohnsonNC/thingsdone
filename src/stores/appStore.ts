import { create } from "zustand";

interface AppState {
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  clarifyItemId: string | null;
  setClarifyItemId: (id: string | null) => void;
  moreMenuOpen: boolean;
  setMoreMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedAreaId: null,
  setSelectedAreaId: (id) => set({ selectedAreaId: id }),
  clarifyItemId: null,
  setClarifyItemId: (id) => set({ clarifyItemId: id }),
  moreMenuOpen: false,
  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),
}));
