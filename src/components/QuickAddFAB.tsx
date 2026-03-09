import { useState } from "react";
import { Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useCreateItem } from "@/hooks/useItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ItemState } from "@/lib/types";

const ROUTE_CONTEXT: Record<string, { state: ItemState; label: string; placeholder: string }> = {
  "/inbox": { state: "inbox", label: "Inbox", placeholder: "What's on your mind?" },
  "/": { state: "inbox", label: "Inbox", placeholder: "What's on your mind?" },
  "/next": { state: "next", label: "Next Actions", placeholder: "Add next action…" },
  "/focus": { state: "next", label: "Inbox", placeholder: "What's on your mind?" },
  "/scheduled": { state: "scheduled", label: "Scheduled", placeholder: "Add scheduled item…" },
  "/someday": { state: "someday", label: "Someday", placeholder: "Add someday item…" },
  "/waiting": { state: "waiting", label: "Waiting", placeholder: "Add waiting item…" },
};

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const createItem = useCreateItem();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { canCreateItem, activeItemCount, activeItemLimit } = useUsageLimits();

  const context = ROUTE_CONTEXT[location.pathname] ?? ROUTE_CONTEXT["/inbox"];

  const handleFabClick = () => {
    if (!canCreateItem) {
      setShowUpgrade(true);
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createItem.mutateAsync({ title: title.trim(), state: context.state });
    setTitle("");
    setOpen(false);
  };

  if (!isMobile) return null;

  return (
    <>
      <button
        onClick={handleFabClick}
        className="fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
        style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))", right: "1rem" }}
        aria-label="Quick add"
      >
        <Plus className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to {context.label}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder={context.placeholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="flex-1"
            />
            <Button type="submit" disabled={!title.trim() || createItem.isPending}>
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <UpgradePrompt
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        trigger="items"
        currentUsage={activeItemCount}
        limit={activeItemLimit === Infinity ? 30 : activeItemLimit}
      />
    </>
  );
}
