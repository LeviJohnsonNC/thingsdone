import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateItem } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/stores/appStore";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { toast } from "sonner";

export function GlobalQuickAdd() {
  const { globalQuickAddOpen, setGlobalQuickAddOpen } = useAppStore();
  const { user } = useAuth();
  const createItem = useCreateItem();
  const { canCreateItem } = useUsageLimits();
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    if (!canCreateItem) {
      toast.error("Item limit reached. Upgrade to add more.");
      return;
    }
    createItem.mutate({ title: title.trim(), state: "inbox" });
    setTitle("");
    setGlobalQuickAddOpen(false);
    toast.success("Added to Inbox");
  };

  return (
    <Dialog open={globalQuickAddOpen} onOpenChange={setGlobalQuickAddOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Capture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            autoFocus
            className="flex-1"
          />
          <Button type="submit" disabled={!title.trim()}>Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
