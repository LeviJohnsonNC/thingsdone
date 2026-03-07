import { Cloud } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { useItems, useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";

export default function SomedayView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("someday", selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Someday" count={items?.length} />
      <div className="flex-1">
        {isLoading ? null : items?.length === 0 ? (
          <EmptyState
            icon={Cloud}
            title="Nothing for someday"
            description="Move items here when you might do them eventually."
          />
        ) : (
          items?.map((item) => <ItemRow key={item.id} item={item} />)
        )}
        <DoneSection items={completedItems ?? []} restoreState="someday" />
      </div>
    </div>
  );
}
