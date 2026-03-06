import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function QuickAddFAB() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createItem = useCreateItem();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createItem.mutateAsync({ title: title.trim() });
    setTitle("");
    setOpen(false);
  };

  if (!isMobile) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
        aria-label="Quick add"
      >
        <Plus className="h-6 w-6" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Add to Inbox</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="What's on your mind?"
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
    </>
  );
}
