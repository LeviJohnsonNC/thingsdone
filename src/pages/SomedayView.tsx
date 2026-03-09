import { Cloud } from "lucide-react";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { QuickAddBar } from "@/components/QuickAddBar";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { ItemListSkeleton } from "@/components/ItemListSkeleton";
import { useItems } from "@/hooks/useItems";
import { useAllItemTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SomedayView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("someday", selectedAreaId);
  const { data: itemTagMap } = useAllItemTags();
  const { filters, setFilters } = useItemFilters();
  const isMobile = useIsMobile();

  const filteredItems = applyItemFilters(items, filters, itemTagMap);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Someday" count={filteredItems.length} />
      {filteredItems.length > 0 && <ItemFilterBar filters={filters} onChange={setFilters} />}
      <div className="flex-1">
        {isLoading ? <ItemListSkeleton /> : filteredItems.length === 0 ? (
          <EmptyState
            icon={Cloud}
            title="Nothing for someday"
            description="Move items here when you might do them eventually."
          />
        ) : (
          <SortableItemList items={filteredItems} />
        )}
      </div>
    </div>
  );
}
