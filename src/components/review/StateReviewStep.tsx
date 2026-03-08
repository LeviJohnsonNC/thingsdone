import { useItems } from "@/hooks/useItems";
import { useAppStore } from "@/stores/appStore";
import { ItemRow } from "@/components/ItemRow";
import { Button } from "@/components/ui/button";
import { SuggestionCard } from "./SuggestionCard";
import type { ReviewSuggestion } from "@/hooks/useReview";
import type { ItemState } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

interface StateReviewStepProps {
  state: ItemState;
  title: string;
  description: string;
  suggestions: ReviewSuggestion[];
  observations: string[];
  onAcceptSuggestion: (s: ReviewSuggestion) => void;
  onDismissSuggestion: (s: ReviewSuggestion) => void;
  onRequestAI: () => void;
  aiLoading: boolean;
}

export function StateReviewStep({
  state,
  title,
  description,
  suggestions,
  observations,
  onAcceptSuggestion,
  onDismissSuggestion,
  onRequestAI,
  aiLoading,
}: StateReviewStepProps) {
  const { data: items, isLoading } = useItems(state);
  const { setEditingItemId } = useAppStore();

  const isEmpty = !items?.length;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      {observations.length > 0 && (
        <div className="space-y-1">
          {observations.map((obs, i) => (
            <p key={i} className="text-xs text-muted-foreground italic">{obs}</p>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : isEmpty ? (
        <div className="flex items-center gap-2 py-6 justify-center text-success-green">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">No {title.toLowerCase()} items</span>
        </div>
      ) : (
        <div className="space-y-px rounded-lg border border-border overflow-hidden">
          {items?.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-foreground">AI suggestions:</p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => suggestions.forEach(onAcceptSuggestion)}
            >
              Accept all
            </Button>
          </div>
          {suggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              suggestion={s}
              itemTitle={items?.find((item) => item.id === s.item_id)?.title}
              onAccept={onAcceptSuggestion}
              onDismiss={onDismissSuggestion}
            />
          ))}
        </div>
      )}

      <Button
        onClick={onRequestAI}
        disabled={aiLoading || isEmpty}
        variant="outline"
        className="w-full"
      >
        {aiLoading ? "Analyzing..." : "Get AI Suggestions"}
      </Button>
    </div>
  );
}
