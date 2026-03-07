import { useState } from "react";
import { ChevronRight, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateItem } from "@/hooks/useItems";
import type { Item } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DoneSectionProps {
  items: Item[];
  restoreState: string;
  restoreExtra?: Partial<Item>;
}

export function DoneSection({ items, restoreState, restoreExtra }: DoneSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const updateItem = useUpdateItem();

  if (items.length === 0) return null;

  const handleUncomplete = (item: Item) => {
    updateItem.mutate({
      id: item.id,
      state: restoreState,
      completed_at: null,
      ...restoreExtra,
    });
  };

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        Done
        <span className="text-xs opacity-70">({items.length})</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-2.5 border-t border-border/50"
              >
                <button
                  onClick={() => handleUncomplete(item)}
                  className={cn(
                    "flex items-center justify-center h-5 w-5 rounded-full shrink-0",
                    "bg-primary text-primary-foreground"
                  )}
                >
                  <Check className="h-3 w-3" />
                </button>
                <span className="text-sm text-muted-foreground line-through truncate">
                  {item.title}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
