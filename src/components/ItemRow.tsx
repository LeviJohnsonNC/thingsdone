import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { Star, Check, GripVertical, Repeat, ListChecks, AlertTriangle, Clock } from "lucide-react";
import { cn, parseLocalDate } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { useCompleteItem, useUpdateItem, useToggleFocus } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemEditorDrawer } from "./ItemEditorDrawer";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import type { ChecklistItem } from "@/components/ChecklistEditor";

interface ItemRowProps {
  item: Item;
  showProject?: boolean;
  dimmed?: boolean;
  dragHandleProps?: Record<string, any>;
  showSwipeHint?: boolean;
}

export function ItemRow({ item, showProject, dimmed, dragHandleProps, showSwipeHint }: ItemRowProps) {
  const { editingItemId, setEditingItemId, selectedItemIds, toggleSelectedItem } = useAppStore();
  const completeItem = useCompleteItem();
  const updateItem = useUpdateItem();
  const toggleFocus = useToggleFocus();
  const x = useMotionValue(0);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [completing, setCompleting] = useState(false);
  const hapticFiredRef = useRef(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isEditing = editingItemId === item.id;
  const isSelectionMode = selectedItemIds.length > 0;
  const isSelected = selectedItemIds.includes(item.id);

  const handleComplete = useCallback(() => {
    setCompleting(true);
    setTimeout(() => {
      completeItem.mutate({ id: item.id, recurrence_rule: item.recurrence_rule, title: item.title, user_id: item.user_id, scheduled_date: item.scheduled_date, project_id: item.project_id, area_id: item.area_id, energy: item.energy, time_estimate: item.time_estimate });
      toast.success("Completed!", {
        duration: 4000,
        action: {
          label: "Undo",
          onClick: () => {
            updateItem.mutate({ id: item.id, state: item.state, completed_at: null });
            setCompleting(false);
          },
        },
      });
    }, 200);
  }, [item, completeItem, updateItem]);

  const bgRight = useTransform(x, [0, 80], ["hsl(96 60% 48% / 0)", "hsl(96 60% 48% / 1)"]);
  const bgLeft = useTransform(x, [-80, 0], ["hsl(36 90% 55% / 1)", "hsl(36 90% 55% / 0)"]);

  useEffect(() => {
    const unsubscribe = x.on("change", (latest) => {
      const crossedThreshold = Math.abs(latest) >= 80;
      if (crossedThreshold && !hapticFiredRef.current) {
        hapticFiredRef.current = true;
        if (navigator.vibrate) navigator.vibrate(10);
      } else if (!crossedThreshold) {
        hapticFiredRef.current = false;
      }
    });
    return unsubscribe;
  }, [x]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (isSelectionMode) return;
    if (info.offset.x > 80) {
      handleComplete();
    } else if (info.offset.x < -80) {
      toggleFocus.mutate({ id: item.id, is_focused: !item.is_focused });
      toast(item.is_focused ? "Removed from Focus" : "Added to Focus", { duration: 1500 });
    }
    setSwiping(null);
  };

  const handlePointerDown = useCallback(() => {
    if (isSelectionMode) return;
    longPressTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(15);
      toggleSelectedItem(item.id);
    }, 500);
  }, [isSelectionMode, item.id, toggleSelectedItem]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isSelectionMode) {
      e.stopPropagation();
      toggleSelectedItem(item.id);
      return;
    }
    // Shift+click enters selection mode
    if (e.shiftKey) {
      e.stopPropagation();
      toggleSelectedItem(item.id);
      return;
    }
    setEditingItemId(isEditing ? null : item.id);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = item.due_date && item.due_date < todayStr;
  const isDueToday = item.due_date === todayStr;

  const checklist = item.checklist as unknown as ChecklistItem[] | null;
  const checklistTotal = checklist?.length ?? 0;
  const checklistDone = checklist?.filter(c => c.checked).length ?? 0;
  const hasRecurrence = !!item.recurrence_rule;

  return (
    <div>
      <AnimatePresence>
        {!completing && (
          <motion.div
            className="relative overflow-hidden"
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Swipe backgrounds */}
            {!isSelectionMode && (
              <>
                <motion.div className="absolute inset-0 flex items-center px-4" style={{ backgroundColor: bgRight }}>
                  <Check className="h-5 w-5 text-primary-foreground" />
                </motion.div>
                <motion.div className="absolute inset-0 flex items-center justify-end px-4" style={{ backgroundColor: bgLeft }}>
                  <Star className="h-5 w-5 text-primary-foreground" />
                </motion.div>
              </>
            )}

            <motion.div
              drag={isSelectionMode ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={handleDragEnd}
              style={{ x: isSelectionMode ? undefined : x }}
              onDrag={(_, info) => {
                setSwiping(info.offset.x > 20 ? "right" : info.offset.x < -20 ? "left" : null);
              }}
              className={cn(
                "relative flex items-center gap-2 bg-card px-2 py-3 border-b border-border cursor-pointer transition-all",
                dimmed && "opacity-50",
                isEditing && "bg-accent/50",
                isSelected && "bg-primary/5 border-l-2 border-l-primary"
              )}
              onClick={handleClick}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              {...(showSwipeHint && !isSelectionMode ? {
                animate: { x: [0, 50, 0, -40, 0] },
                transition: { duration: 1.8, delay: 0.8, ease: "easeInOut" },
              } : {})}
            >
              {/* Selection checkbox or drag handle */}
              {isSelectionMode ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelectedItem(item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 ml-1"
                />
              ) : dragHandleProps ? (
                <button
                  {...dragHandleProps}
                  className="flex items-center justify-center shrink-0 touch-none cursor-grab active:cursor-grabbing p-1 -ml-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                </button>
              ) : (
                <div className="w-5" />
              )}

              {/* Complete circle */}
              {!isSelectionMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete();
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border hover:border-success-green hover:bg-success-green/10 transition-colors"
                />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.due_date && isOverdue && (
                    <span className="inline-flex items-center gap-1 text-xs bg-overdue-red/10 text-overdue-red rounded-full px-1.5 py-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      {parseLocalDate(item.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  )}
                  {item.due_date && isDueToday && (
                    <span className="inline-flex items-center gap-1 text-xs bg-due-today/10 text-due-today rounded-full px-1.5 py-0.5">
                      <Clock className="h-3 w-3" />
                      Today
                    </span>
                  )}
                  {item.due_date && !isOverdue && !isDueToday && (
                    <span className="text-xs text-muted-foreground">
                      {parseLocalDate(item.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  )}
                  {item.time_estimate && (
                    <span className="text-xs text-muted-foreground">
                      {item.time_estimate >= 60 ? `${Math.round(item.time_estimate / 60 * 10) / 10}h` : `${item.time_estimate}m`}
                    </span>
                  )}
                  {hasRecurrence && (
                    <Repeat className="h-3 w-3 text-muted-foreground/60" />
                  )}
                  {checklistTotal > 0 && (
                    <span className={cn("text-xs flex items-center gap-0.5", checklistDone === checklistTotal ? "text-success-green" : "text-muted-foreground")}>
                      <ListChecks className="h-3 w-3" />
                      {checklistDone}/{checklistTotal}
                    </span>
                  )}
                </div>
              </div>

              {/* Star */}
              {!isSelectionMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFocus.mutate({ id: item.id, is_focused: !item.is_focused });
                  }}
                  className="shrink-0 p-1.5"
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && !isSelectionMode && <ItemEditorDrawer itemId={item.id} />}
      </AnimatePresence>
    </div>
  );
}
