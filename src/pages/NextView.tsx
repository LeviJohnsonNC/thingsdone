import { useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { QuickAddBar } from "@/components/QuickAddBar";
import { DoneSection } from "@/components/DoneSection";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { ItemListSkeleton } from "@/components/ItemListSkeleton";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useNextItems, useCompletedItems } from "@/hooks/useItems";
import { useAllItemTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQueryClient } from "@tanstack/react-query";

export default function NextView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useNextItems(selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);
  const { data: itemTagMap } = useAllItemTags();
  const { filters, setFilters } = useItemFilters();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const filteredItems = applyItemFilters(items, filters, itemTagMap);

  const handleRefresh = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: ["items"] });
  }, [queryClient]);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Next" count={filteredItems.length} />
      {!isMobile && <QuickAddBar placeholder="Add next action…" defaultState="next" />}
      {filteredItems.length > 0 && <ItemFilterBar filters={filters} onChange={setFilters} />}

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex-1">
          {isLoading ? <ItemListSkeleton /> : filteredItems.length === 0 ? (
            <EmptyState
              icon={ArrowRight}
              title="No next actions"
              description="No actionable items — inbox is empty, nothing scheduled for today."
            />
          ) : (
            <SortableItemList items={filteredItems} />
          )}
          <DoneSection items={completedItems ?? []} restoreState="next" />
        </div>
      </PullToRefresh>
    </div>
  );
}
