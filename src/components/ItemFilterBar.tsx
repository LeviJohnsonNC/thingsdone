import { useState } from "react";
import { cn } from "@/lib/utils";
import { TIME_ESTIMATE_OPTIONS, ENERGY_OPTIONS } from "@/lib/types";
import type { EnergyLevel, Item } from "@/lib/types";
import timeEstIcon from "@/assets/icons/time-est.svg";
import energyIcon from "@/assets/icons/energy.svg";

export interface ItemFilters {
  timeEstimate: string;
  energy: string;
}

export function useItemFilters() {
  const [filters, setFilters] = useState<ItemFilters>({ timeEstimate: "all", energy: "all" });
  return { filters, setFilters };
}

export function applyItemFilters(items: Item[] | undefined, filters: ItemFilters): Item[] {
  if (!items) return [];
  return items.filter((item) => {
    if (filters.timeEstimate !== "all" && item.time_estimate) {
      if (item.time_estimate > parseInt(filters.timeEstimate)) return false;
    }
    if (filters.energy !== "all") {
      if ((item as any).energy !== filters.energy) return false;
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
        "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 whitespace-nowrap",
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
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-border overflow-x-auto">
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
    </div>
  );
}
