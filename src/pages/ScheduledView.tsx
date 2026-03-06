import { Calendar } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import {
  isToday, isThisWeek, isThisMonth, isAfter, endOfMonth
} from "date-fns";

function groupByDate(items: any[]) {
  const groups: { label: string; items: any[] }[] = [
    { label: "Today", items: [] },
    { label: "This Week", items: [] },
    { label: "This Month", items: [] },
    { label: "Later", items: [] },
  ];

  for (const item of items) {
    if (!item.scheduled_date) {
      groups[3].items.push(item);
      continue;
    }
    const d = new Date(item.scheduled_date);
    if (isToday(d)) groups[0].items.push(item);
    else if (isThisWeek(d)) groups[1].items.push(item);
    else if (isThisMonth(d)) groups[2].items.push(item);
    else groups[3].items.push(item);
  }

  return groups.filter((g) => g.items.length > 0);
}

export default function ScheduledView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("scheduled", selectedAreaId);

  const groups = items ? groupByDate(items) : [];

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Scheduled" count={items?.length} />
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
              {group.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
