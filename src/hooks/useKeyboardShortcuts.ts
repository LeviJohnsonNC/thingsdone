import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";

const NAV_KEYS: Record<string, string> = {
  "1": "/inbox",
  "2": "/next",
  "3": "/focus",
  "4": "/projects",
  "5": "/logbook",
  "6": "/settings",
};

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { setSearchOpen, setGlobalQuickAddOpen, editingItemId, setEditingItemId, searchOpen } = useAppStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Cmd+K — always works
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
        return;
      }

      // Cmd+1-6 navigation
      if ((e.metaKey || e.ctrlKey) && NAV_KEYS[e.key]) {
        e.preventDefault();
        navigate(NAV_KEYS[e.key]);
        return;
      }

      // Skip remaining shortcuts if in an input
      if (isInput) return;

      switch (e.key) {
        case "n":
        case "N":
          e.preventDefault();
          setGlobalQuickAddOpen(true);
          break;
        case "Escape":
          if (editingItemId) {
            setEditingItemId(null);
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, setSearchOpen, setGlobalQuickAddOpen, editingItemId, setEditingItemId, searchOpen]);
}
