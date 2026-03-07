import { Star } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { DoneSection } from "@/components/DoneSection";
import { useFocusedItems, useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";

export default function FocusView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useFocusedItems(selectedAreaId);
  const { data: completedItems } = useCompletedItems(selectedAreaId);

  // Show completed items that were focused
  const focusedCompleted = completedItems?.filter(i => i.is_focused) ?? [];

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Focus" count={items?.length} />
      <div className="flex-1">
        {isLoading ? null : items?.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Nothing focused right now"
            description="Star items to bring them here."
          />
        ) : (
          items?.map((item) => <ItemRow key={item.id} item={item} />)
        )}
        <DoneSection
          items={focusedCompleted}
          restoreState="next"
          restoreExtra={{ is_focused: true }}
        />
      </div>
    </div>
  );
}
