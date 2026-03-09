import { useMemo } from "react";
import { Hourglass } from "lucide-react";
import { QuickAddBar } from "@/components/QuickAddBar";
import { ViewHeader } from "@/components/ViewHeader";
import { ItemRow } from "@/components/ItemRow";
import { EmptyState } from "@/components/EmptyState";
import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { useIsMobile } from "@/hooks/use-mobile";

export default function WaitingView() {
  const { selectedAreaId } = useAppStore();
  const { data: items, isLoading } = useItems("waiting", selectedAreaId);
  const isMobile = useIsMobile();

  const grouped = useMemo(() => {
    if (!items) return [];
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const key = (item as any).waiting_on || "Unassigned";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    // Sort groups: Unassigned last
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
  }, [items]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ViewHeader title="Waiting" count={items?.length} />

      <div className="flex-1 overflow-y-auto">
        {grouped.length === 0 ? (
          <EmptyState
            icon={Hourglass}
            title="Nothing waiting"
            description="Items delegated to others will appear here."
          />
        ) : (
          <div className="divide-y divide-border">
            {grouped.map(([contactName, groupItems]) => (
              <div key={contactName}>
                <div className="px-4 py-2 bg-muted/40">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {contactName}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground/60">{groupItems.length}</span>
                </div>
                {groupItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
