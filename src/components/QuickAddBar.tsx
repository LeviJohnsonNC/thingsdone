import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const item = await createItem.mutateAsync({
      title: title.trim(),
      ...(defaultState && { state: defaultState }),
      ...(projectId && { project_id: projectId }),
    });
    setTitle("");
    if (item?.id) {
      setEditingItemId(item.id);
    }
  };

  return (
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
  );
}
