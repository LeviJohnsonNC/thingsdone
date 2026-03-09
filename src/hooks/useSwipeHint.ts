import { useState, useEffect } from "react";
import type { Item } from "@/lib/types";

const SWIPE_HINT_KEY = "gtd_swipe_hint_shown";

/**
 * Returns true once — on the very first session where items exist —
 * to trigger the swipe-hint animation on the first ItemRow.
 */
export function useSwipeHint(items?: Item[]): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;

    try {
      const alreadyShown = localStorage.getItem(SWIPE_HINT_KEY);
      if (alreadyShown) return;

      setShow(true);
      localStorage.setItem(SWIPE_HINT_KEY, "1");

      // Auto-dismiss after the animation completes
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    } catch {
      // localStorage unavailable
    }
  }, [items]);

  return show;
}
