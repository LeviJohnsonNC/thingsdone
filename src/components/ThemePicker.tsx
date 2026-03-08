import { cn } from "@/lib/utils";
import { THEME_PALETTES, type ThemePalette } from "@/lib/themes";
import { Check } from "lucide-react";

interface ThemePickerProps {
  value: string | null | undefined;
  onChange: (themeId: string) => void;
  allowNone?: boolean;
  onNone?: () => void;
}

function ThemeSwatch({ theme, selected, onClick }: { theme: ThemePalette; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all min-w-[72px]",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-muted-foreground/30"
      )}
    >
      <div className="flex gap-0.5">
        {theme.swatches.map((color, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-foreground leading-none">{theme.name}</span>
      {selected && <Check className="h-3 w-3 text-primary" />}
    </button>
  );
}

export function ThemePicker({ value, onChange, allowNone, onNone }: ThemePickerProps) {
  const currentId = value ?? "default";

  return (
    <div className="flex flex-wrap gap-2">
      {allowNone && (
        <button
          type="button"
          onClick={onNone}
          className={cn(
            "flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all min-w-[72px]",
            !value
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-muted-foreground/30"
          )}
        >
          <div className="flex gap-0.5">
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40" />
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40" />
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-muted-foreground/40" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground leading-none">Global</span>
          {!value && <Check className="h-3 w-3 text-primary" />}
        </button>
      )}
      {THEME_PALETTES.map((theme) => (
        <ThemeSwatch
          key={theme.id}
          theme={theme}
          selected={allowNone ? value === theme.id : currentId === theme.id}
          onClick={() => onChange(theme.id)}
        />
      ))}
    </div>
  );
}
