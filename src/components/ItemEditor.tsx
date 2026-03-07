import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Star, CalendarIcon, Trash2, RotateCcw, Clock, Flag, FolderOpen, Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useItems, useUpdateItem, useCompleteItem, useDeleteItem } from "@/hooks/useItems";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { useTags, useItemTags, useSetItemTags } from "@/hooks/useTags";
import { useGoogleCalendarStatus, usePushItemToCalendar, useDeleteCalendarEvent } from "@/hooks/useGoogleCalendar";
import { useAppStore } from "@/stores/appStore";
import { cn } from "@/lib/utils";
import { ITEM_STATE_OPTIONS, TIME_ESTIMATE_OPTIONS } from "@/lib/types";
import type { ItemState } from "@/lib/types";
import { toast } from "sonner";

interface ItemEditorProps {
  itemId: string;
}

export function ItemEditor({ itemId }: ItemEditorProps) {
  const { setEditingItemId } = useAppStore();
  const { data: allItems } = useItems();
  const item = allItems?.find((i) => i.id === itemId);
  const updateItem = useUpdateItem();
  const completeItem = useCompleteItem();
  const deleteItem = useDeleteItem();
  const { data: projects } = useProjects("active");
  const { data: areas } = useAreas();
  const { data: tags } = useTags();
  const { data: itemTagIds } = useItemTags(itemId);
  const setItemTags = useSetItemTags();
  const { data: calendarToken } = useGoogleCalendarStatus();
  const pushToCalendar = usePushItemToCalendar();
  const deleteCalendarEvent = useDeleteCalendarEvent();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);

  const isCalendarConnected = !!calendarToken;
  const hasDate = !!(item?.scheduled_date || item?.due_date);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes ?? "");
      setAddToCalendar(!!item.google_event_id);
    }
  }, [item]);

  if (!item) return null;

  const saveField = (field: string, value: any) => {
    updateItem.mutate({ id: item.id, [field]: value });
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

  const handleStateChange = (state: ItemState) => {
    updateItem.mutate({ id: item.id, state });
  };

  const handleComplete = () => {
    if (item.google_event_id) {
      deleteCalendarEvent.mutate({ item_id: item.id, google_event_id: item.google_event_id });
    }
    completeItem.mutate(item.id);
    setEditingItemId(null);
  };

  const handleDelete = () => {
    if (item.google_event_id) {
      deleteCalendarEvent.mutate({ item_id: item.id, google_event_id: item.google_event_id });
    }
    deleteItem.mutate(item.id);
    setEditingItemId(null);
  };

  const handleReactivate = () => {
    updateItem.mutate({ id: item.id, state: "inbox", completed_at: null });
  };

  const toggleTag = (tagId: string) => {
    const current = itemTagIds ?? [];
    const next = current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId];
    setItemTags.mutate({ itemId: item.id, tagIds: next });
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

  const handleSave = () => {
    if (title !== item.title) saveField("title", title);
    if (notes !== (item.notes ?? "")) saveField("notes", notes);
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setEditingItemId(null);
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div className="border border-border rounded-lg bg-card mx-2 mb-2 shadow-sm">
        <div className="flex flex-col md:flex-row">
          {/* Left column: title, tags, notes */}
          <div className="flex-1 p-4 space-y-3 min-w-0">
            {/* Title row with star */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveField("is_focused", !item.is_focused)}
                className="shrink-0 p-1"
              >
                <Star
                  className={cn(
                    "h-5 w-5 transition-colors",
                    item.is_focused
                      ? "fill-focus-gold text-focus-gold"
                      : "text-muted-foreground/30 hover:text-muted-foreground"
                  )}
                />
              </button>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => title !== item.title && saveField("title", title)}
                className="text-base font-medium border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-1"
                placeholder="Item title"
                autoFocus
              />
              <button
                onClick={handleCancel}
                className="shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={itemTagIds?.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Notes */}
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== (item.notes ?? "") && saveField("notes", notes)}
              placeholder="Add notes…"
              className="min-h-[80px] resize-none text-sm"
            />

            {/* Google Calendar toggle */}
            {isCalendarConnected && hasDate && (
              <div className="flex items-center gap-2 text-sm">
                <Switch
                  id={`gcal-${item.id}`}
                  checked={addToCalendar}
                  onCheckedChange={handleCalendarToggle}
                  disabled={pushToCalendar.isPending}
                  className="scale-90"
                />
                <Label htmlFor={`gcal-${item.id}`} className="text-xs text-muted-foreground cursor-pointer">
                  Add to Google Calendar
                </Label>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <div className="flex-1" />
              {item.state === "completed" ? (
                <Button size="sm" variant="outline" onClick={handleReactivate}>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reactivate
                </Button>
              ) : (
                <Button size="sm" className="bg-success-green hover:bg-success-green/90" onClick={handleComplete}>
                  Complete
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Right column: metadata selectors */}
          <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-border p-3 space-y-2.5 bg-muted/30">
            {/* Time estimate */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Time
              </div>
              <Select
                value={item.time_estimate?.toString() ?? "none"}
                onValueChange={(v) => saveField("time_estimate", v === "none" ? null : parseInt(v))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {TIME_ESTIMATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due date */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Flag className="h-3.5 w-3.5" />
                Due
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal text-xs h-8", !item.due_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3 w-3" />
                    {item.due_date ? format(new Date(item.due_date), "MMM d") : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.due_date ? new Date(item.due_date) : undefined}
                    onSelect={(d) => handleDateChange("due_date", d)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Scheduled date */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarIcon className="h-3.5 w-3.5" />
                Scheduled
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal text-xs h-8", !item.scheduled_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-1.5 h-3 w-3" />
                    {item.scheduled_date ? format(new Date(item.scheduled_date), "MMM d") : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.scheduled_date ? new Date(item.scheduled_date) : undefined}
                    onSelect={(d) => handleDateChange("scheduled_date", d)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* State */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                State
              </div>
              <Select
                value={item.state}
                onValueChange={(v) => handleStateChange(v as ItemState)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbox">Inbox</SelectItem>
                  {ITEM_STATE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FolderOpen className="h-3.5 w-3.5" />
                Project
              </div>
              <Select
                value={item.project_id ?? "none"}
                onValueChange={(v) => saveField("project_id", v === "none" ? null : v)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Standalone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Standalone</SelectItem>
                  {projects?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            {areas && areas.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" />
                  Area
                </div>
                <Select
                  value={item.area_id ?? "none"}
                  onValueChange={(v) => saveField("area_id", v === "none" ? null : v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {areas.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
