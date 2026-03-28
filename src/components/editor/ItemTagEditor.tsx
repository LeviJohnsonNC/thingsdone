import { X, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTags, useItemTags, useSetItemTags } from "@/hooks/useTags";

interface ItemTagEditorProps {
  itemId: string;
}

export function ItemTagEditor({ itemId }: ItemTagEditorProps) {
  const { data: tags } = useTags();
  const { data: itemTagIds } = useItemTags(itemId);
  const setItemTags = useSetItemTags();

  const activeTagIds = itemTagIds ?? [];
  const activeTags = tags?.filter((t) => activeTagIds.includes(t.id)) ?? [];
  const availableTags = tags?.filter((t) => !activeTagIds.includes(t.id)) ?? [];

  const toggleTag = (tagId: string) => {
    const next = activeTagIds.includes(tagId)
      ? activeTagIds.filter((id) => id !== tagId)
      : [...activeTagIds, tagId];
    setItemTags.mutate({ itemId, tagIds: next });
  };

  return (
    <div className="px-4 pl-[52px] pb-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {activeTags.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
          >
            {tag.name}
            <button
              onClick={() => toggleTag(tag.id)}
              className="hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {availableTags.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 hover:border-primary text-muted-foreground/40 hover:text-primary transition-colors duration-150">
                <Plus className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="flex flex-col gap-1">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className="text-left text-sm px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
