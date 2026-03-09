import { useRef, useMemo, useCallback } from "react";
import { Inbox as InboxIcon } from "lucide-react";
import { QuickAddBar } from "@/components/QuickAddBar";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { ItemListSkeleton } from "@/components/ItemListSkeleton";
import { PullToRefresh } from "@/components/PullToRefresh";
import { useItems, useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeHint } from "@/hooks/useSwipeHint";
import { useQueryClient } from "@tanstack/react-query";

export default function InboxView() {
  const { selectedAreaId, editingItemId } = useAppStore();
  const { data: items, isLoading } = useItems("inbox", selectedAreaId);
  const { data: allItems } = useItems(undefined, selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const showSwipeHint = useSwipeHint(items);

  const stickyIdsRef = useRef<Set<string>>(new Set());

  const stableItems = useMemo(() => {
    const inboxItems = items ?? [];
    const inboxIds = new Set(inboxItems.map((i) => i.id));

    if (!editingItemId) {
      stickyIdsRef.current = new Set(inboxIds);
      return inboxItems;
    }

    for (const id of inboxIds) stickyIdsRef.current.add(id);

    const movedItems = (allItems ?? []).filter(
      (i) => stickyIdsRef.current.has(i.id) && !inboxIds.has(i.id)
    );

    if (movedItems.length === 0) return inboxItems;
    return [...inboxItems, ...movedItems];
  }, [items, allItems, editingItemId]);

  const handleRefresh = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: ["items"] });
  }, [queryClient]);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Inbox" count={items?.length} />
      {!isMobile && <QuickAddBar />}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="flex-1">
          {isLoading ? <ItemListSkeleton /> : stableItems.length === 0 ? (
            <EmptyState
              icon={InboxIcon}
              title="All clear!"
              description="Your inbox is empty. Capture anything on your mind."
              actionLabel="Capture something"
              onAction={() => useAppStore.getState().setGlobalQuickAddOpen(true)}
            />
          ) : (
            <SortableItemList items={stableItems} showSwipeHintOnFirst={showSwipeHint} />
          )}
          <DoneSection items={completedItems ?? []} restoreState="inbox" />
        </div>
      </PullToRefresh>
    </div>
  );
}
