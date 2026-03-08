import { Calendar, ExternalLink } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { ItemFilterBar, useItemFilters, applyItemFilters } from "@/components/ItemFilterBar";
import { useItems } from "@/hooks/useItems";
import { useAllItemTags } from "@/hooks/useTags";
import { useAppStore } from "@/stores/appStore";
import { useGoogleCalendarEvents, GoogleCalendarEvent } from "@/hooks/useGoogleCalendar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

interface MergedItem {
  type: "item" | "gcal";
  date: string;
  item?: any;
  gcalEvent?: GoogleCalendarEvent;
}

function getMergedItems(items: any[], gcalEvents: GoogleCalendarEvent[]): MergedItem[] {
  const merged: MergedItem[] = [];

  for (const item of items) {
    merged.push({
      type: "item",
      date: item.scheduled_date || item.due_date || "9999-12-31",
      item,
    });
  }

  for (const event of gcalEvents) {
    const dateStr = event.isAllDay ? event.start : event.start.split("T")[0];
    merged.push({
      type: "gcal",
      date: dateStr,
      gcalEvent: event,
    });
  }

  merged.sort((a, b) => a.date.localeCompare(b.date));
  return merged;
}

function groupByDate(merged: MergedItem[]) {
  const groups: { label: string; items: MergedItem[] }[] = [
    { label: "Today", items: [] },
    { label: "This Week", items: [] },
    { label: "This Month", items: [] },
    { label: "Later", items: [] },
  ];

  for (const m of merged) {
    if (m.date === "9999-12-31") {
      groups[3].items.push(m);
      continue;
    }
    const d = parseISO(m.date);
    if (isToday(d)) groups[0].items.push(m);
    else if (isThisWeek(d)) groups[1].items.push(m);
    else if (isThisMonth(d)) groups[2].items.push(m);
    else groups[3].items.push(m);
  }

  return groups.filter((g) => g.items.length > 0);
}

function GCalEventRow({ event }: { event: GoogleCalendarEvent }) {
  const timeStr = event.isAllDay
    ? "All day"
    : `${format(parseISO(event.start), "h:mm a")} – ${format(parseISO(event.end), "h:mm a")}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30 cursor-default">
            <Calendar className="h-4 w-4 text-primary/60 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{event.title}</p>
            </div>
            <Badge variant="outline" className="text-[10px] shrink-0 text-muted-foreground border-muted-foreground/30">
              GCal
            </Badge>
            <span className="text-xs text-muted-foreground shrink-0">{timeStr}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">Google Calendar event (read-only)</p>
          <p className="text-xs text-muted-foreground">{timeStr}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function ScheduledView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("scheduled", selectedAreaId);
  const { data: gcalEvents = [] } = useGoogleCalendarEvents();
  const { filters, setFilters } = useItemFilters();

  const filteredItems = applyItemFilters(items, filters);
  const merged = getMergedItems(filteredItems, gcalEvents);
  const groups = groupByDate(merged);
  const totalCount = filteredItems.length + gcalEvents.length;

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Scheduled" count={totalCount} />
      <ItemFilterBar filters={filters} onChange={setFilters} />
      <div className="flex-1">
        {isLoading ? null : groups.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Nothing scheduled"
            description="Schedule items to plan ahead."
          />
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground bg-muted/50">
                {group.label}
              </p>
              {group.items.map((m) =>
                m.type === "gcal" ? (
                  <GCalEventRow key={m.gcalEvent!.id} event={m.gcalEvent!} />
                ) : (
                  <ItemRow key={m.item!.id} item={m.item!} />
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
