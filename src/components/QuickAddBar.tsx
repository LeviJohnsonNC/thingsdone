import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ItemState } from "@/lib/types";

interface QuickAddBarProps {
  placeholder?: string;
  defaultState?: ItemState;
  projectId?: string;
}

export function QuickAddBar({ placeholder = "Add to inbox…", defaultState, projectId }: QuickAddBarProps) {
  const [title, setTitle] = useState("");
  const createItem = useCreateItem();
  const { setEditingItemId } = useAppStore();
  const { canCreateItem, activeItemCount, activeItemLimit } = useUsageLimits();
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!canCreateItem) {
      setShowUpgrade(true);
      return;
    }

    await createItem.mutateAsync({
      title: title.trim(),
      ...(defaultState && { state: defaultState }),
      ...(projectId && { project_id: projectId }),
    });
    setTitle("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-border bg-card">
        <Input
          placeholder={placeholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={!title.trim() || createItem.isPending}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </form>
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
