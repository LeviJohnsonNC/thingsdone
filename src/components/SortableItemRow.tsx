import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ItemRow } from "./ItemRow";
import type { Item } from "@/lib/types";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;
  // Suppress layout animation right after a drop to prevent clash with optimistic re-render
  if (wasDragging) return false;
  return defaultAnimateLayoutChanges(args);
};

interface SortableItemRowProps {
  item: Item;
  showProject?: boolean;
  dimmed?: boolean;
}

export function SortableItemRow({ item, showProject, dimmed }: SortableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, animateLayoutChanges });

  const style = {
    transform: CSS.Translate.toString(transform),
    // Only apply transition while actively dragging; skip post-drop to avoid jitter
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ItemRow
        item={item}
        showProject={showProject}
        dimmed={dimmed}
        dragHandleProps={{ ...attributes, ...listeners, ref: setActivatorNodeRef }}
      />
    </div>
  );
}
