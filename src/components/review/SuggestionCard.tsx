import { Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReviewSuggestion } from "@/hooks/useReview";

interface SuggestionCardProps {
  suggestion: ReviewSuggestion;
  itemTitle?: string;
  onAccept: (suggestion: ReviewSuggestion) => void;
  onDismiss: (suggestion: ReviewSuggestion) => void;
  disabled?: boolean;
}

export function SuggestionCard({
  suggestion,
  itemTitle,
  onAccept,
  onDismiss,
  disabled,
}: SuggestionCardProps) {
  const actionLabel = (() => {
    switch (suggestion.action) {
      case "move":
        return `Move to ${suggestion.target_state}`;
      case "complete":
        return "Mark complete";
      case "trash":
        return "Move to trash";
      case "create":
        return `Create: "${suggestion.suggested_title}"`;
      case "update":
        return "Update details";
      case "follow_up":
        return `Follow up: "${suggestion.suggested_title}"`;
      default:
        return suggestion.action;
    }
  })();

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
      <Sparkles className="h-4 w-4 mt-0.5 text-focus-gold shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        {itemTitle && (
          <p className="text-sm font-medium text-foreground truncate">{itemTitle}</p>
        )}
        <p className="text-xs text-primary font-medium">{actionLabel}</p>
        <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-success-green hover:text-success-green hover:bg-success-green/10"
          onClick={() => onAccept(suggestion)}
          disabled={disabled}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-overdue-red hover:bg-overdue-red/10"
          onClick={() => onDismiss(suggestion)}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
