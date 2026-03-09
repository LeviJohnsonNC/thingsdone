import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from "framer-motion";
import { Star, Check, GripVertical, Repeat, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { useCompleteItem, useUpdateItem } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemEditorDrawer } from "./ItemEditorDrawer";
import { toast } from "sonner";
import type { ChecklistItem } from "@/components/ChecklistEditor";

interface ItemRowProps {
  item: Item;
  showProject?: boolean;
  dimmed?: boolean;
  dragHandleProps?: Record<string, any>;
  showSwipeHint?: boolean;
}

export function ItemRow({ item, showProject, dimmed, dragHandleProps, showSwipeHint }: ItemRowProps) {
  const { editingItemId, setEditingItemId } = useAppStore();
  const completeItem = useCompleteItem();
  const updateItem = useUpdateItem();
  const x = useMotionValue(0);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [completing, setCompleting] = useState(false);
  const hapticFiredRef = useRef(false);

  const isEditing = editingItemId === item.id;

  const bgRight = useTransform(x, [0, 80], ["hsl(96 60% 48% / 0)", "hsl(96 60% 48% / 1)"]);
  const bgLeft = useTransform(x, [-80, 0], ["hsl(36 90% 55% / 1)", "hsl(36 90% 55% / 0)"]);

  // Haptic feedback when crossing swipe threshold
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
    if (info.offset.x > 80) {
      setCompleting(true);
      setTimeout(() => {
        completeItem.mutate({ id: item.id, recurrence_rule: (item as any).recurrence_rule, title: item.title, user_id: item.user_id, scheduled_date: item.scheduled_date, project_id: item.project_id, area_id: item.area_id, energy: item.energy, time_estimate: item.time_estimate });
        toast.success("Completed!", {
          duration: 4000,
          action: {
            label: "Undo",
            onClick: () => {
              updateItem.mutate({ id: item.id, state: item.state, completed_at: null } as any);
              setCompleting(false);
            },
          },
        });
      }, 200);
    } else if (info.offset.x < -80) {
      updateItem.mutate({ id: item.id, is_focused: !item.is_focused });
      toast(item.is_focused ? "Removed from Focus" : "Added to Focus", { duration: 1500 });
    }
    setSwiping(null);
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = item.due_date && item.due_date < todayStr;

  const checklist = (item as any).checklist as ChecklistItem[] | null;
  const checklistTotal = checklist?.length ?? 0;
  const checklistDone = checklist?.filter(c => c.checked).length ?? 0;
  const hasRecurrence = !!(item as any).recurrence_rule;

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
              // Swipe hint animation for first-time users
              {...(showSwipeHint ? {
                animate: { x: [0, 50, 0, -40, 0] },
                transition: { duration: 1.8, delay: 0.8, ease: "easeInOut" },
              } : {})}
            >
              {/* Drag handle */}
              {dragHandleProps ? (
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCompleting(true);
                  setTimeout(() => {
                    completeItem.mutate({ id: item.id, recurrence_rule: (item as any).recurrence_rule, title: item.title, user_id: item.user_id, scheduled_date: item.scheduled_date, project_id: item.project_id, area_id: item.area_id, energy: item.energy, time_estimate: item.time_estimate });
                    toast.success("Completed!", {
                      duration: 4000,
                      action: {
                        label: "Undo",
                        onClick: () => {
                          updateItem.mutate({ id: item.id, state: item.state, completed_at: null } as any);
                          setCompleting(false);
                        },
                      },
                    });
                  }, 200);
                }}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border hover:border-success-green hover:bg-success-green/10 transition-colors"
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateItem.mutate({ id: item.id, is_focused: !item.is_focused });
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor — drawer on mobile, inline on desktop */}
      <AnimatePresence>
        {isEditing && <ItemEditorDrawer itemId={item.id} />}
      </AnimatePresence>
    </div>
  );
}
