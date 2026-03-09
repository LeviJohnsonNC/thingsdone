import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface ChecklistEditorProps {
  checklist: ChecklistItem[];
  onChange: (checklist: ChecklistItem[]) => void;
}

export function ChecklistEditor({ checklist, onChange }: ChecklistEditorProps) {
  const [newText, setNewText] = useState("");

  const toggleItem = (index: number) => {
    const updated = checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(checklist.filter((_, i) => i !== index));
  };

  const addItem = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    onChange([...checklist, { text: trimmed, checked: false }]);
    setNewText("");
  };

  const updateText = (index: number, text: string) => {
    const updated = checklist.map((item, i) =>
      i === index ? { ...item, text } : item
    );
    onChange(updated);
  };

  const completedCount = checklist.filter((i) => i.checked).length;
  const totalCount = checklist.length;

  return (
    <div className="space-y-1.5">
      {totalCount > 0 && (
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Checklist {completedCount}/{totalCount}
        </p>
      )}

      {checklist.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-2 group"
        >
          <Checkbox
            checked={item.checked}
            onCheckedChange={() => toggleItem(i)}
            className="shrink-0"
          />
          <input
            value={item.text}
            onChange={(e) => updateText(i, e.target.value)}
            className={cn(
              "flex-1 bg-transparent text-sm border-0 outline-none py-1",
              item.checked && "line-through text-muted-foreground"
            )}
          />
          <button
            onClick={() => removeItem(i)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <form
        onSubmit={(e) => { e.preventDefault(); addItem(); }}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4 text-muted-foreground/50 shrink-0" />
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add checklist item…"
          className="flex-1 bg-transparent text-sm border-0 outline-none py-1 placeholder:text-muted-foreground/40"
        />
      </form>
    </div>
  );
}
