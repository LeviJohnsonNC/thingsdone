import { useState } from "react";
import { cn } from "@/lib/utils";
import { TIME_ESTIMATE_OPTIONS, ENERGY_OPTIONS } from "@/lib/types";
import type { Item, Tag } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useTags, useAllItemTags } from "@/hooks/useTags";
import timeEstIcon from "@/assets/icons/time-est.svg";
import energyIcon from "@/assets/icons/energy.svg";

export interface ItemFilters {
  timeEstimate: string;
  energy: string;
  tagIds: string[];
}

export function useItemFilters() {
  const [filters, setFilters] = useState<ItemFilters>({ timeEstimate: "all", energy: "all", tagIds: [] });
  return { filters, setFilters };
}

export function applyItemFilters(
  items: Item[] | undefined,
  filters: ItemFilters,
  itemTagMap?: Map<string, string[]>
): Item[] {
  if (!items) return [];
  return items.filter((item) => {
    if (filters.timeEstimate !== "all") {
      const target = parseInt(filters.timeEstimate);
      if (item.time_estimate !== target) return false;
    }
    if (filters.energy !== "all") {
      if (item.energy !== filters.energy) return false;
    }
    if (filters.tagIds.length > 0 && itemTagMap) {
      const tags = itemTagMap.get(item.id) ?? [];
      if (!filters.tagIds.every((t) => tags.includes(t))) return false;
    }
    return true;
  });
}

interface ItemFilterBarProps {
  filters: ItemFilters;
  onChange: (filters: ItemFilters) => void;
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 whitespace-nowrap min-h-[36px]",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function ItemFilterBar({ filters, onChange }: ItemFilterBarProps) {
  const { data: tags } = useTags();

  const toggleTag = (tagId: string) => {
    const next = filters.tagIds.includes(tagId)
      ? filters.tagIds.filter((id) => id !== tagId)
      : [...filters.tagIds, tagId];
    onChange({ ...filters, tagIds: next });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 px-4 py-2 border-b border-border overflow-x-auto scrollbar-hide">
        {/* Time Estimate */}
        <div className="flex items-center gap-1.5 shrink-0">
          <img src={timeEstIcon} alt="Time" className="h-3.5 w-3.5 opacity-50" />
          <div className="inline-flex bg-muted rounded-lg p-0.5 gap-0.5">
            <FilterPill
              active={filters.timeEstimate === "all"}
              onClick={() => onChange({ ...filters, timeEstimate: "all" })}
            >
              All
            </FilterPill>
            {TIME_ESTIMATE_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.value}
                active={filters.timeEstimate === opt.value.toString()}
                onClick={() => onChange({ ...filters, timeEstimate: opt.value.toString() })}
              >
                {opt.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Energy */}
        <div className="flex items-center gap-1.5 shrink-0">
          <img src={energyIcon} alt="Energy" className="h-3.5 w-3.5 opacity-50" />
          <div className="inline-flex bg-muted rounded-lg p-0.5 gap-0.5">
            <FilterPill
              active={filters.energy === "all"}
              onClick={() => onChange({ ...filters, energy: "all" })}
            >
              All
            </FilterPill>
            {ENERGY_OPTIONS.map((opt) => (
              <FilterPill
                key={opt.value}
                active={filters.energy === opt.value}
                onClick={() => onChange({ ...filters, energy: opt.value })}
              >
                {opt.label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={filters.tagIds.includes(tag.id) ? "default" : "outline"}
                className="cursor-pointer text-xs shrink-0"
                onClick={() => toggleTag(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {/* Right fade hint */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
    </div>
  );
}
