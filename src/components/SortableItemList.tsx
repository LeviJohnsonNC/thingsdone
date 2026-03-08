import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItemRow } from "./SortableItemRow";
import { useReorderItems } from "@/hooks/useReorderItems";
import type { Item } from "@/lib/types";

interface SortableItemListProps {
  items: Item[];
  showProject?: boolean;
  dimmedIds?: Set<string>;
  orderField?: "sort_order" | "sort_order_project";
}

export function SortableItemList({
  items,
  showProject,
  dimmedIds,
  orderField = "sort_order",
}: SortableItemListProps) {
  const reorderItems = useReorderItems();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...items];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      const updates = reordered.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      reorderItems.mutate({ updates, field: orderField });
    },
    [items, reorderItems, orderField]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItemRow
            key={item.id}
            item={item}
            showProject={showProject}
            dimmed={dimmedIds?.has(item.id)}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
