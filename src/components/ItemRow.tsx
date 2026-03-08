import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { Star, Check, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { useCompleteItem, useUpdateItem } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemEditor } from "./ItemEditor";

interface ItemRowProps {
  item: Item;
  showProject?: boolean;
  dimmed?: boolean;
  dragHandleProps?: Record<string, any>;
}

export function ItemRow({ item, showProject, dimmed, dragHandleProps }: ItemRowProps) {
  const { editingItemId, setEditingItemId } = useAppStore();
  const completeItem = useCompleteItem();
  const updateItem = useUpdateItem();
  const x = useMotionValue(0);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);

  const isEditing = editingItemId === item.id;

  const bgRight = useTransform(x, [0, 80], ["hsl(96 60% 48% / 0)", "hsl(96 60% 48% / 1)"]);
  const bgLeft = useTransform(x, [-80, 0], ["hsl(36 90% 55% / 1)", "hsl(36 90% 55% / 0)"]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 80) {
      completeItem.mutate(item.id);
    } else if (info.offset.x < -80) {
      updateItem.mutate({ id: item.id, is_focused: !item.is_focused });
    }
    setSwiping(null);
  };

  const isOverdue = item.due_date && new Date(item.due_date) < new Date();

  return (
    <div>
      <div className="relative overflow-hidden">
        {/* Swipe backgrounds */}
        <motion.div className="absolute inset-0 flex items-center px-4" style={{ backgroundColor: bgRight }}>
          <Check className="h-5 w-5 text-primary-foreground" />
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-end px-4" style={{ backgroundColor: bgLeft }}>
          <Star className="h-5 w-5 text-primary-foreground" />
        </motion.div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragEnd={handleDragEnd}
          style={{ x }}
          onDrag={(_, info) => {
            setSwiping(info.offset.x > 20 ? "right" : info.offset.x < -20 ? "left" : null);
          }}
          className={cn(
            "relative flex items-center gap-2 bg-card px-2 py-3 border-b border-border cursor-pointer transition-opacity",
            dimmed && "opacity-50",
            isEditing && "bg-accent/50"
          )}
          onClick={() => setEditingItemId(isEditing ? null : item.id)}
        >
          {/* Drag handle */}
          {dragHandleProps ? (
            <button
              {...dragHandleProps}
              className="flex items-center justify-center shrink-0 touch-none cursor-grab active:cursor-grabbing p-0.5 -ml-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          {/* Complete circle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              completeItem.mutate(item.id);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-border hover:border-success-green hover:bg-success-green/10 transition-colors"
          />

          <div className="flex-1 min-w-0">
            <p className={cn("text-sm truncate", isOverdue && "text-overdue-red")}>
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {item.due_date && (
                <span className={cn("text-xs", isOverdue ? "text-overdue-red" : "text-muted-foreground")}>
                  {new Date(item.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              )}
              {item.time_estimate && (
                <span className="text-xs text-muted-foreground">
                  {item.time_estimate >= 60 ? `${item.time_estimate / 60}h` : `${item.time_estimate}m`}
                </span>
              )}
            </div>
          </div>

          {/* Star */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateItem.mutate({ id: item.id, is_focused: !item.is_focused });
            }}
            className="shrink-0 p-1"
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                item.is_focused
                  ? "fill-focus-gold text-focus-gold"
                  : "text-muted-foreground/30 hover:text-muted-foreground"
              )}
            />
          </button>
        </motion.div>
      </div>

      {/* Inline editor */}
      <AnimatePresence>
        {isEditing && <ItemEditor itemId={item.id} />}
      </AnimatePresence>
    </div>
  );
}
