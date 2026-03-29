import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/stores/appStore";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { parseNaturalDate } from "@/lib/parseNaturalDate";
import { toast } from "sonner";

export function GlobalQuickAdd() {
  const { globalQuickAddOpen, setGlobalQuickAddOpen } = useAppStore();
  const { user } = useAuth();
  const createItem = useCreateItem();
  const { canCreateItem } = useUsageLimits();
  const [title, setTitle] = useState("");

  const parsed = useMemo(() => parseNaturalDate(title), [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;
    if (!canCreateItem) {
      toast.error("Item limit reached. Upgrade to add more.");
      return;
    }
    const { selectedAreaId } = useAppStore.getState();
    createItem.mutate({
      title: parsed.cleanTitle,
      state: "inbox",
      ...(selectedAreaId && { area_id: selectedAreaId }),
      ...(parsed.scheduledDate && { scheduled_date: parsed.scheduledDate }),
    });
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
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              autoFocus
              className="pr-24"
            />
            {parsed.dateLabel && (
              <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] gap-1 pointer-events-none">
                <Calendar className="h-3 w-3" />
                {parsed.dateLabel}
              </Badge>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!title.trim() || createItem.isPending}>Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
