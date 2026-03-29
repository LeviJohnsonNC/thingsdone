import { parseLocalDate } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PropertyRow } from "./PropertyRow";
import dueIcon from "@/assets/icons/due.svg";
import scheduledIcon from "@/assets/icons/scheduled.svg";

interface ItemDatesProps {
  dueDate: string | null;
  scheduledDate: string | null;
  onDateChange: (field: "scheduled_date" | "due_date", d: Date | undefined) => void;
}

export function ItemDates({ dueDate, scheduledDate, onDateChange }: ItemDatesProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <PropertyRow icon={dueIcon} label="DUE" className="flex-1">
        <DatePicker
          value={dueDate}
          placeholder="No due date"
          onChange={(d) => onDateChange("due_date", d)}
        />
      </PropertyRow>

      <PropertyRow icon={scheduledIcon} label="SCHEDULED" className="flex-1">
        <DatePicker
          value={scheduledDate}
          placeholder="Not scheduled"
          onChange={(d) => onDateChange("scheduled_date", d)}
        />
      </PropertyRow>
    </div>
  );
}

function DatePicker({ value, placeholder, onChange }: { value: string | null; placeholder: string; onChange: (d: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "justify-start text-left font-normal text-sm h-8 px-2 w-full",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
          {value ? format(parseLocalDate(value), "MMM d, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? parseLocalDate(value) : undefined}
          onSelect={onChange}
          className="p-3 pointer-events-auto"
        />
        {value && (
          <div className="border-t p-2">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => onChange(undefined)}>
              Clear date
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
