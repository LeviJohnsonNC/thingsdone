import { X, CheckCircle2, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCompleteItem, useUpdateItem, useDeleteItem } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ItemState } from "@/lib/types";

const MOVE_OPTIONS: { label: string; state: ItemState }[] = [
  { label: "Inbox", state: "inbox" },
  { label: "Next", state: "next" },
  { label: "Scheduled", state: "scheduled" },
  { label: "Waiting", state: "waiting" },
  { label: "Someday", state: "someday" },
];

export function BatchActionBar() {
  const { selectedItemIds, clearSelectedItems } = useAppStore();
  const completeItem = useCompleteItem();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const count = selectedItemIds.length;

  const handleCompleteAll = () => {
    for (const id of selectedItemIds) {
      completeItem.mutate({ id, title: "", user_id: "" } as any);
    }
    toast.success(`Completed ${count} items`);
    clearSelectedItems();
  };

  const handleMoveAll = (state: ItemState) => {
    for (const id of selectedItemIds) {
      updateItem.mutate({ id, state });
    }
    toast.success(`Moved ${count} items to ${state}`);
    clearSelectedItems();
  };

  const handleTrashAll = () => {
    for (const id of selectedItemIds) {
      deleteItem.mutate(id);
    }
    toast.success(`Deleted ${count} items`);
    clearSelectedItems();
  };

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-2"
        >
          <span className="text-sm font-medium text-foreground mr-1">{count} selected</span>

          <Button size="sm" variant="ghost" onClick={handleCompleteAll} className="gap-1">
            <CheckCircle2 className="h-4 w-4 text-success-green" />
            <span className="hidden sm:inline">Complete</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-1">
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">Move to…</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {MOVE_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.state} onClick={() => handleMoveAll(opt.state)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="ghost" onClick={handleTrashAll} className="gap-1 text-overdue-red hover:text-overdue-red">
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <Button size="icon" variant="ghost" onClick={clearSelectedItems} className="h-7 w-7 ml-1">
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
