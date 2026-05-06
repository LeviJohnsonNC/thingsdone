import { useEffect, useState, useRef, useCallback } from "react";
import { Star, CalendarIcon, Trash2, Check, Zap } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useItem, useUpdateItem, useCompleteItem, useDeleteItem } from "@/hooks/useItems";
import { useGoogleCalendarStatus, usePushItemToCalendar, useDeleteCalendarEvent } from "@/hooks/useGoogleCalendar";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";
import { ChecklistEditor, type ChecklistItem } from "@/components/ChecklistEditor";
import { ItemTagEditor } from "@/components/editor/ItemTagEditor";
import { ItemDates } from "@/components/editor/ItemDates";
import { ItemProperties } from "@/components/editor/ItemProperties";
import { ItemCalendarToggle } from "@/components/editor/ItemCalendarToggle";
import { toast } from "sonner";
import inboxIcon from "@/assets/icons/inbox.svg";
import nextIcon from "@/assets/icons/next.svg";
import waitingIcon from "@/assets/icons/waiting.svg";
import scheduledIcon from "@/assets/icons/scheduled.svg";
import somedayIcon from "@/assets/icons/someday.svg";

const STATE_CONFIG: Record<string, { label: string; icon: string; activeClass: string; borderClass: string; bgClass: string }> = {
  inbox: { label: "Inbox", icon: inboxIcon, activeClass: "bg-muted text-foreground border-border", borderClass: "border-border", bgClass: "hover:bg-muted/60" },
  next: { label: "Next", icon: nextIcon, activeClass: "bg-primary/10 text-primary border-primary", borderClass: "border-primary", bgClass: "hover:bg-primary/5" },
  waiting: { label: "Waiting", icon: waitingIcon, activeClass: "bg-focus-gold/10 text-focus-gold border-focus-gold", borderClass: "border-focus-gold", bgClass: "hover:bg-focus-gold/5" },
  someday: { label: "Someday", icon: somedayIcon, activeClass: "bg-purple-100 text-purple-700 border-purple-400 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500", borderClass: "border-purple-400 dark:border-purple-500", bgClass: "hover:bg-purple-50 dark:hover:bg-purple-900/20" },
  scheduled: { label: "Scheduled", icon: scheduledIcon, activeClass: "bg-emerald-100 text-emerald-700 border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500", borderClass: "border-emerald-400 dark:border-emerald-500", bgClass: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
  reference: { label: "Reference", icon: somedayIcon, activeClass: "bg-slate-100 text-slate-700 border-slate-400 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-500", borderClass: "border-slate-400 dark:border-slate-500", bgClass: "hover:bg-slate-50 dark:hover:bg-slate-900/20" },
};

const GTD_STATES = ["inbox", "next", "waiting", "scheduled", "someday", "reference"] as const;

interface ItemEditorProps {
  itemId: string;
}

export function ItemEditor({ itemId }: ItemEditorProps) {
  const { setEditingItemId } = useAppStore();
  const { data: item } = useItem(itemId);
  const updateItem = useUpdateItem();
  const completeItem = useCompleteItem();
  const deleteItem = useDeleteItem();
  const { data: calendarToken } = useGoogleCalendarStatus();
  const pushToCalendar = usePushItemToCalendar();
  const deleteCalendarEvent = useDeleteCalendarEvent();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const isCalendarConnected = !!calendarToken;
  const hasDate = !!(item?.scheduled_date || item?.due_date);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes ?? "");
      setAddToCalendar(!!item.google_event_id);
    }
  }, [item]);

  const autoResize = useCallback(() => {
    const el = notesRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  useEffect(() => { autoResize(); }, [notes, autoResize]);

  // Debounced field save: batches rapid changes into one mutation
  const pendingRef = useRef<Partial<Item>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const pending = pendingRef.current;
    if (Object.keys(pending).length === 0) return;
    pendingRef.current = {};
    updateItem.mutate({ id: itemId, ...pending });
  }, [itemId, updateItem]);

  useEffect(() => () => { flushSave(); }, [flushSave]);

  if (!item) return null;

  const currentState = item.state as string;
  const stateConfig = STATE_CONFIG[currentState] ?? STATE_CONFIG.inbox;

  const saveField = (field: keyof Item, value: Item[keyof Item]) => {
    pendingRef.current = { ...pendingRef.current, [field]: value };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flushSave, 300);
  };

  const handleStateChange = (state: string) => {
    saveField("state", state);
    flushSave();
  };

  const handleDateChange = (field: "scheduled_date" | "due_date", d: Date | undefined) => {
    const value = d ? format(d, "yyyy-MM-dd") : null;
    saveField(field, value);
    if (addToCalendar && isCalendarConnected && value) {
      pushToCalendar.mutate(
        { action: "upsert", item_id: item.id, title: title || item.title, date: value, notes: notes || item.notes || undefined, google_event_id: item.google_event_id },
        { onError: () => toast.error("Failed to sync with Google Calendar") }
      );
    }
  };

  const handleComplete = () => {
    if (item.google_event_id) {
      deleteCalendarEvent.mutate({ item_id: item.id, google_event_id: item.google_event_id });
    }
    completeItem.mutate({
      id: item.id, recurrence_rule: item.recurrence_rule, title: item.title,
      user_id: item.user_id, scheduled_date: item.scheduled_date, project_id: item.project_id,
      area_id: item.area_id, energy: item.energy, time_estimate: item.time_estimate,
    });
    setEditingItemId(null);
  };

  const handleDelete = () => {
    if (item.google_event_id) {
      deleteCalendarEvent.mutate({ item_id: item.id, google_event_id: item.google_event_id });
    }
    deleteItem.mutate(item.id);
    setEditingItemId(null);
  };

  const handleCalendarToggle = (checked: boolean) => {
    setAddToCalendar(checked);
    const date = item.scheduled_date || item.due_date;
    if (checked && date && isCalendarConnected) {
      pushToCalendar.mutate(
        { action: "upsert", item_id: item.id, title: title || item.title, date, notes: notes || item.notes || undefined, google_event_id: item.google_event_id },
        { onSuccess: () => toast.success("Added to Google Calendar"), onError: () => toast.error("Failed to sync with Google Calendar") }
      );
    } else if (!checked && item.google_event_id) {
      deleteCalendarEvent.mutate(
        { item_id: item.id, google_event_id: item.google_event_id },
        { onSuccess: () => toast.success("Removed from Google Calendar"), onError: () => toast.error("Failed to remove from Google Calendar") }
      );
    }
  };

  const handleBlurTitle = () => {
    if (title !== item.title) { saveField("title", title); flushSave(); }
  };

  const handleBlurNotes = () => {
    if (notes !== (item.notes ?? "")) { saveField("notes", notes); flushSave(); }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="mx-2 mb-2 space-y-2">
        {/* GTD State Pill Selector */}
        <div className="flex flex-wrap gap-1.5 px-1 pt-2">
          {GTD_STATES.map((s) => {
            const cfg = STATE_CONFIG[s];
            const isActive = currentState === s;
            return (
              <button
                key={s}
                onClick={() => handleStateChange(s)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all duration-150",
                  isActive ? cfg.activeClass : "border-transparent text-muted-foreground " + cfg.bgClass
                )}
              >
                <img src={cfg.icon} alt={cfg.label} className="h-4 w-4" />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="border border-border rounded-xl bg-card shadow-sm">
          {/* Title Row */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <button
              onClick={handleComplete}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150",
                stateConfig.borderClass, "hover:bg-primary/10"
              )}
              title="Mark complete"
            >
              <Check className="h-3 w-3 opacity-0 hover:opacity-40 transition-opacity" />
            </button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlurTitle}
              className="text-lg font-semibold border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-0"
              placeholder="What needs to be done?"
              autoFocus
            />
            <button onClick={() => saveField("is_focused", !item.is_focused)} className="shrink-0 p-1">
              <Star className={cn("h-5 w-5 transition-colors duration-150", item.is_focused ? "fill-focus-gold text-focus-gold" : "text-muted-foreground/30 hover:text-muted-foreground")} />
            </button>
          </div>

          {/* Notes */}
          <div className="px-4 pl-[52px]">
            <textarea
              ref={notesRef}
              value={notes}
              onChange={(e) => { setNotes(e.target.value); autoResize(); }}
              onBlur={handleBlurNotes}
              placeholder="Add notes…"
              className="w-full resize-none bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 border-0 outline-none focus:ring-0 min-h-[2.5rem]"
              rows={2}
            />
          </div>

          {/* Checklist */}
          <div className="px-4 pl-[52px] pb-2">
            <ChecklistEditor
              checklist={(item.checklist as unknown as ChecklistItem[]) ?? []}
              onChange={(cl) => saveField("checklist", cl as never)}
            />
          </div>

          {/* Two-Minute Rule Nudge */}
          {item.time_estimate && item.time_estimate <= 5 && currentState === "inbox" && (
            <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-focus-gold/10 border border-focus-gold/30 flex items-center gap-2">
              <Zap className="h-4 w-4 text-focus-gold shrink-0" />
              <p className="text-xs text-foreground">
                <strong>Two-minute rule:</strong> This is quick — do it now instead of filing it!
              </p>
            </div>
          )}

          <ItemTagEditor itemId={itemId} />

          <div className="border-t border-border/60 mx-4" />

          {/* Properties */}
          <ItemProperties
            item={item}
            currentState={currentState}
            saveField={saveField}
            onStateChange={handleStateChange}
          />

          {/* Dates */}
          <div className="px-4 pb-3">
            <ItemDates
              dueDate={item.due_date}
              scheduledDate={item.scheduled_date}
              onDateChange={handleDateChange}
            />
          </div>

          {/* Google Calendar toggle */}
          {isCalendarConnected && hasDate && (
            <div className="px-4 pb-3">
              <ItemCalendarToggle
                itemId={item.id}
                checked={addToCalendar}
                disabled={pushToCalendar.isPending}
                onCheckedChange={handleCalendarToggle}
              />
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end px-4 py-3 bg-muted/40 border-t border-border/60 rounded-b-xl">
            <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all duration-150"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{item.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
