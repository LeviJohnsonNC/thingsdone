import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, RotateCcw } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/stores/appStore";
import { useItems, useUpdateItem, useCompleteItem, useDeleteItem } from "@/hooks/useItems";
import { useProjects } from "@/hooks/useProjects";
import { useAreas } from "@/hooks/useAreas";
import { useTags, useItemTags, useSetItemTags } from "@/hooks/useTags";
import { cn } from "@/lib/utils";
import { ITEM_STATE_OPTIONS, TIME_ESTIMATE_OPTIONS } from "@/lib/types";
import type { ItemState } from "@/lib/types";

export function ClarifySheet() {
  const { clarifyItemId, setClarifyItemId } = useAppStore();
  const { data: allItems } = useItems();
  const item = allItems?.find((i) => i.id === clarifyItemId);
  const updateItem = useUpdateItem();
  const completeItem = useCompleteItem();
  const deleteItem = useDeleteItem();
  const { data: projects } = useProjects("active");
  const { data: areas } = useAreas();
  const { data: tags } = useTags();
  const { data: itemTagIds } = useItemTags(clarifyItemId ?? "");
  const setItemTags = useSetItemTags();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setNotes(item.notes ?? "");
    }
  }, [item]);

  if (!item) return null;

  const saveField = (field: string, value: any) => {
    updateItem.mutate({ id: item.id, [field]: value });
  };

  const handleStateChange = (state: ItemState) => {
    updateItem.mutate({ id: item.id, state });
  };

  const handleComplete = () => {
    completeItem.mutate(item.id);
    setClarifyItemId(null);
  };

  const handleDelete = () => {
    deleteItem.mutate(item.id);
    setClarifyItemId(null);
  };

  const handleReactivate = () => {
    updateItem.mutate({ id: item.id, state: "inbox", completed_at: null });
  };

  const toggleTag = (tagId: string) => {
    const current = itemTagIds ?? [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    setItemTags.mutate({ itemId: item.id, tagIds: next });
  };

  return (
    <Sheet open={!!clarifyItemId} onOpenChange={(open) => !open && setClarifyItemId(null)}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Clarify Item</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 py-4">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== item.title && saveField("title", title)}
            className="text-base font-medium border-0 px-0 focus-visible:ring-0 shadow-none"
            placeholder="Item title"
          />

          {/* State chips */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">State</p>
            <div className="flex flex-wrap gap-1.5">
              {ITEM_STATE_OPTIONS.map((opt) => (
                <Badge
                  key={opt.value}
                  variant={item.state === opt.value ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer text-xs",
                    item.state === opt.value && "bg-primary"
                  )}
                  onClick={() => handleStateChange(opt.value)}
                >
                  {opt.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Project</p>
            <Select
              value={item.project_id ?? "none"}
              onValueChange={(v) => saveField("project_id", v === "none" ? null : v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {projects?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Area */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Area</p>
            <Select
              value={item.area_id ?? "none"}
              onValueChange={(v) => saveField("area_id", v === "none" ? null : v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {areas?.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Tags</p>
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
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Scheduled</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !item.scheduled_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {item.scheduled_date ? format(new Date(item.scheduled_date), "MMM d") : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.scheduled_date ? new Date(item.scheduled_date) : undefined}
                    onSelect={(d) => saveField("scheduled_date", d ? format(d, "yyyy-MM-dd") : null)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Due</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !item.due_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {item.due_date ? format(new Date(item.due_date), "MMM d") : "Set date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={item.due_date ? new Date(item.due_date) : undefined}
                    onSelect={(d) => saveField("due_date", d ? format(d, "yyyy-MM-dd") : null)}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Time estimate */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Time Estimate</p>
            <Select
              value={item.time_estimate?.toString() ?? "none"}
              onValueChange={(v) => saveField("time_estimate", v === "none" ? null : parseInt(v))}
            >
              <SelectTrigger className="h-9">
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

          {/* Notes */}
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Notes</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => notes !== (item.notes ?? "") && saveField("notes", notes)}
              placeholder="Add notes…"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {item.state === "completed" ? (
              <Button variant="outline" className="flex-1" onClick={handleReactivate}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              <Button className="flex-1 bg-success-green hover:bg-success-green/90" onClick={handleComplete}>
                Complete
              </Button>
            )}
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
