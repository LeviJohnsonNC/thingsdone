import { create } from "zustand";

interface AppState {
  selectedAreaId: string | null;
  setSelectedAreaId: (id: string | null) => void;
  editingItemId: string | null;
  setEditingItemId: (id: string | null) => void;
  clarifyItemId: string | null;
  setClarifyItemId: (id: string | null) => void;
  moreMenuOpen: boolean;
  setMoreMenuOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  globalQuickAddOpen: boolean;
  setGlobalQuickAddOpen: (open: boolean) => void;
  selectedItemIds: string[];
  toggleSelectedItem: (id: string) => void;
  clearSelectedItems: () => void;
  selectMultipleItems: (ids: string[]) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedAreaId: null,
  setSelectedAreaId: (id) => set({ selectedAreaId: id }),
  editingItemId: null,
  setEditingItemId: (id) => set({ editingItemId: id }),
  clarifyItemId: null,
  setClarifyItemId: (id) => set({ clarifyItemId: id, editingItemId: id }),
  moreMenuOpen: false,
  setMoreMenuOpen: (open) => set({ moreMenuOpen: open }),
  searchOpen: false,
  setSearchOpen: (open) => set({ searchOpen: open }),
  globalQuickAddOpen: false,
  setGlobalQuickAddOpen: (open) => set({ globalQuickAddOpen: open }),
  selectedItemIds: [],
  toggleSelectedItem: (id) => {
    const current = get().selectedItemIds;
    set({ selectedItemIds: current.includes(id) ? current.filter((i) => i !== id) : [...current, id] });
  },
  clearSelectedItems: () => set({ selectedItemIds: [] }),
  selectMultipleItems: (ids) => set({ selectedItemIds: ids }),
}));
