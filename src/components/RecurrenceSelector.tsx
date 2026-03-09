import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

interface RecurrenceSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  compact?: boolean;
}

export function RecurrenceSelector({ value, onChange, compact }: RecurrenceSelectorProps) {
  return (
    <Select
      value={value ?? "none"}
      onValueChange={(v) => onChange(v === "none" ? null : v)}
    >
      <SelectTrigger className={compact ? "h-8 text-sm border-0 shadow-none px-2 bg-transparent" : "h-9"}>
        <SelectValue placeholder="No repeat" />
      </SelectTrigger>
      <SelectContent>
        {RECURRENCE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function getNextOccurrence(rule: string, fromDate?: string): string {
  const base = fromDate ? new Date(fromDate) : new Date();
  const next = new Date(base);

  switch (rule) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "biweekly":
      next.setDate(next.getDate() + 14);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setDate(next.getDate() + 1);
  }

  return next.toISOString().split("T")[0];
}
