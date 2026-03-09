import type { Tables } from "@/integrations/supabase/types";

export type Item = Tables<"items">;
export type Project = Tables<"projects">;
export type Area = Tables<"areas">;
export type Tag = Tables<"tags">;
export type ItemTag = Tables<"item_tags">;

export type ItemState = "inbox" | "next" | "scheduled" | "someday" | "waiting" | "reference" | "completed" | "trash";
export type ProjectState = "active" | "someday" | "scheduled" | "completed";

export type TimeEstimate = 5 | 15 | 30 | 60 | 120 | 240;
export type EnergyLevel = "low" | "medium" | "high";

export const ENERGY_OPTIONS: { value: EnergyLevel; label: string; dot: string }[] = [
  { value: "low", label: "Low", dot: "bg-success-green" },
  { value: "medium", label: "Med", dot: "bg-focus-gold" },
  { value: "high", label: "High", dot: "bg-overdue-red" },
];

export const TIME_ESTIMATE_OPTIONS: { value: TimeEstimate; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hr" },
  { value: 120, label: "2 hr" },
  { value: 240, label: "4 hr+" },
];

export const ITEM_STATE_OPTIONS: { value: ItemState; label: string }[] = [
  { value: "next", label: "Next" },
  { value: "scheduled", label: "Scheduled" },
  { value: "someday", label: "Someday" },
  { value: "waiting", label: "Waiting" },
  { value: "reference", label: "Reference" },
  { value: "trash", label: "Trash" },
];
