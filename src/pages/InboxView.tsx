import { useRef, useMemo } from "react";
import { Inbox as InboxIcon } from "lucide-react";
import { QuickAddBar } from "@/components/QuickAddBar";
import { SortableItemList } from "@/components/SortableItemList";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { useItems, useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { useIsMobile } from "@/hooks/use-mobile";

export default function InboxView() {
  const { selectedAreaId, editingItemId } = useAppStore();
  const { data: items, isLoading } = useItems("inbox", selectedAreaId);
  const { data: allItems } = useItems(undefined, selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);
  const isMobile = useIsMobile();

  // Track items that were in inbox when we started editing, so they don't vanish mid-edit
  const stickyIdsRef = useRef<Set<string>>(new Set());

  const stableItems = useMemo(() => {
    const inboxItems = items ?? [];
    const inboxIds = new Set(inboxItems.map((i) => i.id));

    // If nothing is being edited, reset sticky IDs to current inbox
    if (!editingItemId) {
      stickyIdsRef.current = new Set(inboxIds);
      return inboxItems;
    }

    // Add current inbox items to sticky set
    for (const id of inboxIds) stickyIdsRef.current.add(id);

    // Find items that were sticky but left inbox (state changed while editing)
    const movedItems = (allItems ?? []).filter(
      (i) => stickyIdsRef.current.has(i.id) && !inboxIds.has(i.id)
    );

    if (movedItems.length === 0) return inboxItems;
    return [...inboxItems, ...movedItems];
  }, [items, allItems, editingItemId]);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Inbox" count={items?.length} />
      {!isMobile && <QuickAddBar />}
      <div className="flex-1">
        {isLoading ? null : stableItems.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="Your mind is clear"
            description="Nothing to process. Enjoy the calm."
          />
        ) : (
          <SortableItemList items={stableItems} />
        )}
        <DoneSection items={completedItems ?? []} restoreState="inbox" />
      </div>
    </div>
  );
}
