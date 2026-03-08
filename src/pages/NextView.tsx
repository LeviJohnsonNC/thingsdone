import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { useNextItems, useCompletedItems } from "@/hooks/useItems";
import { useTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIME_ESTIMATE_OPTIONS } from "@/lib/types";

export default function NextView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useNextItems(selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);
  const { data: tags } = useTags();
  const [filterTime, setFilterTime] = useState<string>("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);

  const filteredItems = items?.filter((item) => {
    if (filterTime !== "all" && item.time_estimate) {
      if (item.time_estimate > parseInt(filterTime)) return false;
    }
    return true;
  });

  const toggleTagFilter = (tagId: string) => {
    setFilterTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Next" count={filteredItems?.length}>
        <Select value={filterTime} onValueChange={setFilterTime}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any time</SelectItem>
            {TIME_ESTIMATE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value.toString()}>≤ {opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ViewHeader>

      {tags && tags.length > 0 && (
        <div className="flex gap-1.5 px-4 py-2 border-b border-border overflow-x-auto">
          {tags.map((tag) => (
            <Badge
              key={tag.id}
              variant={filterTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer text-xs shrink-0"
              onClick={() => toggleTagFilter(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex-1">
        {isLoading ? null : filteredItems?.length === 0 ? (
          <EmptyState
            icon={ArrowRight}
            title="No next actions"
            description="No actionable items — inbox is empty, nothing scheduled for today."
          />
        ) : (
          <SortableItemList items={filteredItems ?? []} />
        )}
        <DoneSection items={completedItems ?? []} restoreState="next" />
      </div>
    </div>
  );
}
