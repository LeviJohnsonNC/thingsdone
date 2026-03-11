import { useState, useMemo } from "react";
import { Plus, Calendar } from "lucide-react";
import { useCreateItem } from "@/hooks/useItems";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { useAppStore } from "@/stores/appStore";
import { UpgradePrompt } from "@/components/UpgradePrompt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { parseNaturalDate } from "@/lib/parseNaturalDate";
import type { ItemState } from "@/lib/types";

interface QuickAddBarProps {
  placeholder?: string;
  defaultState?: ItemState;
  projectId?: string;
}

export function QuickAddBar({ placeholder = "Add to inbox…", defaultState, projectId }: QuickAddBarProps) {
  const [title, setTitle] = useState("");
  const createItem = useCreateItem();
  const { canCreateItem, activeItemCount, activeItemLimit } = useUsageLimits();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { selectedAreaId } = useAppStore();

  const parsed = useMemo(() => parseNaturalDate(title), [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (!canCreateItem) {
      setShowUpgrade(true);
      return;
    }

    await createItem.mutateAsync({
      title: parsed.cleanTitle,
      ...(defaultState && { state: defaultState }),
      ...(projectId && { project_id: projectId }),
      ...(selectedAreaId && { area_id: selectedAreaId }),
      ...(parsed.scheduledDate && { scheduled_date: parsed.scheduledDate }),
    });
    setTitle("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-border bg-card">
        <div className="flex-1 relative">
          <Input
            placeholder={placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="pr-20"
          />
          {parsed.dateLabel && (
            <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] gap-1 pointer-events-none">
              <Calendar className="h-3 w-3" />
              {parsed.dateLabel}
            </Badge>
          )}
        </div>
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
