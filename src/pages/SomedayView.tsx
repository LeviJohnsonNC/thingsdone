import { Cloud } from "lucide-react";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { useItems, useCompletedItems } from "@/hooks/useItems";
import { useAllItemTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";

export default function SomedayView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("someday", selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);
  const { data: itemTagMap } = useAllItemTags();
  const { filters, setFilters } = useItemFilters();

  const filteredItems = applyItemFilters(items, filters, itemTagMap);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Someday" count={filteredItems.length} />
      <ItemFilterBar filters={filters} onChange={setFilters} />
      <div className="flex-1">
        {isLoading ? null : filteredItems.length === 0 ? (
          <EmptyState
            icon={Cloud}
            title="Nothing for someday"
            description="Move items here when you might do them eventually."
          />
        ) : (
          <SortableItemList items={filteredItems} />
        )}
        <DoneSection items={completedItems ?? []} restoreState="someday" />
      </div>
    </div>
  );
}
