import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { ViewHeader } from "@/components/ViewHeader";
import { useCompletedItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { Input } from "@/components/ui/input";
import { isToday, isYesterday, isThisWeek } from "date-fns";

function groupByCompletion(items: any[]) {
  const groups: { label: string; items: any[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This Week", items: [] },
    { label: "Older", items: [] },
  ];

  for (const item of items) {
    const d = item.completed_at ? new Date(item.completed_at) : new Date();
    if (isToday(d)) groups[0].items.push(item);
    else if (isYesterday(d)) groups[1].items.push(item);
    else if (isThisWeek(d)) groups[2].items.push(item);
    else groups[3].items.push(item);
  }

  return groups.filter((g) => g.items.length > 0);
}

export default function LogbookView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useCompletedItems(selectedAreaId);
  const [search, setSearch] = useState("");

  const filtered = items?.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );
  const groups = filtered ? groupByCompletion(filtered) : [];

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Logbook" count={items?.length} />

      <div className="px-4 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search completed items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? null : groups.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No completed items"
            description="Your completed actions will appear here."
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
