import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PropertyRow } from "./PropertyRow";
import scheduledIcon from "@/assets/icons/scheduled.svg";

interface ItemCalendarToggleProps {
  itemId: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ItemCalendarToggle({ itemId, checked, disabled, onCheckedChange }: ItemCalendarToggleProps) {
  return (
    <PropertyRow icon={scheduledIcon} label="CALENDAR">
      <div className="flex items-center gap-2 px-2">
        <Switch
          id={`gcal-${itemId}`}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="scale-90"
        />
        <Label htmlFor={`gcal-${itemId}`} className="text-sm text-muted-foreground cursor-pointer">
          Google Calendar
        </Label>
      </div>
    </PropertyRow>
  );
}
