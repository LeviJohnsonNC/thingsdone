import { Inbox as InboxIcon } from "lucide-react";
import { QuickAddBar } from "@/components/QuickAddBar";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { useItems, useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";

export default function InboxView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("inbox", selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Inbox" count={items?.length} />
      <QuickAddBar />
      <div className="flex-1">
        {isLoading ? null : items?.length === 0 ? (
          <EmptyState
            icon={InboxIcon}
            title="Your mind is clear"
            description="Nothing to process. Enjoy the calm."
          />
        ) : (
          items?.map((item) => <ItemRow key={item.id} item={item} />)
        )}
        <DoneSection items={completedItems ?? []} restoreState="inbox" />
      </div>
    </div>
  );
}
