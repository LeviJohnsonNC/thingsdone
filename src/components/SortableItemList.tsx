import { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItemRow } from "./SortableItemRow";
import { ItemRow } from "./ItemRow";
import { useReorderItems } from "@/hooks/useReorderItems";
import type { Item } from "@/lib/types";

interface SortableItemListProps {
  items: Item[];
  showProject?: boolean;
  dimmedIds?: Set<string>;
  orderField?: "sort_order" | "sort_order_project";
  showSwipeHintOnFirst?: boolean;
}

const measuring = {
  droppable: { strategy: MeasuringStrategy.Always },
};

export function SortableItemList({
  items,
  showProject,
  dimmedIds,
  orderField = "sort_order",
  showSwipeHintOnFirst,
}: SortableItemListProps) {
  const reorderItems = useReorderItems();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
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

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis]}
      measuring={measuring}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItemRow
            key={item.id}
            item={item}
            showProject={showProject}
            dimmed={dimmedIds?.has(item.id)}
            showSwipeHint={showSwipeHintOnFirst && index === 0}
          />
        ))}
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="shadow-lg rounded-lg bg-background opacity-90">
            <ItemRow item={activeItem} showProject={showProject} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
