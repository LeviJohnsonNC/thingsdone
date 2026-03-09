import { FileText } from "lucide-react";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { ItemListSkeleton } from "@/components/ItemListSkeleton";
import { useItems } from "@/hooks/useItems";
import { useAllItemTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";

export default function ReferenceView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("reference", selectedAreaId);
  const { data: itemTagMap } = useAllItemTags();
  const { filters, setFilters } = useItemFilters();

  const filteredItems = applyItemFilters(items, filters, itemTagMap);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Reference" count={filteredItems.length} />
      {filteredItems.length > 0 && <ItemFilterBar filters={filters} onChange={setFilters} />}
      <div className="flex-1">
        {isLoading ? <ItemListSkeleton /> : filteredItems.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reference material"
            description="File non-actionable items here — notes, links, info you might need later."
          />
        ) : (
          <SortableItemList items={filteredItems} />
        )}
      </div>
    </div>
  );
}
