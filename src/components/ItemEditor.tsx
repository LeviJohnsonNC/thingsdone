import { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Star, CalendarIcon, Trash2, X, Plus, Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
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
import { TIME_ESTIMATE_OPTIONS, ENERGY_OPTIONS } from "@/lib/types";
import type { ItemState, EnergyLevel } from "@/lib/types";
import { toast } from "sonner";
import inboxIcon from "@/assets/icons/inbox.svg";
import nextIcon from "@/assets/icons/next.svg";
import waitingIcon from "@/assets/icons/waiting.svg";
import scheduledIcon from "@/assets/icons/scheduled.svg";
import somedayIcon from "@/assets/icons/someday.svg";
import timeEstIcon from "@/assets/icons/time-est.svg";
import energyIcon from "@/assets/icons/energy.svg";
import dueIcon from "@/assets/icons/due.svg";
import projectIcon from "@/assets/icons/project.svg";
import areaIcon from "@/assets/icons/area.svg";

// State config with accent colors (HSL values matching design system)
const STATE_CONFIG: Record<string, { label: string; icon: string; activeClass: string; borderClass: string; bgClass: string }> = {
  inbox: { label: "Inbox", icon: inboxIcon, activeClass: "bg-muted text-foreground border-border", borderClass: "border-border", bgClass: "hover:bg-muted/60" },
  next: { label: "Next", icon: nextIcon, activeClass: "bg-primary/10 text-primary border-primary", borderClass: "border-primary", bgClass: "hover:bg-primary/5" },
  waiting: { label: "Waiting", icon: waitingIcon, activeClass: "bg-focus-gold/10 text-focus-gold border-focus-gold", borderClass: "border-focus-gold", bgClass: "hover:bg-focus-gold/5" },
  someday: { label: "Someday", icon: somedayIcon, activeClass: "bg-purple-100 text-purple-700 border-purple-400 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500", borderClass: "border-purple-400 dark:border-purple-500", bgClass: "hover:bg-purple-50 dark:hover:bg-purple-900/20" },
  scheduled: { label: "Scheduled", icon: scheduledIcon, activeClass: "bg-emerald-100 text-emerald-700 border-emerald-400 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-500", borderClass: "border-emerald-400 dark:border-emerald-500", bgClass: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" },
};

const GTD_STATES = ["inbox", "next", "waiting", "scheduled", "someday"] as const;

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
  const [waitingOn, setWaitingOn] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const isCalendarConnected = !!calendarToken;
  const hasDate = !!(item?.scheduled_date || item?.due_date);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes ?? "");
      setWaitingOn((item as any).waiting_on ?? "");
      setAddToCalendar(!!item.google_event_id);
    }
  }, [item]);

  // Auto-resize notes textarea
  const autoResize = useCallback(() => {
    const el = notesRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);

  useEffect(() => { autoResize(); }, [notes, autoResize]);

  if (!item) return null;

  const currentState = item.state as string;
  const stateConfig = STATE_CONFIG[currentState] ?? STATE_CONFIG.inbox;

  const saveField = (field: string, value: any) => {
    updateItem.mutate({ id: item.id, [field]: value } as any);
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

  const handleStateChange = (state: string) => {
    updateItem.mutate({ id: item.id, state } as any);
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
    const updates: any = {};
    if (title !== item.title) updates.title = title;
    if (notes !== (item.notes ?? "")) updates.notes = notes;
    if (waitingOn !== ((item as any).waiting_on ?? "")) updates.waiting_on = waitingOn;
    if (Object.keys(updates).length > 0) {
      updateItem.mutate({ id: item.id, ...updates });
    }
    setEditingItemId(null);
  };

  const handleCancel = () => {
    setEditingItemId(null);
  };

  const activeTagIds = itemTagIds ?? [];
  const activeTags = tags?.filter((t) => activeTagIds.includes(t.id)) ?? [];
  const availableTags = tags?.filter((t) => !activeTagIds.includes(t.id)) ?? [];
  const energy = (item as any).energy as EnergyLevel | null;

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
                  isActive
                    ? cfg.activeClass
                    : "border-transparent text-muted-foreground " + cfg.bgClass
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
            {/* Completion circle */}
            <button
              onClick={handleComplete}
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150",
                stateConfig.borderClass,
                "hover:bg-primary/10"
              )}
              title="Mark complete"
            >
              <Check className="h-3 w-3 opacity-0 hover:opacity-40 transition-opacity" />
            </button>

            {/* Title input */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-semibold border-0 px-0 focus-visible:ring-0 shadow-none h-auto py-0"
              placeholder="What needs to be done?"
              autoFocus
            />

            {/* Star toggle */}
            <button
              onClick={() => saveField("is_focused", !item.is_focused)}
              className="shrink-0 p-1"
            >
              <Star
                className={cn(
                  "h-5 w-5 transition-colors duration-150",
                  item.is_focused
                    ? "fill-focus-gold text-focus-gold"
                    : "text-muted-foreground/30 hover:text-muted-foreground"
                )}
              />
            </button>
          </div>

          {/* Notes - auto-expanding, indented past the circle */}
          <div className="px-4 pl-[52px]">
            <textarea
              ref={notesRef}
              value={notes}
              onChange={(e) => { setNotes(e.target.value); autoResize(); }}
              placeholder="Add notes…"
              className="w-full resize-none bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground/50 border-0 outline-none focus:ring-0 min-h-[2.5rem]"
              rows={2}
            />
          </div>

          {/* Context Tags */}
          <div className="px-4 pl-[52px] pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {activeTags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {tag.name}
                  <button
                    onClick={() => toggleTag(tag.id)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {availableTags.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary text-muted-foreground/40 hover:text-primary transition-colors duration-150">
                      <Plus className="h-3 w-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="flex flex-col gap-1">
                      {availableTags.map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className="text-left text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                        >
                          {tag.name}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/60 mx-4" />

          {/* Properties Grid */}
          <div className="p-4 space-y-3">
            {/* Time Estimate + Energy - side by side */}
            <div className="flex gap-4">
              <PropertyRow icon={timeEstIcon} label="TIME EST." className="flex-1">
                <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
                  <SegmentButton
                    active={!item.time_estimate}
                    onClick={() => saveField("time_estimate", null)}
                  >
                    —
                  </SegmentButton>
                  {TIME_ESTIMATE_OPTIONS.map((opt) => (
                    <SegmentButton
                      key={opt.value}
                      active={item.time_estimate === opt.value}
                      onClick={() => saveField("time_estimate", opt.value)}
                    >
                      {opt.label}
                    </SegmentButton>
                  ))}
                </div>
              </PropertyRow>

              <PropertyRow icon={energyIcon} label="ENERGY" className="flex-1">
                <div className="flex bg-muted rounded-lg p-0.5 gap-0.5">
                  <SegmentButton
                    active={!energy}
                    onClick={() => saveField("energy", null)}
                  >
                    —
                  </SegmentButton>
                  {ENERGY_OPTIONS.map((opt) => (
                    <SegmentButton
                      key={opt.value}
                      active={energy === opt.value}
                      onClick={() => saveField("energy", opt.value)}
                    >
                      <span className="flex items-center gap-1">
                        {energy === opt.value && (
                          <span className={cn("h-1.5 w-1.5 rounded-full", opt.dot)} />
                        )}
                        {opt.label}
                      </span>
                    </SegmentButton>
                  ))}
                </div>
              </PropertyRow>
            </div>

            {/* Due + Scheduled - side by side */}
            <div className="flex gap-4">
              <PropertyRow icon={dueIcon} label="DUE" className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal text-sm h-8 px-2 w-full",
                        !item.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      {item.due_date ? format(new Date(item.due_date), "MMM d, yyyy") : "No due date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.due_date ? new Date(item.due_date) : undefined}
                      onSelect={(d) => handleDateChange("due_date", d)}
                      className="p-3 pointer-events-auto"
                    />
                    {item.due_date && (
                      <div className="border-t p-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => handleDateChange("due_date", undefined)}>
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </PropertyRow>

              <PropertyRow icon={scheduledIcon} label="SCHEDULED" className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "justify-start text-left font-normal text-sm h-8 px-2 w-full",
                        !item.scheduled_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                      {item.scheduled_date ? format(new Date(item.scheduled_date), "MMM d, yyyy") : "Not scheduled"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={item.scheduled_date ? new Date(item.scheduled_date) : undefined}
                      onSelect={(d) => handleDateChange("scheduled_date", d)}
                      className="p-3 pointer-events-auto"
                    />
                    {item.scheduled_date && (
                      <div className="border-t p-2">
                        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => handleDateChange("scheduled_date", undefined)}>
                          Clear date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </PropertyRow>
            </div>

            {/* Project + Area - side by side */}
            <div className="flex gap-4">
              <PropertyRow icon={projectIcon} label="PROJECT" className="flex-1">
                <Select
                  value={item.project_id ?? "none"}
                  onValueChange={(v) => saveField("project_id", v === "none" ? null : v)}
                >
                  <SelectTrigger className="h-8 text-sm border-0 shadow-none px-2 bg-transparent">
                    <SelectValue placeholder="No project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {projects?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PropertyRow>

              <PropertyRow icon={areaIcon} label="AREA" className="flex-1">
                <Select
                  value={item.area_id ?? "none"}
                  onValueChange={(v) => saveField("area_id", v === "none" ? null : v)}
                >
                  <SelectTrigger className="h-8 text-sm border-0 shadow-none px-2 bg-transparent">
                    <SelectValue placeholder="No area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No area</SelectItem>
                    {areas?.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PropertyRow>
            </div>

            {/* Google Calendar toggle */}
            {isCalendarConnected && hasDate && (
              <PropertyRow icon="📆" label="CALENDAR">
                <div className="flex items-center gap-2 px-2">
                  <Switch
                    id={`gcal-${item.id}`}
                    checked={addToCalendar}
                    onCheckedChange={handleCalendarToggle}
                    disabled={pushToCalendar.isPending}
                    className="scale-90"
                  />
                  <Label htmlFor={`gcal-${item.id}`} className="text-sm text-muted-foreground cursor-pointer">
                    Google Calendar
                  </Label>
                </div>
              </PropertyRow>
            )}

            {/* Waiting On - conditional */}
            <AnimatePresence>
              {currentState === "waiting" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <PropertyRow icon="👤" label="WAITING ON">
                    <Input
                      value={waitingOn}
                      onChange={(e) => setWaitingOn(e.target.value)}
                      placeholder="Who are you waiting on?"
                      className="h-8 text-sm border-0 shadow-none px-2 bg-transparent focus-visible:ring-0"
                    />
                  </PropertyRow>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-t border-border/60 rounded-b-xl">
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="font-semibold">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all duration-150"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper: Property row with label
function PropertyRow({ icon, label, children, className }: { icon: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="w-[100px] shrink-0 flex items-center gap-1.5">
        <img src={icon} alt={label} className="h-3.5 w-3.5 opacity-60" />
        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// Helper: Segmented control button
function SegmentButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
