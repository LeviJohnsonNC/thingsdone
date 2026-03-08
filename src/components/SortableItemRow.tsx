import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { ItemRow } from "./ItemRow";
import type { Item } from "@/lib/types";

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
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
